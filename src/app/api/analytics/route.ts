import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { Prisma } from "@/generated/prisma/client";

const COLORS = ["#E63946", "#1D3557", "#F4A261", "#2A9D8F", "#E9C46A", "#264653"];

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const period = searchParams.get("period") || "7d";
    const type = searchParams.get("type") || "overview";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const where: Prisma.OrderWhereInput = {
      createdAt: { gte: startDate },
    };
    if (restaurantId) where.restaurantId = restaurantId;

    if (type === "overview" && restaurantId) {
      // 1. Core aggregates
      const stats = await prisma.order.aggregate({
        where,
        _sum: { total: true },
        _count: { _all: true },
        _avg: { total: true },
      });

      const totalRevenue = stats._sum.total || 0;
      const totalOrders = stats._count._all;
      const averageOrderValue = stats._avg.total || 0;

      // 2. Customer count (distinct IDs)
      const customerResult: { count: bigint }[] = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "customerId") as count
        FROM "Order"
        WHERE "restaurantId" = ${restaurantId} AND "createdAt" >= ${startDate} AND "customerId" IS NOT NULL
      `;
      const totalCustomers = Number(customerResult[0]?.count ?? 0);

      // 3. Completed orders for rate calculation
      const completedOrders = await prisma.order.count({
        where: {
          ...where,
          status: { in: ["completed", "picked_up", "delivered"] }
        }
      });

      // 4. Revenue by Day (Raw SQL for proper date grouping)
      const revenueByDayRaw: { date: string; revenue: number; orders: number }[] = await prisma.$queryRaw`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM-DD') as date,
          SUM(total) as revenue,
          COUNT(*)::int as orders
        FROM "Order"
        WHERE "restaurantId" = ${restaurantId} AND "createdAt" >= ${startDate}
        GROUP BY 1
        ORDER BY 1 ASC
      `;

      // 5. Top Items (Raw SQL to join OrderItems and MenuItems)
      const topItemsRaw: { name: string; quantity: number; revenue: number }[] = await prisma.$queryRaw`
        SELECT 
          mi.name, 
          SUM(oi.quantity)::int as quantity, 
          SUM(oi."totalPrice") as revenue
        FROM "OrderItem" oi
        JOIN "MenuItem" mi ON oi."menuItemId" = mi.id
        JOIN "Order" o ON oi."orderId" = o.id
        WHERE o."restaurantId" = ${restaurantId} AND o."createdAt" >= ${startDate}
        GROUP BY mi.name
        ORDER BY quantity DESC
        LIMIT 10
      `;

      // 6. Order Types (groupBy)
      const orderTypesRaw = await prisma.order.groupBy({
        by: ['orderType'],
        where,
        _count: { _all: true }
      });

      const orderTypes = orderTypesRaw.map((ot, i) => ({
        name: ot.orderType.charAt(0).toUpperCase() + ot.orderType.slice(1),
        value: Math.round((ot._count._all / (totalOrders || 1)) * 100),
        color: COLORS[i % COLORS.length]
      }));

      // 7. Payment Methods (groupBy)
      const paymentMethodsRaw = await prisma.order.groupBy({
        by: ['paymentMethod'],
        where,
        _count: { _all: true }
      });

      const paymentMethods = paymentMethodsRaw.map((pm, i) => ({
        name: (pm.paymentMethod || "Other").charAt(0).toUpperCase() + (pm.paymentMethod || "Other").slice(1),
        value: Math.round((pm._count._all / (totalOrders || 1)) * 100),
        color: COLORS[(i + 2) % COLORS.length] // Offset colors slightly
      }));

      // 8. Orders by Hour (Raw SQL)
      const ordersByHourRaw: { hour: number; orders: number }[] = await prisma.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM "createdAt")::int as hour,
          COUNT(*)::int as orders
        FROM "Order"
        WHERE "restaurantId" = ${restaurantId} AND "createdAt" >= ${startDate}
        GROUP BY 1
        ORDER BY 1 ASC
      `;

      // Fill in missing hours
      const ordersByHour = Array.from({ length: 24 }, (_, i) => {
        const found = ordersByHourRaw.find(h => h.hour === i);
        return {
          hour: `${i}:00`,
          orders: found ? found.orders : 0
        };
      });

      return NextResponse.json({
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        totalCustomers,
        completedOrders,
        completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
        revenueByDay: revenueByDayRaw.map(r => ({
          ...r,
          revenue: Math.round(r.revenue * 100) / 100
        })),
        topItems: topItemsRaw.map(r => ({
          ...r,
          revenue: Math.round(r.revenue * 100) / 100
        })),
        orderTypes,
        paymentMethods,
        ordersByHour
      });
    }

    if (type === "platform") {
      // Previous-period start date for growth calculation
      const periodMs = now.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodMs);

      const [totalRestaurants, totalUsers, totalOrders, stats] = await Promise.all([
        prisma.restaurant.count(),
        prisma.user.count(),
        prisma.order.count({ where }),
        prisma.order.aggregate({
          where,
          _sum: { total: true }
        })
      ]);

      const totalRevenue = stats._sum.total || 0;
      const settings = await prisma.platformSettings.findUnique({
        where: { id: "default" },
      });
      const feePercent = settings?.platformFeePercent || 2.5;
      const platformFees = totalRevenue * (feePercent / 100);

      // Top restaurants — current period revenue with previous-period growth
      const topRestaurantsRaw: {
        id: string;
        name: string;
        revenue: number;
        orders: number;
        previousRevenue: number;
      }[] = await prisma.$queryRaw`
        SELECT
          r.id,
          r.name,
          COALESCE(SUM(CASE WHEN o."createdAt" >= ${startDate} THEN o.total ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN o."createdAt" >= ${startDate} THEN 1 ELSE 0 END), 0)::int as orders,
          COALESCE(SUM(CASE WHEN o."createdAt" >= ${previousStartDate} AND o."createdAt" < ${startDate} THEN o.total ELSE 0 END), 0) as "previousRevenue"
        FROM "Restaurant" r
        LEFT JOIN "Order" o ON o."restaurantId" = r.id
          AND o."createdAt" >= ${previousStartDate}
        GROUP BY r.id, r.name
        ORDER BY revenue DESC
        LIMIT 10
      `;

      const topRestaurants = topRestaurantsRaw.map((r) => {
        const revenue = Math.round(r.revenue * 100) / 100;
        const previousRevenue = Math.round(r.previousRevenue * 100) / 100;
        let growth = "—";
        if (previousRevenue > 0) {
          const pct = ((revenue - previousRevenue) / previousRevenue) * 100;
          growth = `${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%`;
        } else if (revenue > 0) {
          growth = "new";
        }
        return {
          id: r.id,
          name: r.name,
          revenue,
          orders: r.orders,
          growth,
        };
      });

      // Orders per restaurant — for the horizontal bar chart
      const ordersPerRestaurant = topRestaurants.map((r) => ({
        name: r.name,
        orders: r.orders,
      }));

      // Revenue breakdown pie — top 5 + "Others"
      const PIE_COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
      const top5 = topRestaurants.slice(0, 5);
      const othersRevenue = topRestaurants
        .slice(5)
        .reduce((sum, r) => sum + r.revenue, 0);
      const revenueByRestaurant = top5
        .map((r, i) => ({
          name: r.name,
          value: r.revenue,
          color: PIE_COLORS[i],
        }))
        .filter((r) => r.value > 0);
      if (othersRevenue > 0) {
        revenueByRestaurant.push({
          name: "Others",
          value: Math.round(othersRevenue * 100) / 100,
          color: "#6b7280",
        });
      }

      // Revenue by day (Raw SQL)
      const revenueByDayRaw: { date: string; revenue: number }[] = await prisma.$queryRaw`
        SELECT
          TO_CHAR("createdAt", 'YYYY-MM-DD') as date,
          SUM(total) as revenue
        FROM "Order"
        WHERE "createdAt" >= ${startDate}
        GROUP BY 1
        ORDER BY 1 ASC
      `;

      return NextResponse.json({
        totalRestaurants,
        totalUsers,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        platformFees: Math.round(platformFees * 100) / 100,
        feePercent,
        topRestaurants,
        ordersPerRestaurant,
        revenueByRestaurant,
        revenueByDay: revenueByDayRaw.map(r => ({
          ...r,
          revenue: Math.round(r.revenue * 100) / 100
        }))
      });
    }

    return NextResponse.json({ error: "Invalid type or missing restaurantId" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

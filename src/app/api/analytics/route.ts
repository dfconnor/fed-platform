import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

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

    const where: Record<string, unknown> = {
      createdAt: { gte: startDate },
    };
    if (restaurantId) where.restaurantId = restaurantId;

    if (type === "overview") {
      const orders = await prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              menuItem: { select: { name: true } },
            },
          },
        },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const completedOrders = orders.filter(
        (o) =>
          o.status === "completed" ||
          o.status === "picked_up" ||
          o.status === "delivered"
      ).length;

      // Revenue by day
      const revenueByDay: Record<string, number> = {};
      const ordersByDay: Record<string, number> = {};
      orders.forEach((o) => {
        const day = o.createdAt.toISOString().split("T")[0];
        revenueByDay[day] = (revenueByDay[day] || 0) + o.total;
        ordersByDay[day] = (ordersByDay[day] || 0) + 1;
      });

      // Top items
      const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
      orders.forEach((o) => {
        o.items.forEach((item) => {
          const name = item.menuItem.name;
          if (!itemCounts[name]) {
            itemCounts[name] = { name, count: 0, revenue: 0 };
          }
          itemCounts[name].count += item.quantity;
          itemCounts[name].revenue += item.totalPrice;
        });
      });
      const topItems = Object.values(itemCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Order types
      const orderTypes: Record<string, number> = {};
      orders.forEach((o) => {
        orderTypes[o.orderType] = (orderTypes[o.orderType] || 0) + 1;
      });

      // Payment methods
      const paymentMethods: Record<string, number> = {};
      orders.forEach((o) => {
        const method = o.paymentMethod || "unknown";
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
      });

      // Orders by hour
      const ordersByHour: Record<number, number> = {};
      orders.forEach((o) => {
        const hour = o.createdAt.getHours();
        ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
      });

      return NextResponse.json({
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100,
          averageOrderValue: Math.round(avgOrderValue * 100) / 100,
          completedOrders,
          completionRate:
            totalOrders > 0
              ? Math.round((completedOrders / totalOrders) * 100)
              : 0,
        },
        revenueByDay: Object.entries(revenueByDay)
          .map(([date, revenue]) => ({
            date,
            revenue: Math.round(revenue * 100) / 100,
            orders: ordersByDay[date] || 0,
          }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        topItems,
        orderTypes: Object.entries(orderTypes).map(([type, count]) => ({
          type,
          count,
        })),
        paymentMethods: Object.entries(paymentMethods).map(
          ([method, count]) => ({ method, count })
        ),
        ordersByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: ordersByHour[i] || 0,
        })),
      });
    }

    if (type === "platform") {
      const [totalRestaurants, totalUsers, totalOrders, orders] =
        await Promise.all([
          prisma.restaurant.count(),
          prisma.user.count(),
          prisma.order.count({ where }),
          prisma.order.findMany({
            where,
            select: {
              total: true,
              createdAt: true,
              restaurantId: true,
              restaurant: { select: { name: true } },
            },
          }),
        ]);

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const settings = await prisma.platformSettings.findUnique({
        where: { id: "default" },
      });
      const feePercent = settings?.platformFeePercent || 2.5;
      const platformFees = totalRevenue * (feePercent / 100);

      // Revenue by restaurant
      const revenueByRestaurant: Record<string, { name: string; revenue: number; orders: number }> = {};
      orders.forEach((o) => {
        const name = o.restaurant.name;
        if (!revenueByRestaurant[o.restaurantId]) {
          revenueByRestaurant[o.restaurantId] = {
            name,
            revenue: 0,
            orders: 0,
          };
        }
        revenueByRestaurant[o.restaurantId].revenue += o.total;
        revenueByRestaurant[o.restaurantId].orders += 1;
      });

      // Revenue by day
      const revenueByDay: Record<string, number> = {};
      orders.forEach((o) => {
        const day = o.createdAt.toISOString().split("T")[0];
        revenueByDay[day] = (revenueByDay[day] || 0) + o.total;
      });

      return NextResponse.json({
        summary: {
          totalRestaurants,
          totalUsers,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          platformFees: Math.round(platformFees * 100) / 100,
          feePercent,
        },
        revenueByRestaurant: Object.values(revenueByRestaurant)
          .sort((a, b) => b.revenue - a.revenue),
        revenueByDay: Object.entries(revenueByDay)
          .map(([date, revenue]) => ({
            date,
            revenue: Math.round(revenue * 100) / 100,
          }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

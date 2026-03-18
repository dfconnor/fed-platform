import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    // Orders list requires auth — scoped to the user's restaurant or their own orders
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (restaurantId) where.restaurantId = restaurantId;
    if (customerId) where.customerId = customerId;
    if (status && status !== "all") where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              menuItem: { select: { name: true, imageUrl: true } },
              modifiers: true,
            },
          },
          customer: { select: { name: true, email: true, phone: true } },
          restaurant: { select: { name: true, slug: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST — Order creation is handled by the createOrder server action in lib/actions.ts.
// The cart page imports and calls createOrder directly. This avoids duplicated logic
// (the previous POST handler here had different discount calculations and set
// paymentStatus: "paid" without actually collecting payment).

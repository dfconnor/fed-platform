import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateOrderSchema } from "@/lib/validations";
import { requireRestaurantOwner } from "@/lib/api-auth";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            menuItem: { select: { name: true, imageUrl: true } },
            modifiers: true,
          },
        },
        restaurant: {
          select: {
            name: true,
            slug: true,
            phone: true,
            primaryColor: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Access control: allow the order's customer, the restaurant owner, or admins
    const session = await auth();
    const userId = session?.user?.id;
    const userRole = (session?.user as { role?: string })?.role;

    const isOrderCustomer = order.customerId && order.customerId === userId;
    const isAdmin = userRole === "admin";

    // For restaurant owners, check ownership
    let isRestaurantOwner = false;
    if (userId && !isOrderCustomer && !isAdmin) {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: order.restaurantId },
        select: { ownerId: true },
      });
      isRestaurantOwner = restaurant?.ownerId === userId;
    }

    // Guest orders (no customerId) can be viewed by anyone with the order ID
    // This is intentional — guests get an order confirmation page with their order ID
    const isGuestOrder = !order.customerId;

    if (!isGuestOrder && !isOrderCustomer && !isRestaurantOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify the caller owns the restaurant this order belongs to
    const existing = await prisma.order.findUnique({
      where: { id },
      select: { restaurantId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const authResult = await requireRestaurantOwner(existing.restaurantId);
    if (authResult.error) return authResult.error;

    const body = await req.json();

    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status, kitchenNotes, paymentStatus } = parsed.data;

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status === "completed" || status === "delivered") {
        updateData.completedAt = new Date();
      }
    }

    if (kitchenNotes !== undefined) updateData.kitchenNotes = kitchenNotes;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            menuItem: { select: { name: true } },
            modifiers: true,
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

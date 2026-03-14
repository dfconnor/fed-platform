import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateOrderSchema } from "@/lib/validations";

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
        customer: { select: { name: true, email: true, phone: true } },
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

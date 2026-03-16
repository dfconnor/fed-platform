import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { createOrderSchema } from "@/lib/validations";
import { requireAuth, requireRestaurantOwner } from "@/lib/api-auth";

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FED-${code}`;
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      restaurantId,
      customerId,
      items,
      orderType,
      tableNumber,
      customerNotes,
      customerName,
      customerEmail,
      customerPhone,
      tipAmount,
      paymentMethod,
      promoCode,
    } = parsed.data;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const restaurant = await tx.restaurant.findUnique({
        where: { id: restaurantId },
      });

      if (!restaurant || !restaurant.acceptsOrders) {
        throw new Error("Restaurant is not accepting orders");
      }

      // Calculate pricing
      let subtotal = 0;
      const orderItems: Array<{
        menuItemId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        notes?: string;
        modifiers?: { create: Array<{ modifierId: string; name: string; price: number }> };
      }> = [];

      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId },
        });

        if (!menuItem) continue;

        let itemTotal = menuItem.price;
        const modifierCreates: Array<{ modifierId: string; name: string; price: number }> = [];

        if (item.modifiers) {
          for (const mod of item.modifiers) {
            const modifier = await tx.modifier.findUnique({
              where: { id: mod.modifierId },
            });
            if (modifier) {
              itemTotal += modifier.priceAdjustment;
              modifierCreates.push({
                modifierId: modifier.id,
                name: modifier.name,
                price: modifier.priceAdjustment,
              });
            }
          }
        }

        const totalPrice = itemTotal * (item.quantity || 1);
        subtotal += totalPrice;

        orderItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity || 1,
          unitPrice: itemTotal,
          totalPrice,
          notes: item.notes,
          ...(modifierCreates.length > 0
            ? { modifiers: { create: modifierCreates } }
            : {}),
        });
      }

      // Apply promo code
      let discountAmount = 0;
      if (promoCode) {
        const promo = await tx.promotion.findFirst({
          where: {
            restaurantId,
            code: promoCode.toUpperCase(),
            isActive: true,
            startsAt: { lte: new Date() },
            expiresAt: { gte: new Date() },
          },
        });

        if (promo && subtotal >= promo.minOrder) {
          if (promo.maxUses === null || promo.usedCount < promo.maxUses) {
            discountAmount =
              promo.discountType === "percentage"
                ? subtotal * (promo.discountValue / 100)
                : promo.discountValue;

            await tx.promotion.update({
              where: { id: promo.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      const taxAmount = (subtotal - discountAmount) * restaurant.taxRate;
      const serviceFee = restaurant.serviceFee;
      const deliveryFee = orderType === "delivery" ? 4.99 : 0;
      const total =
        subtotal - discountAmount + taxAmount + serviceFee + deliveryFee + tipAmount;

      const orderNumber = generateOrderNumber();
      const estimatedReady = new Date(
        Date.now() + restaurant.estimatedPrepTime * 60000
      );

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          restaurantId,
          customerId: customerId || null,
          orderType: orderType || "pickup",
          tableNumber,
          subtotal,
          taxAmount,
          serviceFee,
          deliveryFee,
          tipAmount,
          discountAmount,
          total,
          paymentMethod: paymentMethod || "card",
          paymentStatus: "paid",
          status: "pending",
          customerNotes,
          customerName,
          customerEmail,
          customerPhone,
          estimatedReady,
          items: { create: orderItems },
        },
        include: {
          items: {
            include: {
              menuItem: { select: { name: true } },
              modifiers: true,
            },
          },
        },
      });

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

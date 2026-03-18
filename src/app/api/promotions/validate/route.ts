/**
 * GET /api/promotions/validate?restaurantId=X&code=Y
 *
 * Public endpoint — guests need to validate promo codes during checkout.
 * Returns the discount type and value if valid, 404 if not.
 * Does NOT increment usedCount (that happens at order creation).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const code = searchParams.get("code");

    if (!restaurantId || !code) {
      return NextResponse.json(
        { error: "restaurantId and code are required" },
        { status: 400 }
      );
    }

    const promo = await prisma.promotion.findFirst({
      where: {
        restaurantId,
        code: code.toUpperCase(),
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() },
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrder: true,
        maxUses: true,
        usedCount: true,
      },
    });

    if (!promo || (promo.maxUses !== null && promo.usedCount >= promo.maxUses)) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 });
    }

    return NextResponse.json({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrder: promo.minOrder,
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return NextResponse.json({ error: "Failed to validate promo" }, { status: 500 });
  }
}

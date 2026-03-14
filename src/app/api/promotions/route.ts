/**
 * /api/promotions — CRUD for restaurant promotions / discount codes.
 *
 * GET    ?restaurantId=X   — list promotions for a restaurant
 * POST   { restaurantId, code, discountType, ... }  — create a promotion
 * PATCH  { id, ...fields } — update a promotion
 * DELETE ?id=X             — delete a promotion
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createPromotionSchema, updatePromotionSchema } from "@/lib/validations";

// ---------------------------------------------------------------------------
// GET — List promotions for a restaurant
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    const promotions = await prisma.promotion.findMany({
      where: { restaurantId },
      orderBy: { startsAt: "desc" },
    });

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Create a new promotion
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createPromotionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      restaurantId,
      code,
      description,
      discountType,
      discountValue,
      minOrder,
      maxUses,
      startsAt,
      expiresAt,
      isActive,
    } = parsed.data;

    const promotion = await prisma.promotion.create({
      data: {
        restaurantId,
        code: code.toUpperCase(),
        description: description || "",
        discountType,
        discountValue,
        minOrder,
        maxUses: maxUses ?? null,
        startsAt: new Date(startsAt),
        expiresAt: new Date(expiresAt),
        isActive,
      },
    });

    return NextResponse.json({ promotion }, { status: 201 });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update an existing promotion
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = updatePromotionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...fields } = parsed.data;

    // Coerce types for Prisma
    const data: Record<string, unknown> = { ...fields };
    if (data.code) data.code = (data.code as string).toUpperCase();
    if (data.discountValue !== undefined) data.discountValue = parseFloat(data.discountValue as string);
    if (data.minOrder !== undefined) data.minOrder = parseFloat(data.minOrder as string) || 0;
    if (data.maxUses !== undefined) data.maxUses = data.maxUses ? parseInt(data.maxUses as string) : null;
    if (data.startsAt) data.startsAt = new Date(data.startsAt as string);
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt as string);

    const promotion = await prisma.promotion.update({
      where: { id },
      data,
    });

    return NextResponse.json({ promotion });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE — Remove a promotion
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Promotion id is required" },
        { status: 400 }
      );
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}

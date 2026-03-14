/**
 * /api/admin/restaurants — Admin-level restaurant management.
 *
 * Unlike /api/restaurants (public, active-only), this returns ALL restaurants
 * with owner info, order counts, revenue, and ratings for the admin panel.
 *
 * GET    ?status=active|pending|inactive&search=  — list all restaurants
 * PATCH  { id, isActive?, ... }                   — update restaurant (approve, toggle)
 * DELETE ?id=X                                    — remove a restaurant
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const adminRestaurantPatchSchema = z
  .object({
    id: z.string().min(1),
  })
  .passthrough();

// ---------------------------------------------------------------------------
// GET — List all restaurants with aggregated stats
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      if (status === "active") where.isActive = true;
      else if (status === "inactive") where.isActive = false;
      // "pending" could be: isActive = false and no orders yet (new restaurants)
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { owner: { name: { contains: search } } },
        { owner: { email: { contains: search } } },
      ];
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { orders: true, reviews: true } },
        reviews: { select: { rating: true } },
        orders: { select: { total: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to the shape the admin UI expects
    const result = restaurants.map((r) => {
      const totalRevenue = r.orders.reduce((sum, o) => sum + o.total, 0);
      const avgRating =
        r.reviews.length > 0
          ? r.reviews.reduce((sum, rev) => sum + rev.rating, 0) / r.reviews.length
          : 0;

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        owner: r.owner.name || "Unknown",
        ownerEmail: r.owner.email,
        city: r.city || "",
        state: r.state || "",
        status: r.isActive ? "active" : "inactive",
        totalOrders: r._count.orders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: r._count.reviews,
        joinedAt: r.createdAt.toISOString().split("T")[0],
        isActive: r.isActive,
      };
    });

    return NextResponse.json({ restaurants: result });
  } catch (error) {
    console.error("Error fetching admin restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update a restaurant (approve, toggle active, etc.)
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = adminRestaurantPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...fields } = parsed.data;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: fields,
    });

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to update restaurant" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE — Remove a restaurant (admin reject/remove)
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Restaurant id is required" },
        { status: 400 }
      );
    }

    await prisma.restaurant.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { error: "Failed to delete restaurant" },
      { status: 500 }
    );
  }
}

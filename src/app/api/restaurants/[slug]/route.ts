import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateRestaurantSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // When includeInactive=true (used by dashboard), return ALL categories/items.
    // Otherwise (public menu), only return active ones.
    const includeInactive =
      req.nextUrl.searchParams.get("includeInactive") === "true";

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        owner: { select: { name: true } },
        categories: {
          ...(includeInactive ? {} : { where: { isActive: true } }),
          orderBy: { sortOrder: "asc" },
          include: {
            items: {
              ...(includeInactive ? {} : { where: { isActive: true } }),
              orderBy: { sortOrder: "asc" },
              include: {
                modifierGroups: {
                  orderBy: { sortOrder: "asc" },
                  include: {
                    modifiers: {
                      orderBy: { sortOrder: "asc" },
                    },
                  },
                },
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const avgRating =
      restaurant.reviews.length > 0
        ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) /
          restaurant.reviews.length
        : 0;

    return NextResponse.json({
      restaurant: {
        ...restaurant,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: restaurant.reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const parsed = updateRestaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.update({
      where: { slug },
      data: parsed.data,
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

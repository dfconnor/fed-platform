import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createRestaurantSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const ownerId = searchParams.get("ownerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {
      ...(ownerId ? { ownerId } : { isActive: true }),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { city: { contains: search } },
            ],
          }
        : {}),
    };

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { name: true } },
          categories: {
            include: {
              items: {
                where: { isActive: true },
                select: { id: true },
              },
            },
          },
          reviews: {
            select: { rating: true },
          },
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.restaurant.count({ where }),
    ]);

    const data = restaurants.map((r) => {
      const avgRating =
        r.reviews.length > 0
          ? r.reviews.reduce((sum, rev) => sum + rev.rating, 0) / r.reviews.length
          : 0;
      const itemCount = r.categories.reduce(
        (sum, cat) => sum + cat.items.length,
        0
      );
      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        description: r.description,
        logoUrl: r.logoUrl,
        bannerUrl: r.bannerUrl,
        city: r.city,
        state: r.state,
        primaryColor: r.primaryColor,
        estimatedPrepTime: r.estimatedPrepTime,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: r.reviews.length,
        itemCount,
        orderCount: r._count.orders,
        owner: r.owner,
      };
    });

    return NextResponse.json({
      restaurants: data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createRestaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, description, ownerId, ...rest } = parsed.data;

    const existingSlug = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "This URL slug is already taken" },
        { status: 409 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: { name, slug, description, ownerId, ...rest },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}

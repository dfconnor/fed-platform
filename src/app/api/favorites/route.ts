/**
 * Favorites API Route
 *
 * GET  /api/favorites - List the current user's favorited listings
 * POST /api/favorites - Toggle favorite status on a listing
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/favorites
 * List all listings the authenticated user has favorited, with
 * listing details and images for display.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          listing: {
            include: {
              images: {
                orderBy: { order: 'asc' },
                take: 3,
              },
              host: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  hostTier: true,
                },
              },
              _count: {
                select: { reviews: true },
              },
            },
          },
        },
      }),
      prisma.favorite.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

/** Zod schema for toggling a favorite */
const toggleFavoriteSchema = z.object({
  listingId: z.string().min(1),
});

/**
 * POST /api/favorites
 * Toggle a listing as a favorite. If the listing is already favorited,
 * it is removed from favorites. If not, it is added.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = toggleFavoriteSchema.parse(body);

    // Verify listing exists
    const listing = await prisma.rVListing.findUnique({
      where: { id: data.listingId },
      select: { id: true, status: true },
    });

    if (!listing || listing.status === 'ARCHIVED') {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: data.listingId,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        favorited: false,
        listingId: data.listingId,
      });
    } else {
      // Add favorite
      const favorite = await prisma.favorite.create({
        data: {
          userId: session.user.id,
          listingId: data.listingId,
        },
      });

      return NextResponse.json(
        {
          favorited: true,
          listingId: data.listingId,
          id: favorite.id,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/favorites error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}

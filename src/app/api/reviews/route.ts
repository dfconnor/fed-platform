/**
 * Reviews API Route
 *
 * GET  /api/reviews - List reviews for a listing or user
 * POST /api/reviews - Create a review (must have completed booking, within 14 days)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reviews
 * Fetch reviews for a specific listing or user. Supports pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'GUEST_TO_HOST' or 'HOST_TO_GUEST'
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    if (!listingId && !userId) {
      return NextResponse.json(
        { error: 'Either listingId or userId is required' },
        { status: 400 }
      );
    }

    const where: any = {};

    if (listingId) {
      where.listingId = listingId;
    }

    if (userId) {
      where.subjectId = userId;
    }

    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              images: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Calculate aggregate ratings if filtering by listing
    let aggregateRatings = null;
    if (listingId) {
      const agg = await prisma.review.aggregate({
        where: { listingId },
        _avg: {
          rating: true,
          cleanliness: true,
          accuracy: true,
          communication: true,
          value: true,
        },
        _count: { rating: true },
      });
      aggregateRatings = {
        averageRating: agg._avg.rating,
        averageCleanliness: agg._avg.cleanliness,
        averageAccuracy: agg._avg.accuracy,
        averageCommunication: agg._avg.communication,
        averageValue: agg._avg.value,
        totalReviews: agg._count.rating,
      };
    }

    return NextResponse.json({
      reviews,
      aggregateRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/** Zod schema for creating a review */
const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).optional(),
  accuracy: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  value: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(2000),
});

/** Maximum days after booking completion to leave a review */
const REVIEW_WINDOW_DAYS = 14;

/**
 * POST /api/reviews
 * Create a review for a completed booking. The reviewer must be a party
 * to the booking (guest or host), the booking must be completed, and
 * the review must be submitted within 14 days of completion.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      select: {
        id: true,
        status: true,
        guestId: true,
        hostId: true,
        listingId: true,
        endDate: true,
        updatedAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Must be guest or host
    const isGuest = booking.guestId === session.user.id;
    const isHost = booking.hostId === session.user.id;
    if (!isGuest && !isHost) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Booking must be completed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only review completed bookings' },
        { status: 400 }
      );
    }

    // Check 14-day review window
    const daysSinceEnd = Math.floor(
      (Date.now() - booking.endDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceEnd > REVIEW_WINDOW_DAYS) {
      return NextResponse.json(
        { error: `Review window has closed (${REVIEW_WINDOW_DAYS} days after trip end)` },
        { status: 400 }
      );
    }

    // Check if a review already exists for this booking by this user
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: data.bookingId,
        authorId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 409 }
      );
    }

    // Determine review type and subject
    const type = isGuest ? 'GUEST_TO_HOST' : 'HOST_TO_GUEST';
    const subjectId = isGuest ? booking.hostId : booking.guestId;

    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        listingId: booking.listingId,
        authorId: session.user.id,
        subjectId,
        type,
        rating: data.rating,
        cleanliness: data.cleanliness,
        accuracy: data.accuracy,
        communication: data.communication,
        value: data.value,
        comment: data.comment,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Update listing average rating and total reviews count
    if (type === 'GUEST_TO_HOST') {
      const aggregation = await prisma.review.aggregate({
        where: {
          listingId: booking.listingId,
          type: 'GUEST_TO_HOST',
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.rVListing.update({
        where: { id: booking.listingId },
        data: {
          averageRating: aggregation._avg.rating || 0,
          totalReviews: aggregation._count.rating,
        },
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

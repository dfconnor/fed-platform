/**
 * Single Listing API Route
 *
 * GET    /api/listings/:id - Fetch listing with host info, images, reviews, availability
 * PUT    /api/listings/:id - Update listing (host only)
 * DELETE /api/listings/:id - Soft delete / archive listing (host only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/listings/:id
 * Fetch a single listing with all associated data including host profile,
 * images, reviews, availability calendar, and add-ons.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const listing = await prisma.rVListing.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            hostTier: true,
            idVerified: true,
            createdAt: true,
            _count: {
              select: {
                listings: true,
                reviewsReceived: true,
              },
            },
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        availability: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: { date: 'asc' },
        },
        addOns: true,
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Don't expose archived/draft listings to non-owners
    if (listing.status === 'ARCHIVED') {
      const session = await getServerSession(authOptions);
      if (session?.user?.id !== listing.hostId) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
      }
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('GET /api/listings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

/** Zod schema for updating a listing (all fields optional) */
const updateListingSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(5000).optional(),
  rvType: z.enum([
    'CLASS_A', 'CLASS_B', 'CLASS_C', 'TRAVEL_TRAILER', 'FIFTH_WHEEL',
    'POP_UP', 'TRUCK_CAMPER', 'TOY_HAULER', 'CAMPERVAN', 'TEARDROP',
    'AIRSTREAM', 'OTHER',
  ]).optional(),
  year: z.number().int().min(1970).max(new Date().getFullYear() + 1).optional(),
  make: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(50).optional(),
  length: z.number().int().min(5).max(50).optional(),
  sleeps: z.number().int().min(1).max(20).optional(),
  seatbelts: z.number().int().min(0).optional(),

  nightlyRate: z.number().int().min(1000).optional(),
  cleaningFee: z.number().int().min(0).optional(),
  securityDeposit: z.number().int().min(0).optional(),
  weeklyDiscount: z.number().int().min(0).max(50).optional(),
  monthlyDiscount: z.number().int().min(0).max(70).optional(),
  minNights: z.number().int().min(1).optional(),
  maxNights: z.number().int().min(1).max(365).optional(),

  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(5).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  amenities: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  rules: z.string().max(5000).optional(),

  mileage: z.number().int().min(0).optional(),
  fuelType: z.enum(['GAS', 'DIESEL', 'ELECTRIC', 'HYBRID', 'NA']).optional(),
  towable: z.boolean().optional(),
  deliveryAvailable: z.boolean().optional(),
  deliveryFee: z.number().int().min(0).optional(),
  deliveryRadius: z.number().int().min(0).optional(),

  instantBook: z.boolean().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED']).optional(),
});

/**
 * PUT /api/listings/:id
 * Update a listing. Only the listing host can update their listing.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const existing = await prisma.rVListing.findUnique({
      where: { id },
      select: { hostId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateListingSchema.parse(body);

    const listing = await prisma.rVListing.update({
      where: { id },
      data,
      include: {
        images: { orderBy: { order: 'asc' } },
        addOns: true,
        host: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid listing data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('PUT /api/listings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/listings/:id
 * Soft delete a listing by setting its status to ARCHIVED.
 * Only the listing host can archive their listing.
 * Listings with active bookings cannot be archived.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const existing = await prisma.rVListing.findUnique({
      where: { id },
      select: { hostId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.hostId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for active bookings before archiving
    const activeBookings = await prisma.booking.count({
      where: {
        listingId: id,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot archive a listing with active bookings' },
        { status: 409 }
      );
    }

    // Soft delete — set status to ARCHIVED
    const listing = await prisma.rVListing.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return NextResponse.json({ message: 'Listing archived', id: listing.id });
  } catch (error) {
    console.error('DELETE /api/listings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to archive listing' },
      { status: 500 }
    );
  }
}

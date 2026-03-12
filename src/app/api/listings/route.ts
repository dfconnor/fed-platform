/**
 * Listings API Route
 *
 * GET  /api/listings - Search and filter RV listings with pagination
 * POST /api/listings - Create a new listing (authenticated hosts only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/** Zod schema for listing search query parameters */
const searchParamsSchema = z.object({
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  rvType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sleeps: z.coerce.number().optional(),
  amenities: z.string().optional(), // comma-separated
  features: z.string().optional(), // comma-separated
  instantBook: z.enum(['true', 'false']).optional(),
  deliveryAvailable: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
  // Map bounds for geo-filtering
  neLat: z.coerce.number().optional(),
  neLng: z.coerce.number().optional(),
  swLat: z.coerce.number().optional(),
  swLng: z.coerce.number().optional(),
});

/**
 * GET /api/listings
 * Search and filter listings with support for location, date availability,
 * RV type, price range, amenities, map bounds, and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParamsSchema.parse(Object.fromEntries(searchParams));

    const {
      location,
      startDate,
      endDate,
      rvType,
      minPrice,
      maxPrice,
      sleeps,
      amenities,
      features,
      instantBook,
      deliveryAvailable,
      sortBy,
      page,
      limit,
      neLat,
      neLng,
      swLat,
      swLng,
    } = params;

    // Build Prisma where clause
    const where: any = {
      status: 'ACTIVE',
    };

    // Location search — match city or state (case-insensitive)
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { address: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Map bounding box filter
    if (neLat !== undefined && neLng !== undefined && swLat !== undefined && swLng !== undefined) {
      where.latitude = { gte: swLat, lte: neLat };
      where.longitude = { gte: swLng, lte: neLng };
    }

    // RV type filter
    if (rvType) {
      where.rvType = rvType;
    }

    // Price range filter (values in cents)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.nightlyRate = {};
      if (minPrice !== undefined) where.nightlyRate.gte = minPrice;
      if (maxPrice !== undefined) where.nightlyRate.lte = maxPrice;
    }

    // Sleeps minimum
    if (sleeps !== undefined) {
      where.sleeps = { gte: sleeps };
    }

    // Amenities filter — listing must have all requested amenities
    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim());
      where.amenities = { hasEvery: amenityList };
    }

    // Features filter — listing must have all requested features
    if (features) {
      const featureList = features.split(',').map((f) => f.trim());
      where.features = { hasEvery: featureList };
    }

    // Instant book filter
    if (instantBook === 'true') {
      where.instantBook = true;
    }

    // Delivery available filter
    if (deliveryAvailable === 'true') {
      where.deliveryAvailable = true;
    }

    // Date availability filter — exclude listings with blocked dates in the range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      where.NOT = {
        availability: {
          some: {
            date: { gte: start, lt: end },
            available: false,
          },
        },
      };

      // Also exclude listings with overlapping bookings
      where.bookings = {
        none: {
          status: { in: ['CONFIRMED', 'ACTIVE'] },
          startDate: { lt: end },
          endDate: { gt: start },
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price_asc':
        orderBy = { nightlyRate: 'asc' };
        break;
      case 'price_desc':
        orderBy = { nightlyRate: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      prisma.rVListing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 5,
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
            select: { reviews: true, bookings: true },
          },
        },
      }),
      prisma.rVListing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    console.error('GET /api/listings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

/** Zod schema for creating a new listing */
const createListingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  rvType: z.enum([
    'CLASS_A', 'CLASS_B', 'CLASS_C', 'TRAVEL_TRAILER', 'FIFTH_WHEEL',
    'POP_UP', 'TRUCK_CAMPER', 'TOY_HAULER', 'CAMPERVAN', 'TEARDROP',
    'AIRSTREAM', 'OTHER',
  ]),
  year: z.number().int().min(1970).max(new Date().getFullYear() + 1),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  length: z.number().int().min(5).max(50),
  sleeps: z.number().int().min(1).max(20),
  seatbelts: z.number().int().min(0).optional().default(0),

  // Pricing (cents)
  nightlyRate: z.number().int().min(1000), // at least $10/night
  cleaningFee: z.number().int().min(0).optional().default(0),
  securityDeposit: z.number().int().min(0).optional().default(0),
  weeklyDiscount: z.number().int().min(0).max(50).optional().default(0),
  monthlyDiscount: z.number().int().min(0).max(70).optional().default(0),
  minNights: z.number().int().min(1).optional().default(1),
  maxNights: z.number().int().min(1).max(365).optional().default(30),

  // Location
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(5),
  country: z.string().optional().default('US'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),

  // Features
  amenities: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  rules: z.string().max(5000).optional(),

  // Vehicle details
  mileage: z.number().int().min(0).optional(),
  fuelType: z.enum(['GAS', 'DIESEL', 'ELECTRIC', 'HYBRID', 'NA']).optional().default('GAS'),
  towable: z.boolean().optional().default(false),
  deliveryAvailable: z.boolean().optional().default(false),
  deliveryFee: z.number().int().min(0).optional().default(0),
  deliveryRadius: z.number().int().min(0).optional().default(0),

  // Status
  instantBook: z.boolean().optional().default(false),

  // Add-ons
  addOns: z.array(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().int().min(0),
    perNight: z.boolean().optional().default(false),
  })).optional().default([]),
});

/**
 * POST /api/listings
 * Create a new RV listing. Requires authentication.
 * Listing is created in DRAFT status by default.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createListingSchema.parse(body);

    const { addOns, ...listingData } = data;

    const listing = await prisma.rVListing.create({
      data: {
        ...listingData,
        hostId: session.user.id,
        status: 'DRAFT',
        addOns: addOns.length > 0
          ? {
              create: addOns.map((addOn) => ({
                name: addOn.name,
                description: addOn.description,
                price: addOn.price,
                perNight: addOn.perNight,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        addOns: true,
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid listing data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/listings error:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

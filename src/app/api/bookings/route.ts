/**
 * Bookings API Route
 *
 * GET  /api/bookings - List bookings for the current user (as host or guest)
 * POST /api/bookings - Create a new booking with full pricing calculation
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculatePricing } from '@/lib/pricing';
import { getBestInsuranceQuotes } from '@/lib/insurance';
import { createBookingPayment } from '@/lib/stripe';

/**
 * GET /api/bookings
 * List bookings for the authenticated user. Supports filtering by role
 * (host/guest), status, and date range.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'guest'; // 'host' or 'guest'
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const where: any = {};

    // Filter by role
    if (role === 'host') {
      where.hostId = session.user.id;
    } else {
      where.guestId = session.user.id;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              rvType: true,
              images: {
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
          },
          guest: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/** Zod schema for creating a booking */
const createBookingSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
  guestCount: z.number().int().min(1).optional().default(1),
  specialRequests: z.string().max(1000).optional(),
  insuranceTier: z.enum(['BASIC', 'ESSENTIAL', 'PREMIUM']).optional().default('ESSENTIAL'),
  addOnIds: z.array(z.string()).optional().default([]),
  deliveryAddress: z.string().optional(),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
});

/**
 * POST /api/bookings
 * Create a new booking with full pricing calculation. Steps:
 * 1. Verify listing availability for the requested dates
 * 2. Calculate pricing using the pricing engine
 * 3. Get insurance quote for the selected tier
 * 4. Create Stripe payment intent
 * 5. Create booking record in database
 * 6. Block availability dates for the listing
 * 7. Return booking with Stripe client secret for payment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createBookingSchema.parse(body);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Validate date range
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: 'Start date must be in the future' },
        { status: 400 }
      );
    }

    // Calculate nights
    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Step 1: Fetch listing and verify it exists and is active
    const listing = await prisma.rVListing.findUnique({
      where: { id: data.listingId },
      include: {
        host: {
          select: {
            id: true,
            stripeAccountId: true,
            email: true,
          },
        },
        addOns: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This listing is not currently available' },
        { status: 400 }
      );
    }

    // Cannot book your own listing
    if (listing.hostId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot book your own listing' },
        { status: 400 }
      );
    }

    // Validate night range
    if (nights < listing.minNights || nights > listing.maxNights) {
      return NextResponse.json(
        {
          error: `Booking must be between ${listing.minNights} and ${listing.maxNights} nights`,
        },
        { status: 400 }
      );
    }

    // Step 1b: Check availability — no blocked dates in range
    const blockedDates = await prisma.availability.findMany({
      where: {
        listingId: data.listingId,
        date: { gte: startDate, lt: endDate },
        available: false,
      },
    });

    if (blockedDates.length > 0) {
      return NextResponse.json(
        { error: 'Listing is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Check for overlapping confirmed/active bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        listingId: data.listingId,
        status: { in: ['CONFIRMED', 'ACTIVE'] },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Listing is already booked for the selected dates' },
        { status: 409 }
      );
    }

    // Step 2b: Calculate add-ons total
    let addOnsTotal = 0;
    const selectedAddOns: { name: string; price: number; quantity: number }[] = [];
    if (data.addOnIds.length > 0) {
      const addOns = listing.addOns.filter((a) => data.addOnIds.includes(a.id));
      for (const addOn of addOns) {
        const cost = addOn.perNight ? addOn.price * nights : addOn.price;
        addOnsTotal += cost;
        selectedAddOns.push({
          name: addOn.name,
          price: cost,
          quantity: 1,
        });
      }
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (data.deliveryAddress && listing.deliveryAvailable) {
      // Simplified distance-based delivery fee calculation
      // In production, use a geocoding/distance API
      deliveryFee = listing.deliveryFee; // flat rate in cents
    }

    // Step 3: Get insurance quote for selected tier
    const insuranceQuotes = await getBestInsuranceQuotes({
      rvValue: listing.nightlyRate * 100, // rough RV value estimate
      nights,
      rvType: listing.rvType,
      rvYear: listing.year,
    });

    const selectedInsurance = insuranceQuotes.find(
      (q) => q.tier === data.insuranceTier
    );
    const insuranceFee = selectedInsurance?.price || 0;

    // Step 2: Calculate full pricing breakdown
    const pricing = calculatePricing({
      nightlyRate: listing.nightlyRate,
      nights,
      cleaningFee: listing.cleaningFee,
      deliveryFee,
      addOnsTotal,
      insuranceFee,
      securityDeposit: listing.securityDeposit,
      weeklyDiscount: listing.weeklyDiscount,
      monthlyDiscount: listing.monthlyDiscount,
    });

    // Step 4: Create Stripe payment intent
    if (!listing.host.stripeAccountId) {
      return NextResponse.json(
        { error: 'Host has not completed payment setup' },
        { status: 400 }
      );
    }

    const paymentIntent = await createBookingPayment({
      amount: pricing.total,
      hostStripeAccountId: listing.host.stripeAccountId,
      platformFee: pricing.platformFeeGuest + pricing.platformFeeHost,
      bookingId: '', // will update after booking creation
      customerEmail: session.user.email || '',
      description: `Rival RV Booking: ${listing.title} (${nights} nights)`,
    });

    // Step 5: Create booking record
    const booking = await prisma.booking.create({
      data: {
        listingId: data.listingId,
        guestId: session.user.id,
        hostId: listing.hostId,
        startDate,
        endDate,
        nights,
        nightlyTotal: pricing.nightlyTotal,
        cleaningFee: pricing.cleaningFee,
        deliveryFee: pricing.deliveryFee,
        addOnsTotal: pricing.addOnsTotal,
        insuranceFee: pricing.insuranceFee,
        platformFeeGuest: pricing.platformFeeGuest,
        platformFeeHost: pricing.platformFeeHost,
        discount: pricing.discount,
        subtotal: pricing.subtotal,
        total: pricing.total,
        securityDeposit: pricing.securityDeposit,
        insuranceTier: data.insuranceTier,
        insuranceProvider: selectedInsurance?.provider || null,
        stripePaymentId: paymentIntent.id,
        status: listing.instantBook ? 'CONFIRMED' : 'PENDING',
        cancellationPolicy: 'MODERATE', // default; could be listing-level setting
        guestCount: data.guestCount,
        specialRequests: data.specialRequests || null,
        deliveryAddress: data.deliveryAddress || null,
        deliveryLat: data.deliveryLat || null,
        deliveryLng: data.deliveryLng || null,
        addOns: selectedAddOns.length > 0
          ? {
              create: selectedAddOns.map((a) => ({
                name: a.name,
                price: a.price,
                quantity: a.quantity,
              })),
            }
          : undefined,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
        guest: {
          select: { id: true, name: true, image: true },
        },
        host: {
          select: { id: true, name: true, image: true },
        },
        addOns: true,
      },
    });

    // Update payment intent with the actual booking ID
    // (Stripe metadata update — fire and forget)
    await createBookingPayment({
      amount: pricing.total,
      hostStripeAccountId: listing.host.stripeAccountId,
      platformFee: pricing.platformFeeGuest + pricing.platformFeeHost,
      bookingId: booking.id,
      customerEmail: session.user.email || '',
      description: `Rival RV Booking: ${listing.title} (${nights} nights)`,
    }).catch(() => {
      // Non-critical: metadata update failure is acceptable
    });

    // Step 6: Block availability dates for the listing
    const datesToBlock: { listingId: string; date: Date; available: boolean }[] = [];
    const current = new Date(startDate);
    while (current < endDate) {
      datesToBlock.push({
        listingId: data.listingId,
        date: new Date(current),
        available: false,
      });
      current.setDate(current.getDate() + 1);
    }

    // Upsert availability records to block the dates
    await Promise.all(
      datesToBlock.map((d) =>
        prisma.availability.upsert({
          where: {
            listingId_date: {
              listingId: d.listingId,
              date: d.date,
            },
          },
          update: { available: false },
          create: d,
        })
      )
    );

    // Step 7: Return booking with Stripe client secret
    return NextResponse.json(
      {
        booking,
        pricing,
        insurance: selectedInsurance,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

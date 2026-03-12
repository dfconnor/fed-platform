/**
 * Insurance Quotes API Route
 *
 * POST /api/insurance/quotes - Get insurance quotes for a booking
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getBestInsuranceQuotes } from '@/lib/insurance';

/** Zod schema for insurance quote request */
const quoteRequestSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
});

/**
 * POST /api/insurance/quotes
 * Get the best insurance quotes across all tiers for a given listing and
 * date range. Uses RV details (type, year, value) to calculate rates.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = quoteRequestSchema.parse(body);

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Fetch listing details needed for insurance calculation
    const listing = await prisma.rVListing.findUnique({
      where: { id: data.listingId },
      select: {
        id: true,
        rvType: true,
        year: true,
        nightlyRate: true,
        title: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Estimate RV value from nightly rate (rough heuristic)
    // A $200/night RV is roughly worth $80,000-$120,000
    const estimatedRvValue = listing.nightlyRate * 500;

    const quotes = await getBestInsuranceQuotes({
      rvValue: estimatedRvValue,
      nights,
      rvType: listing.rvType,
      rvYear: listing.year,
    });

    return NextResponse.json({
      quotes,
      listing: {
        id: listing.id,
        title: listing.title,
        rvType: listing.rvType,
        year: listing.year,
      },
      nights,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid quote request', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/insurance/quotes error:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance quotes' },
      { status: 500 }
    );
  }
}

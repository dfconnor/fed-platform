/**
 * Damage Claims API Route
 *
 * POST /api/damage-claims — File a new damage claim (host only)
 * GET  /api/damage-claims — List claims for the current user
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fileClaim } from '@/lib/claims';

// ---------------------------------------------------------------------------
// POST — File a new claim
// ---------------------------------------------------------------------------

const fileClaimSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters'),
  photos: z.array(z.string()).min(1, 'At least one photo is required'),
  requestedAmount: z.number().int().positive('Amount must be positive'),
  damageType: z.enum(['exterior', 'interior', 'mechanical', 'cleaning', 'other']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = fileClaimSchema.parse(body);

    const claim = await fileClaim({
      bookingId: data.bookingId,
      filedById: session.user.id,
      description: data.description,
      photos: data.photos,
      requestedAmount: data.requestedAmount,
      damageType: data.damageType,
    });

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid claim data', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      // Business logic errors from fileClaim
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('POST /api/damage-claims error:', error);
    return NextResponse.json(
      { error: 'Failed to file damage claim' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET — List claims for current user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'host';
    const status = searchParams.get('status');

    const where: any = {};

    if (role === 'host') {
      where.filedById = session.user.id;
    } else {
      // Guest — claims filed against bookings where user is the guest
      where.booking = {
        guestId: session.user.id,
      };
    }

    if (status) {
      where.status = status;
    }

    const claims = await prisma.damageClaim.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            securityDeposit: true,
            listing: {
              select: {
                id: true,
                title: true,
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
            guest: {
              select: { id: true, name: true, image: true },
            },
            host: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('GET /api/damage-claims error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

/**
 * Damage Claim Detail API Route
 *
 * GET   /api/damage-claims/:id — Fetch claim details with booking info
 * PATCH /api/damage-claims/:id — Update claim status (admin review)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewClaim } from '@/lib/claims';

// ---------------------------------------------------------------------------
// GET — Fetch claim details
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const claim = await prisma.damageClaim.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            nights: true,
            securityDeposit: true,
            stripePaymentId: true,
            listing: {
              select: {
                id: true,
                title: true,
                images: { orderBy: { order: 'asc' }, take: 1 },
              },
            },
            guest: {
              select: { id: true, name: true, email: true, image: true },
            },
            host: {
              select: { id: true, name: true, email: true, image: true },
            },
            conditionReports: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        dispute: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: 'Damage claim not found' },
        { status: 404 }
      );
    }

    // Only allow booking participants (or admins) to view
    const isHost = claim.booking.host.id === session.user.id;
    const isGuest = claim.booking.guest.id === session.user.id;

    if (!isHost && !isGuest) {
      return NextResponse.json(
        { error: 'You are not authorized to view this claim' },
        { status: 403 }
      );
    }

    return NextResponse.json({ claim });
  } catch (error) {
    console.error('GET /api/damage-claims/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Review / update claim status
// ---------------------------------------------------------------------------

const reviewSchema = z.object({
  decision: z.enum(['accepted', 'partially_accepted', 'rejected']),
  approvedAmount: z.number().int().positive().optional(),
  notes: z.string().min(1, 'Resolution notes are required'),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    const claim = await reviewClaim(params.id, {
      decision: data.decision,
      approvedAmount: data.approvedAmount,
      notes: data.notes,
      reviewerId: session.user.id,
    });

    return NextResponse.json({ claim });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('PATCH /api/damage-claims/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to review claim' },
      { status: 500 }
    );
  }
}

/**
 * Agreements API Route
 *
 * POST /api/agreements - Generate a rental agreement for a booking
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateAgreement } from '@/lib/agreements';

const createAgreementSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
});

/**
 * POST /api/agreements
 * Generate a rental agreement for a booking. The authenticated user
 * must be either the guest or host of the booking.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createAgreementSchema.parse(body);

    // Verify the booking exists and the user is a party to it
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      select: {
        id: true,
        guestId: true,
        hostId: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (
      booking.guestId !== session.user.id &&
      booking.hostId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only generate agreements for confirmed or active bookings
    if (!['CONFIRMED', 'ACTIVE', 'PENDING'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Agreement can only be generated for active bookings' },
        { status: 400 }
      );
    }

    const agreement = await generateAgreement(data.bookingId);

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/agreements error:', error);
    return NextResponse.json(
      { error: 'Failed to generate agreement' },
      { status: 500 }
    );
  }
}

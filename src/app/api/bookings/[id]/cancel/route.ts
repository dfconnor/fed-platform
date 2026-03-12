/**
 * Cancel Booking API Route
 *
 * POST /api/bookings/:id/cancel - Cancel a booking with refund calculation
 * based on the cancellation policy and Stripe refund processing.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

interface RouteParams {
  params: { id: string };
}

/**
 * Cancellation refund percentages based on policy and timing.
 *
 * FLEXIBLE:
 *   - 14+ days before start: 100% refund
 *   - 7-13 days before start: 75% refund
 *   - 1-6 days before start: 50% refund
 *   - Day of or during trip: No refund
 *
 * MODERATE:
 *   - 14+ days before start: 100% refund
 *   - 7-13 days before start: 50% refund
 *   - Less than 7 days: No refund
 *
 * STRICT:
 *   - 30+ days before start: 50% refund
 *   - Less than 30 days: No refund
 */
function calculateRefundPercentage(
  policy: string,
  startDate: Date
): number {
  const now = new Date();
  const daysUntilStart = Math.floor(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (policy) {
    case 'FLEXIBLE':
      if (daysUntilStart >= 14) return 100;
      if (daysUntilStart >= 7) return 75;
      if (daysUntilStart >= 1) return 50;
      return 0;

    case 'MODERATE':
      if (daysUntilStart >= 14) return 100;
      if (daysUntilStart >= 7) return 50;
      return 0;

    case 'STRICT':
      if (daysUntilStart >= 30) return 50;
      return 0;

    default:
      return 0;
  }
}

/** Zod schema for cancellation request */
const cancelBookingSchema = z.object({
  reason: z.string().min(1).max(500),
});

/**
 * POST /api/bookings/:id/cancel
 * Cancel a booking and process a refund through Stripe based on the
 * listing's cancellation policy and how far in advance the cancellation is.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const data = cancelBookingSchema.parse(body);

    // Fetch booking with listing details
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only the guest or host can cancel
    const isHost = booking.hostId === session.user.id;
    const isGuest = booking.guestId === session.user.id;
    if (!isHost && !isGuest) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Can only cancel PENDING or CONFIRMED bookings
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot cancel a booking with status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Calculate refund amount
    let refundPercentage: number;

    if (isHost) {
      // Host-initiated cancellation always gives 100% refund to guest
      refundPercentage = 100;
    } else {
      // Guest cancellation follows the cancellation policy
      refundPercentage = calculateRefundPercentage(
        booking.cancellationPolicy,
        booking.startDate
      );
    }

    const refundAmount = Math.round((booking.total * refundPercentage) / 100);

    // Process Stripe refund if payment was made
    let stripeRefund = null;
    if (booking.stripePaymentId && refundAmount > 0) {
      try {
        stripeRefund = await stripe.refunds.create({
          payment_intent: booking.stripePaymentId,
          amount: refundAmount,
          reason: 'requested_by_customer',
          metadata: {
            bookingId: booking.id,
            cancelledBy: isHost ? 'host' : 'guest',
            refundPercentage: refundPercentage.toString(),
          },
        });
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError);
        return NextResponse.json(
          { error: 'Failed to process refund. Please contact support.' },
          { status: 500 }
        );
      }
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledBy: session.user.id,
        cancelledAt: new Date(),
        cancellationReason: data.reason,
      },
      include: {
        listing: {
          select: { id: true, title: true },
        },
        guest: {
          select: { id: true, name: true, email: true },
        },
        host: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Unblock the availability dates
    await prisma.availability.updateMany({
      where: {
        listingId: booking.listingId,
        date: {
          gte: booking.startDate,
          lt: booking.endDate,
        },
        available: false,
      },
      data: { available: true },
    });

    return NextResponse.json({
      booking: updatedBooking,
      refund: {
        refundPercentage,
        refundAmount,
        originalTotal: booking.total,
        stripeRefundId: stripeRefund?.id || null,
        policy: booking.cancellationPolicy,
        cancelledBy: isHost ? 'host' : 'guest',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid cancellation data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/bookings/[id]/cancel error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

/**
 * Single Booking API Route
 *
 * GET   /api/bookings/:id - Fetch booking details (authorized user only)
 * PATCH /api/bookings/:id - Update booking status (confirm, cancel, complete)
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
 * GET /api/bookings/:id
 * Fetch full booking details. Only the guest, host, or an admin can view a booking.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            rvType: true,
            city: true,
            state: true,
            address: true,
            latitude: true,
            longitude: true,
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            phone: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            phone: true,
          },
        },
        addOns: true,
        review: true,
        conditionReports: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Authorization: only the guest or host can view the booking
    if (
      booking.guestId !== session.user.id &&
      booking.hostId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('GET /api/bookings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

/** Valid status transitions for booking updates */
const STATUS_TRANSITIONS: Record<string, { allowed: string[]; role: 'host' | 'guest' | 'both' }> = {
  PENDING: { allowed: ['CONFIRMED', 'CANCELLED'], role: 'host' },
  CONFIRMED: { allowed: ['ACTIVE', 'CANCELLED'], role: 'both' },
  ACTIVE: { allowed: ['COMPLETED', 'DISPUTED'], role: 'host' },
};

/** Zod schema for booking status update */
const updateBookingSchema = z.object({
  status: z.enum(['CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
  cancellationReason: z.string().max(500).optional(),
});

/**
 * PATCH /api/bookings/:id
 * Update the status of a booking. Validates the status transition
 * and ensures only authorized users can make the change.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const data = updateBookingSchema.parse(body);

    // Fetch existing booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        guestId: true,
        hostId: true,
        listingId: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check user is involved in this booking
    const isHost = booking.hostId === session.user.id;
    const isGuest = booking.guestId === session.user.id;
    if (!isHost && !isGuest) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate status transition
    const transition = STATUS_TRANSITIONS[booking.status];
    if (!transition) {
      return NextResponse.json(
        { error: `Booking in ${booking.status} status cannot be updated` },
        { status: 400 }
      );
    }

    if (!transition.allowed.includes(data.status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${booking.status} to ${data.status}`,
        },
        { status: 400 }
      );
    }

    // Check role permissions for this transition
    if (transition.role === 'host' && !isHost) {
      return NextResponse.json(
        { error: 'Only the host can perform this action' },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {
      status: data.status,
    };

    // Handle cancellation-specific fields
    if (data.status === 'CANCELLED') {
      updateData.cancelledBy = session.user.id;
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = data.cancellationReason || null;

      // Unblock availability dates when cancelled
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
    }

    // Handle completion — update listing stats
    if (data.status === 'COMPLETED') {
      await prisma.rVListing.update({
        where: { id: booking.listingId },
        data: { totalTrips: { increment: 1 } },
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
        guest: { select: { id: true, name: true, image: true } },
        host: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('PATCH /api/bookings/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

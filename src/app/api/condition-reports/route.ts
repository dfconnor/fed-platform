/**
 * Condition Reports API Route
 *
 * POST /api/condition-reports — Submit a departure or return condition report
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const conditionReportSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  type: z.enum(['DEPARTURE', 'RETURN']),
  photos: z.array(z.string()).min(1, 'At least one photo is required'),
  notes: z.string().optional(),
  mileage: z.number().int().positive().optional(),
  fuelLevel: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = conditionReportSchema.parse(body);

    // Fetch the booking to verify the user is a participant
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      select: {
        id: true,
        guestId: true,
        hostId: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // User must be the guest or host of this booking
    const isGuest = booking.guestId === session.user.id;
    const isHost = booking.hostId === session.user.id;

    if (!isGuest && !isHost) {
      return NextResponse.json(
        { error: 'You are not a participant in this booking' },
        { status: 403 }
      );
    }

    // Validate report type against booking status
    if (data.type === 'DEPARTURE') {
      if (!['CONFIRMED', 'ACTIVE'].includes(booking.status)) {
        return NextResponse.json(
          {
            error:
              'Departure reports can only be submitted for confirmed or active bookings',
          },
          { status: 400 }
        );
      }
    } else {
      // RETURN report
      if (!['ACTIVE', 'COMPLETED'].includes(booking.status)) {
        return NextResponse.json(
          {
            error:
              'Return reports can only be submitted for active or completed bookings',
          },
          { status: 400 }
        );
      }
    }

    // Check for duplicate: same type + same user
    const existingReport = await prisma.conditionReport.findFirst({
      where: {
        bookingId: data.bookingId,
        type: data.type,
        reportedBy: session.user.id,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        {
          error: `You have already submitted a ${data.type.toLowerCase()} condition report for this booking`,
        },
        { status: 409 }
      );
    }

    // Create the condition report
    const report = await prisma.conditionReport.create({
      data: {
        bookingId: data.bookingId,
        type: data.type,
        photos: data.photos,
        notes: data.notes || '',
        mileage: data.mileage || null,
        fuelLevel: data.fuelLevel || null,
        reportedBy: session.user.id,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid condition report data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/condition-reports error:', error);
    return NextResponse.json(
      { error: 'Failed to submit condition report' },
      { status: 500 }
    );
  }
}

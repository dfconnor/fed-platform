/**
 * Condition Report Detail API Route
 *
 * GET /api/condition-reports/:id — Fetch a condition report with details
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await prisma.conditionReport.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          select: {
            id: true,
            guestId: true,
            hostId: true,
            startDate: true,
            endDate: true,
            listing: {
              select: {
                id: true,
                title: true,
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

    if (!report) {
      return NextResponse.json(
        { error: 'Condition report not found' },
        { status: 404 }
      );
    }

    // Auth guard: only booking participants can view
    const isGuest = report.booking.guestId === session.user.id;
    const isHost = report.booking.hostId === session.user.id;

    if (!isGuest && !isHost) {
      return NextResponse.json(
        { error: 'You are not authorized to view this report' },
        { status: 403 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('GET /api/condition-reports/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch condition report' },
      { status: 500 }
    );
  }
}

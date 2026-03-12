/**
 * Single Agreement API Route
 *
 * GET /api/agreements/:id - Fetch agreement with booking details
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/agreements/:id
 * Fetch an agreement with its associated booking, listing, guest, and host.
 * Only the guest or host of the associated booking may access the agreement.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const agreement = await prisma.rentalAgreement.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                rvType: true,
                year: true,
                make: true,
                model: true,
                length: true,
                sleeps: true,
                city: true,
                state: true,
                features: true,
                rules: true,
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
                email: true,
                image: true,
              },
            },
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!agreement) {
      return NextResponse.json(
        { error: 'Agreement not found' },
        { status: 404 }
      );
    }

    // Authorization: only the guest or host can view the agreement
    if (
      agreement.booking.guestId !== session.user.id &&
      agreement.booking.hostId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(agreement);
  } catch (error) {
    console.error('GET /api/agreements/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreement' },
      { status: 500 }
    );
  }
}

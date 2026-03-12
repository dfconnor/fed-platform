/**
 * GET /api/verify/status
 *
 * Returns the current user's verification status, level, and
 * latest verification record details.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getVerification, getVerificationLevel } from '@/lib/verification';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user flags and latest verification record in parallel
    const [user, verification] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { idVerified: true, backgroundCheck: true },
      }),
      getVerification(session.user.id),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const level = getVerificationLevel(user);

    return NextResponse.json({
      verified: user.idVerified,
      level,
      verification: verification
        ? {
            id: verification.id,
            status: verification.status,
            idType: verification.idType,
            licenseState: verification.licenseState,
            licenseExpiry: verification.licenseExpiry,
            backgroundCheckStatus: verification.backgroundCheckStatus,
            drivingRecordStatus: verification.drivingRecordStatus,
            verifiedAt: verification.verifiedAt,
            expiresAt: verification.expiresAt,
            rejectionReason: verification.rejectionReason,
            createdAt: verification.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error('GET /api/verify/status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification status' },
      { status: 500 },
    );
  }
}

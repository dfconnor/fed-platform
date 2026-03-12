/**
 * Damage Claims Business Logic
 *
 * Handles the full lifecycle of damage claims:
 * filing, responding, reviewing, deposit capture, and auto-release.
 */
import { prisma } from './prisma';
import { captureSecurityDeposit, releaseSecurityDeposit } from './stripe';
import { CLAIM_FILING_DEADLINE_DAYS, DEPOSIT_AUTO_RELEASE_DAYS } from '@/types';

// ---------------------------------------------------------------------------
// File a new damage claim (host only, within 7 days of trip end)
// ---------------------------------------------------------------------------

export async function fileClaim(data: {
  bookingId: string;
  filedById: string;
  description: string;
  photos: string[];
  requestedAmount: number; // cents
  damageType: string;
}) {
  // Fetch the booking with host info
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: {
      host: { select: { id: true } },
      guest: { select: { id: true } },
    },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Only the host can file a claim
  if (booking.hostId !== data.filedById) {
    throw new Error('Only the host can file a damage claim');
  }

  // Booking must be completed
  if (booking.status !== 'COMPLETED') {
    throw new Error('Claims can only be filed for completed bookings');
  }

  // Must be within the filing deadline
  const tripEndDate = new Date(booking.endDate);
  const deadlineDate = new Date(tripEndDate);
  deadlineDate.setDate(deadlineDate.getDate() + CLAIM_FILING_DEADLINE_DAYS);

  if (new Date() > deadlineDate) {
    throw new Error(
      `Claims must be filed within ${CLAIM_FILING_DEADLINE_DAYS} days of trip end`
    );
  }

  // Requested amount cannot exceed the security deposit
  if (data.requestedAmount > booking.securityDeposit) {
    throw new Error('Requested amount cannot exceed the security deposit');
  }

  // Create the claim
  const claim = await prisma.damageClaim.create({
    data: {
      bookingId: data.bookingId,
      filedById: data.filedById,
      description: data.description,
      photos: data.photos,
      requestedAmount: data.requestedAmount,
      damageType: data.damageType,
      status: 'SUBMITTED',
    },
    include: {
      booking: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          securityDeposit: true,
          listing: { select: { id: true, title: true } },
          guest: { select: { id: true, name: true, email: true } },
          host: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  return claim;
}

// ---------------------------------------------------------------------------
// Guest responds to a claim
// ---------------------------------------------------------------------------

export async function respondToClaim(
  claimId: string,
  guestId: string,
  data: {
    response: string;
    photos?: string[];
  }
) {
  const claim = await prisma.damageClaim.findUnique({
    where: { id: claimId },
    include: {
      booking: { select: { guestId: true } },
    },
  });

  if (!claim) {
    throw new Error('Claim not found');
  }

  // Only the guest of the booking can respond
  if (claim.booking.guestId !== guestId) {
    throw new Error('Only the guest can respond to this claim');
  }

  // Claim must be in a state that accepts responses
  if (!['SUBMITTED', 'UNDER_REVIEW'].includes(claim.status)) {
    throw new Error('This claim is no longer accepting responses');
  }

  const updatedClaim = await prisma.damageClaim.update({
    where: { id: claimId },
    data: {
      renterResponse: data.response,
      renterResponseAt: new Date(),
      status: 'UNDER_REVIEW',
      // Append guest photos to existing photos if provided
      ...(data.photos && data.photos.length > 0
        ? { photos: [...claim.photos, ...data.photos] }
        : {}),
    },
    include: {
      booking: {
        select: {
          id: true,
          listing: { select: { title: true } },
          guest: { select: { id: true, name: true } },
          host: { select: { id: true, name: true } },
        },
      },
    },
  });

  return updatedClaim;
}

// ---------------------------------------------------------------------------
// Admin/platform reviews a claim
// ---------------------------------------------------------------------------

export async function reviewClaim(
  claimId: string,
  data: {
    decision: 'accepted' | 'partially_accepted' | 'rejected';
    approvedAmount?: number;
    notes: string;
    reviewerId: string;
  }
) {
  const claim = await prisma.damageClaim.findUnique({
    where: { id: claimId },
  });

  if (!claim) {
    throw new Error('Claim not found');
  }

  // Map the decision to a ClaimStatus
  const statusMap = {
    accepted: 'ACCEPTED' as const,
    partially_accepted: 'PARTIALLY_ACCEPTED' as const,
    rejected: 'REJECTED' as const,
  };

  const newStatus = statusMap[data.decision];

  // For accepted/partially_accepted, an approved amount is required
  let approvedAmount: number | null = null;
  if (data.decision === 'accepted') {
    approvedAmount = claim.requestedAmount;
  } else if (data.decision === 'partially_accepted') {
    if (!data.approvedAmount || data.approvedAmount <= 0) {
      throw new Error('Approved amount is required for partial acceptance');
    }
    if (data.approvedAmount > claim.requestedAmount) {
      throw new Error('Approved amount cannot exceed requested amount');
    }
    approvedAmount = data.approvedAmount;
  }

  const updatedClaim = await prisma.damageClaim.update({
    where: { id: claimId },
    data: {
      status: newStatus,
      approvedAmount,
      resolvedAt: new Date(),
      resolvedBy: data.reviewerId,
      resolutionNotes: data.notes,
    },
    include: {
      booking: {
        select: {
          id: true,
          securityDeposit: true,
          stripePaymentId: true,
          listing: { select: { title: true } },
          guest: { select: { id: true, name: true } },
          host: { select: { id: true, name: true } },
        },
      },
    },
  });

  return updatedClaim;
}

// ---------------------------------------------------------------------------
// Capture security deposit for an approved claim
// ---------------------------------------------------------------------------

export async function captureDepositForClaim(claimId: string): Promise<void> {
  const claim = await prisma.damageClaim.findUnique({
    where: { id: claimId },
    include: {
      booking: {
        select: {
          stripePaymentId: true,
          securityDeposit: true,
        },
      },
    },
  });

  if (!claim) {
    throw new Error('Claim not found');
  }

  if (!['ACCEPTED', 'PARTIALLY_ACCEPTED'].includes(claim.status)) {
    throw new Error('Claim must be accepted before capturing deposit');
  }

  if (!claim.approvedAmount) {
    throw new Error('No approved amount set on claim');
  }

  if (!claim.booking.stripePaymentId) {
    throw new Error('No payment intent found for booking');
  }

  // Capture the approved amount from the security deposit hold
  const captureResult = await captureSecurityDeposit(
    claim.booking.stripePaymentId,
    claim.approvedAmount
  );

  // Update the claim with capture details
  await prisma.damageClaim.update({
    where: { id: claimId },
    data: {
      depositCaptureAmount: claim.approvedAmount,
      stripeCaptureId: captureResult.id,
      status: 'RESOLVED',
    },
  });
}

// ---------------------------------------------------------------------------
// Auto-release deposits for completed trips with no claims (cron job)
// ---------------------------------------------------------------------------

export async function autoReleasePendingDeposits(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DEPOSIT_AUTO_RELEASE_DAYS);

  // Find completed bookings past the auto-release window with no claims
  const bookingsToRelease = await prisma.booking.findMany({
    where: {
      status: 'COMPLETED',
      endDate: { lte: cutoffDate },
      stripePaymentId: { not: null },
      // No damage claims filed against this booking
      damageClaims: {
        none: {},
      },
    },
    select: {
      id: true,
      stripePaymentId: true,
    },
  });

  let releasedCount = 0;

  for (const booking of bookingsToRelease) {
    if (!booking.stripePaymentId) continue;

    try {
      await releaseSecurityDeposit(booking.stripePaymentId);
      releasedCount++;
    } catch (error) {
      // Log but don't stop — continue releasing other deposits
      console.error(
        `Failed to release deposit for booking ${booking.id}:`,
        error
      );
    }
  }

  return releasedCount;
}

// ---------------------------------------------------------------------------
// Get timeline of events for a claim
// ---------------------------------------------------------------------------

export function getClaimTimeline(
  claim: any
): Array<{ date: string; event: string; actor: string; details?: string }> {
  const timeline: Array<{
    date: string;
    event: string;
    actor: string;
    details?: string;
  }> = [];

  // Claim filed
  if (claim.createdAt) {
    timeline.push({
      date: new Date(claim.createdAt).toISOString(),
      event: 'Claim Filed',
      actor: claim.booking?.host?.name || 'Host',
      details: `${claim.damageType} damage — requested ${formatAmount(claim.requestedAmount)}`,
    });
  }

  // Guest response
  if (claim.renterResponseAt) {
    timeline.push({
      date: new Date(claim.renterResponseAt).toISOString(),
      event: 'Guest Responded',
      actor: claim.booking?.guest?.name || 'Guest',
      details: claim.renterResponse || undefined,
    });
  }

  // Review / resolution
  if (claim.resolvedAt) {
    const statusLabels: Record<string, string> = {
      ACCEPTED: 'Claim Accepted',
      PARTIALLY_ACCEPTED: 'Claim Partially Accepted',
      REJECTED: 'Claim Rejected',
    };

    timeline.push({
      date: new Date(claim.resolvedAt).toISOString(),
      event: statusLabels[claim.status] || 'Claim Reviewed',
      actor: 'Rival RV',
      details: claim.approvedAmount
        ? `Approved ${formatAmount(claim.approvedAmount)}`
        : claim.resolutionNotes || undefined,
    });
  }

  // Deposit captured
  if (claim.depositCaptureAmount) {
    timeline.push({
      date: new Date(claim.resolvedAt || claim.createdAt).toISOString(),
      event: 'Deposit Captured',
      actor: 'System',
      details: `${formatAmount(claim.depositCaptureAmount)} captured from security deposit`,
    });
  }

  // Sort chronologically
  timeline.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return timeline;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function formatAmount(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

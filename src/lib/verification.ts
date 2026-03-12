/**
 * Identity Verification Business Logic
 *
 * Functions for managing the verification lifecycle: initiating,
 * processing documents/selfie/driver info, completing, and
 * determining eligibility.
 */
import { prisma } from '@/lib/prisma';
import type { VerificationLevel } from '@/types';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Get the current user's latest verification record */
export async function getVerification(userId: string) {
  return prisma.identityVerification.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// ---------------------------------------------------------------------------
// Initiate
// ---------------------------------------------------------------------------

/** Create a new PENDING verification record */
export async function initiateVerification(userId: string) {
  return prisma.identityVerification.create({
    data: {
      userId,
      status: 'PENDING',
      backgroundCheckStatus: 'PENDING',
    },
  });
}

// ---------------------------------------------------------------------------
// Step processors
// ---------------------------------------------------------------------------

/** Update verification with ID document photos */
export async function processIdDocument(
  verificationId: string,
  data: {
    idType: string;
    idFrontPhoto: string;
    idBackPhoto?: string;
  },
) {
  return prisma.identityVerification.update({
    where: { id: verificationId },
    data: {
      idType: data.idType,
      idFrontPhoto: data.idFrontPhoto,
      idBackPhoto: data.idBackPhoto ?? null,
      status: 'PROCESSING',
    },
  });
}

/** Update verification with selfie */
export async function processSelfie(verificationId: string, selfiePhoto: string) {
  return prisma.identityVerification.update({
    where: { id: verificationId },
    data: { selfiePhoto },
  });
}

/** Update verification with driver / license information */
export async function processDriverInfo(
  verificationId: string,
  data: {
    licenseNumber: string;
    licenseState: string;
    licenseExpiry: Date;
    dateOfBirth: Date;
    yearsLicensed: number;
  },
) {
  return prisma.identityVerification.update({
    where: { id: verificationId },
    data: {
      licenseNumber: data.licenseNumber,
      licenseState: data.licenseState,
      licenseExpiry: data.licenseExpiry,
      dateOfBirth: data.dateOfBirth,
      yearsLicensed: data.yearsLicensed,
    },
  });
}

// ---------------------------------------------------------------------------
// Completion (called by webhook or manual review)
// ---------------------------------------------------------------------------

/** Finalise a verification record and update the user flags */
export async function completeVerification(
  verificationId: string,
  result: {
    approved: boolean;
    drivingRecordStatus?: string;
    backgroundCheckPassed?: boolean;
    rejectionReason?: string;
  },
) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // valid for 1 year

  const verification = await prisma.identityVerification.update({
    where: { id: verificationId },
    data: {
      status: result.approved ? 'VERIFIED' : 'FAILED',
      drivingRecordStatus: result.drivingRecordStatus ?? null,
      backgroundCheckStatus: result.backgroundCheckPassed ? 'VERIFIED' : 'FAILED',
      backgroundCheckDate: now,
      verifiedAt: result.approved ? now : null,
      expiresAt: result.approved ? expiresAt : null,
      rejectionReason: result.approved ? null : (result.rejectionReason ?? 'Verification failed'),
    },
  });

  // Update the user-level boolean flags
  await prisma.user.update({
    where: { id: verification.userId },
    data: {
      idVerified: result.approved,
      backgroundCheck: result.backgroundCheckPassed ?? false,
    },
  });

  return verification;
}

// ---------------------------------------------------------------------------
// Derived helpers (pure functions)
// ---------------------------------------------------------------------------

/** Determine the user's verification level for badge display */
export function getVerificationLevel(user: {
  idVerified: boolean;
  backgroundCheck: boolean;
}): VerificationLevel {
  if (user.idVerified && user.backgroundCheck) return 'fully_verified';
  if (user.backgroundCheck) return 'background_checked';
  if (user.idVerified) return 'id_verified';
  return 'none';
}

/**
 * Check whether a user meets the requirements to rent / drive an RV:
 * - Age 25+
 * - Valid (non-expired) license
 * - Clean or minor driving record
 */
export function isDriverEligible(verification: {
  dateOfBirth: Date | null;
  licenseExpiry: Date | null;
  yearsLicensed: number | null;
  drivingRecordStatus: string | null;
}): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Age check (25+)
  if (verification.dateOfBirth) {
    const today = new Date();
    const age =
      today.getFullYear() -
      verification.dateOfBirth.getFullYear() -
      (today < new Date(today.getFullYear(), verification.dateOfBirth.getMonth(), verification.dateOfBirth.getDate())
        ? 1
        : 0);
    if (age < 25) {
      reasons.push('Must be at least 25 years old to drive an RV');
    }
  } else {
    reasons.push('Date of birth is required');
  }

  // License expiry
  if (verification.licenseExpiry) {
    if (verification.licenseExpiry < new Date()) {
      reasons.push('Driver\'s license has expired');
    }
  } else {
    reasons.push('License expiry date is required');
  }

  // Minimum experience
  if (verification.yearsLicensed !== null && verification.yearsLicensed < 2) {
    reasons.push('Must have at least 2 years of driving experience');
  }

  // Driving record
  if (
    verification.drivingRecordStatus === 'major_violations' ||
    verification.drivingRecordStatus === 'disqualified'
  ) {
    reasons.push('Driving record does not meet requirements');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

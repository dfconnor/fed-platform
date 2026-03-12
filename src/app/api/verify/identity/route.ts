/**
 * POST /api/verify/identity
 *
 * Multi-step identity verification endpoint. Accepts a step indicator
 * and step-specific data, creates a verification record if needed,
 * and updates it progressively. On the final step (driver_info),
 * if all data is present, mock-approves the verification.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import {
  getVerification,
  initiateVerification,
  processIdDocument,
  processSelfie,
  processDriverInfo,
  completeVerification,
} from '@/lib/verification';

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const idDocumentSchema = z.object({
  step: z.literal('id_document'),
  idType: z.enum(['drivers_license', 'passport', 'state_id']),
  idFrontPhoto: z.string().min(1, 'Front photo is required'),
  idBackPhoto: z.string().optional(),
});

const selfieSchema = z.object({
  step: z.literal('selfie'),
  selfiePhoto: z.string().min(1, 'Selfie photo is required'),
});

const driverInfoSchema = z.object({
  step: z.literal('driver_info'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseState: z.string().length(2, 'State must be a 2-letter code'),
  licenseExpiry: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid expiry date'),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date of birth'),
  yearsLicensed: z.number().int().min(0).max(80),
});

const stepSchema = z.discriminatedUnion('step', [
  idDocumentSchema,
  selfieSchema,
  driverInfoSchema,
]);

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = stepSchema.parse(body);

    // Get or create verification record
    let verification = await getVerification(session.user.id);
    if (!verification || verification.status === 'VERIFIED' || verification.status === 'FAILED') {
      verification = await initiateVerification(session.user.id);
    }

    // Process the submitted step
    switch (data.step) {
      case 'id_document': {
        verification = await processIdDocument(verification.id, {
          idType: data.idType,
          idFrontPhoto: data.idFrontPhoto,
          idBackPhoto: data.idBackPhoto,
        });
        break;
      }

      case 'selfie': {
        verification = await processSelfie(verification.id, data.selfiePhoto);
        break;
      }

      case 'driver_info': {
        verification = await processDriverInfo(verification.id, {
          licenseNumber: data.licenseNumber,
          licenseState: data.licenseState,
          licenseExpiry: new Date(data.licenseExpiry),
          dateOfBirth: new Date(data.dateOfBirth),
          yearsLicensed: data.yearsLicensed,
        });

        // If all data is present, mock-approve the verification
        if (
          verification.idFrontPhoto &&
          verification.selfiePhoto &&
          verification.licenseNumber
        ) {
          verification = await completeVerification(verification.id, {
            approved: true,
            drivingRecordStatus: 'clean',
            backgroundCheckPassed: true,
          });
        }
        break;
      }
    }

    return NextResponse.json({
      verification: {
        id: verification.id,
        status: verification.status,
        idType: verification.idType,
        hasIdFront: !!verification.idFrontPhoto,
        hasIdBack: !!verification.idBackPhoto,
        hasSelfie: !!verification.selfiePhoto,
        hasDriverInfo: !!verification.licenseNumber,
        verifiedAt: verification.verifiedAt,
        expiresAt: verification.expiresAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid verification data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('POST /api/verify/identity error:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 },
    );
  }
}

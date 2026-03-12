/**
 * POST /api/verify/webhook
 *
 * Webhook endpoint for verification provider callbacks (Persona / Onfido).
 * Currently a stub that validates a shared secret, extracts the result,
 * and calls completeVerification().
 */
import { NextRequest, NextResponse } from 'next/server';
import { completeVerification } from '@/lib/verification';

const WEBHOOK_SECRET = process.env.VERIFICATION_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Validate shared secret from headers
    const secret = request.headers.get('x-webhook-secret');
    if (!secret || secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { verificationId, result } = body as {
      verificationId?: string;
      result?: {
        approved: boolean;
        drivingRecordStatus?: string;
        backgroundCheckPassed?: boolean;
        rejectionReason?: string;
      };
    };

    if (!verificationId || !result) {
      return NextResponse.json(
        { error: 'Missing verificationId or result' },
        { status: 400 },
      );
    }

    await completeVerification(verificationId, {
      approved: result.approved,
      drivingRecordStatus: result.drivingRecordStatus,
      backgroundCheckPassed: result.backgroundCheckPassed,
      rejectionReason: result.rejectionReason,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('POST /api/verify/webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}

/**
 * Agreement Signing API Route
 *
 * POST /api/agreements/:id/sign - Sign an agreement as guest or host
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { signAgreement } from '@/lib/agreements';

interface RouteParams {
  params: { id: string };
}

const signSchema = z.object({
  signature: z.string().min(1, 'Signature is required'),
  signatureType: z.enum(['drawn', 'typed']),
});

/**
 * POST /api/agreements/:id/sign
 * Sign a rental agreement. Captures the user's signature along with
 * IP address and user agent for audit purposes. The authenticated user
 * must be either the guest or host of the associated booking.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const data = signSchema.parse(body);

    // Capture IP and user agent from headers
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const agreement = await signAgreement(id, session.user.id, {
      signature: data.signature,
      signatureType: data.signatureType,
      ipAddress,
      userAgent,
    });

    return NextResponse.json(agreement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid signature data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Handle known business logic errors
      const knownErrors = [
        'Agreement not found',
        'Agreement has been voided',
        'Agreement is already fully signed',
        'User is not a party to this agreement',
        'Guest has already signed this agreement',
        'Host has already signed this agreement',
      ];

      if (knownErrors.includes(error.message)) {
        const status =
          error.message === 'Agreement not found'
            ? 404
            : error.message === 'User is not a party to this agreement'
              ? 403
              : 400;
        return NextResponse.json({ error: error.message }, { status });
      }
    }

    console.error('POST /api/agreements/[id]/sign error:', error);
    return NextResponse.json(
      { error: 'Failed to sign agreement' },
      { status: 500 }
    );
  }
}

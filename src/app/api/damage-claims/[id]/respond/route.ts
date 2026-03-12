/**
 * Damage Claim Response API Route
 *
 * POST /api/damage-claims/:id/respond — Guest responds to a claim
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { respondToClaim } from '@/lib/claims';

const respondSchema = z.object({
  response: z
    .string()
    .min(10, 'Response must be at least 10 characters'),
  photos: z.array(z.string()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = respondSchema.parse(body);

    const claim = await respondToClaim(params.id, session.user.id, {
      response: data.response,
      photos: data.photos,
    });

    return NextResponse.json({ claim });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid response data', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('POST /api/damage-claims/[id]/respond error:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}

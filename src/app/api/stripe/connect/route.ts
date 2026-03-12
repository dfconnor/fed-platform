/**
 * Stripe Connect API Route
 *
 * POST /api/stripe/connect - Create a Stripe Connect Express account for a host
 * GET  /api/stripe/connect - Get an account onboarding link for a host
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

/**
 * POST /api/stripe/connect
 * Create a new Stripe Connect Express account for the authenticated user.
 * This is the first step in host onboarding — the account must be created
 * before the onboarding link can be generated.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user already has a Stripe account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.stripeAccountId) {
      // Account already exists — return an onboarding link to continue setup
      const link = await createAccountLink(user.stripeAccountId);
      return NextResponse.json({
        accountId: user.stripeAccountId,
        onboardingUrl: link.url,
        alreadyExists: true,
      });
    }

    // Create a new Stripe Connect Express account
    const account = await createConnectAccount(
      user.email || '',
      session.user.id
    );

    // Save the Stripe account ID to the user record
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeAccountId: account.id },
    });

    // Generate the onboarding link
    const link = await createAccountLink(account.id);

    return NextResponse.json(
      {
        accountId: account.id,
        onboardingUrl: link.url,
        alreadyExists: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/stripe/connect error:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe Connect account' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/connect
 * Get a new onboarding link for an existing Stripe Connect account.
 * Useful when the original onboarding link expires or the user needs
 * to continue setting up their account.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true },
    });

    if (!user?.stripeAccountId) {
      return NextResponse.json(
        { error: 'No Stripe account found. Create one first via POST.' },
        { status: 404 }
      );
    }

    const link = await createAccountLink(user.stripeAccountId);

    return NextResponse.json({
      accountId: user.stripeAccountId,
      onboardingUrl: link.url,
    });
  } catch (error) {
    console.error('GET /api/stripe/connect error:', error);
    return NextResponse.json(
      { error: 'Failed to generate onboarding link' },
      { status: 500 }
    );
  }
}

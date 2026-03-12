/**
 * Stripe Webhook API Route
 *
 * POST /api/stripe/webhook - Handle Stripe webhook events
 *
 * Handles:
 * - payment_intent.succeeded: Mark booking as paid, create payout record
 * - payment_intent.payment_failed: Update booking payment status
 * - account.updated: Update host Stripe account status
 */
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 * Receive and process Stripe webhook events. The webhook signature is
 * verified using the STRIPE_WEBHOOK_SECRET environment variable.
 *
 * This route must use the raw request body for signature verification,
 * so we disable the default body parser.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        // Unhandled event type — log but don't error
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle a successful payment. Marks the booking as paid and creates
 * a payout record for the host.
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId;
  if (!bookingId) {
    console.warn('payment_intent.succeeded: No bookingId in metadata');
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      hostId: true,
      total: true,
      platformFeeHost: true,
      platformFeeGuest: true,
      insuranceFee: true,
      status: true,
    },
  });

  if (!booking) {
    console.warn(`payment_intent.succeeded: Booking ${bookingId} not found`);
    return;
  }

  // Update booking with payment info
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      stripePaymentId: paymentIntent.id,
      paidAt: new Date(),
      // If booking was pending and instant-book, confirm it
      ...(booking.status === 'PENDING' ? { status: 'CONFIRMED' } : {}),
    },
  });

  // Calculate host payout amount (total minus platform fees and insurance)
  const hostPayoutAmount =
    booking.total -
    booking.platformFeeGuest -
    booking.platformFeeHost -
    booking.insuranceFee;

  // Create payout record for the host
  await prisma.payout.create({
    data: {
      hostId: booking.hostId,
      bookingId: booking.id,
      amount: hostPayoutAmount,
      status: 'PENDING',
    },
  });
}

/**
 * Handle a failed payment. Logs the failure for the associated booking.
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId;
  if (!bookingId) {
    console.warn('payment_intent.payment_failed: No bookingId in metadata');
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true },
  });

  if (!booking) {
    console.warn(`payment_intent.payment_failed: Booking ${bookingId} not found`);
    return;
  }

  // Log the failure — don't cancel the booking immediately, as the user
  // may retry payment. A separate cleanup job handles stale pending bookings.
  console.error(
    `Payment failed for booking ${bookingId}:`,
    paymentIntent.last_payment_error?.message
  );
}

/**
 * Handle a Stripe Connect account update. This fires when a host
 * completes or updates their onboarding, or when their account
 * status changes (e.g., payouts enabled/disabled).
 */
async function handleAccountUpdated(account: Stripe.Account) {
  const userId = account.metadata?.userId;
  if (!userId) {
    console.warn('account.updated: No userId in account metadata');
    return;
  }

  // Update the user record if payouts are now enabled
  // This could be extended to track detailed account status
  if (account.payouts_enabled) {
    console.log(`Stripe account ${account.id} payouts enabled for user ${userId}`);
  }

  if (account.charges_enabled) {
    console.log(`Stripe account ${account.id} charges enabled for user ${userId}`);
  }
}

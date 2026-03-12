import Stripe from 'stripe';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });
}

// Lazy-initialized to avoid build-time errors when env vars aren't set
let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) _stripe = getStripe();
    return (_stripe as any)[prop];
  },
});

// Create a Stripe Connect account for a host
export async function createConnectAccount(email: string, userId: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  return account;
}

// Generate onboarding link for host
export async function createAccountLink(accountId: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/dashboard/host/stripe?refresh=true`,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/host/stripe?success=true`,
    type: 'account_onboarding',
  });
  return link;
}

// Create payment intent for a booking
export async function createBookingPayment({
  amount,
  hostStripeAccountId,
  platformFee,
  bookingId,
  customerEmail,
  description,
}: {
  amount: number;
  hostStripeAccountId: string;
  platformFee: number;
  bookingId: string;
  customerEmail: string;
  description: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    application_fee_amount: platformFee,
    transfer_data: {
      destination: hostStripeAccountId,
    },
    metadata: {
      bookingId,
      customerEmail,
    },
    description,
    receipt_email: customerEmail,
  });

  return paymentIntent;
}

// Hold security deposit
export async function holdSecurityDeposit({
  amount,
  customerId,
  paymentMethodId,
  bookingId,
}: {
  amount: number;
  customerId: string;
  paymentMethodId: string;
  bookingId: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    payment_method: paymentMethodId,
    capture_method: 'manual', // Authorize only, capture later if needed
    metadata: {
      bookingId,
      type: 'security_deposit',
    },
    confirm: true,
  });

  return paymentIntent;
}

// Release security deposit hold
export async function releaseSecurityDeposit(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId);
}

// Capture security deposit (damage claim)
export async function captureSecurityDeposit(paymentIntentId: string, amount?: number) {
  return stripe.paymentIntents.capture(paymentIntentId, {
    amount_to_capture: amount,
  });
}

'use client';

// PostHog - open-source product analytics (self-hostable, free tier)
// Provides: event tracking, user journeys, funnels, session replay, feature flags, A/B testing
// Self-host via Docker: docker compose up with PostHog's docker-compose.yml
// Or use PostHog Cloud free tier (1M events/month free)

type EventProperties = Record<string, string | number | boolean | null | undefined>;

interface AnalyticsConfig {
  posthogKey: string;
  posthogHost: string;
  enabled: boolean;
}

const config: AnalyticsConfig = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  enabled: typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
};

// Lazy-load PostHog to avoid blocking page load
let posthogPromise: Promise<any> | null = null;

function getPostHog() {
  if (!config.enabled) return null;
  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then((mod) => {
      const posthog = mod.default;
      posthog.init(config.posthogKey, {
        api_host: config.posthogHost,
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '[data-mask]',
        },
        persistence: 'localStorage+cookie',
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') {
            ph.debug();
          }
        },
      });
      return posthog;
    });
  }
  return posthogPromise;
}

// ─── Core Tracking ──────────────────────────────────────────────────────

export async function trackEvent(event: string, properties?: EventProperties) {
  const ph = await getPostHog();
  ph?.capture(event, properties);
}

export async function identifyUser(userId: string, traits?: EventProperties) {
  const ph = await getPostHog();
  ph?.identify(userId, traits);
}

export async function resetUser() {
  const ph = await getPostHog();
  ph?.reset();
}

// ─── Page & Screen Tracking ─────────────────────────────────────────────

export async function trackPageView(url: string, properties?: EventProperties) {
  const ph = await getPostHog();
  ph?.capture('$pageview', { $current_url: url, ...properties });
}

// ─── Predefined Events ─────────────────────────────────────────────────

export const analytics = {
  // Search & Discovery
  search: (query: string, filters: EventProperties) =>
    trackEvent('search_performed', { query, ...filters }),

  viewListing: (listingId: string, rvType: string, price: number) =>
    trackEvent('listing_viewed', { listingId, rvType, price }),

  // Booking Funnel
  bookingStarted: (listingId: string, nights: number) =>
    trackEvent('booking_started', { listingId, nights }),

  insuranceSelected: (tier: string, provider: string, price: number) =>
    trackEvent('insurance_selected', { tier, provider, price }),

  addOnSelected: (addOn: string, price: number) =>
    trackEvent('add_on_selected', { addOn, price }),

  checkoutStarted: (total: number, paymentMethod: string) =>
    trackEvent('checkout_started', { total, paymentMethod }),

  paymentCompleted: (bookingId: string, total: number, paymentMethod: string) =>
    trackEvent('payment_completed', { bookingId, total, paymentMethod }),

  bookingConfirmed: (bookingId: string, total: number) =>
    trackEvent('booking_confirmed', { bookingId, total }),

  // Host Actions
  listingCreated: (listingId: string, rvType: string) =>
    trackEvent('listing_created', { listingId, rvType }),

  listingPublished: (listingId: string, nightlyRate: number) =>
    trackEvent('listing_published', { listingId, nightlyRate }),

  // Engagement
  messageSent: (bookingId?: string) =>
    trackEvent('message_sent', { bookingId }),

  reviewSubmitted: (rating: number, listingId: string) =>
    trackEvent('review_submitted', { rating, listingId }),

  favoritesToggled: (listingId: string, action: 'add' | 'remove') =>
    trackEvent('favorite_toggled', { listingId, action }),

  // Conversion
  signupStarted: (method: string) =>
    trackEvent('signup_started', { method }),

  signupCompleted: (method: string) =>
    trackEvent('signup_completed', { method }),

  hostOnboardingStarted: () =>
    trackEvent('host_onboarding_started'),

  stripeConnectCompleted: () =>
    trackEvent('stripe_connect_completed'),

  // Fee Comparison (unique to our value prop)
  feeComparisonViewed: (section: string) =>
    trackEvent('fee_comparison_viewed', { section }),

  savingsCalculated: (savings: number) =>
    trackEvent('savings_calculated', { savings }),
};

// ─── Feature Flags ──────────────────────────────────────────────────────

export async function isFeatureEnabled(flag: string): Promise<boolean> {
  const ph = await getPostHog();
  return ph?.isFeatureEnabled(flag) ?? false;
}

export async function getFeatureFlag(flag: string): Promise<string | boolean | undefined> {
  const ph = await getPostHog();
  return ph?.getFeatureFlag(flag);
}

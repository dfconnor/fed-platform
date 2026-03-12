'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReviewStars from '@/components/ReviewStars';
import { InsuranceTier, formatCents, formatCentsDecimal } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_BOOKING = {
  listing: {
    id: '1',
    title: '2023 Thor Palazzo 37.5 Class A Diesel Pusher',
    rvType: 'Class A Motorhome',
    location: 'Denver, CO',
    imageUrl: '/placeholder-rv-main.jpg',
    nightlyRate: 27500, // cents
    cleaningFee: 15000,
    securityDeposit: 150000,
    rating: 4.9,
    reviewCount: 47,
    instantBook: true,
    sleeps: 6,
    length: 38,
    year: 2023,
    host: {
      name: 'Mike Rodriguez',
      superhost: true,
      responseTime: 'within an hour',
    },
    deliveryAvailable: true,
    deliveryFeePerMile: 350,
    deliveryRadius: 75,
    cancellationPolicy: 'MODERATE',
    weeklyDiscount: 10,
    monthlyDiscount: 20,
  },
  dates: {
    checkIn: '2026-04-10',
    checkOut: '2026-04-15',
    nights: 5,
  },
  guests: 4,
};

// Insurance quotes from 3 providers per tier
const INSURANCE_QUOTES = {
  BASIC: [
    {
      provider: 'MBP Insurance',
      name: 'Basic Protection',
      pricePerDay: 2100, // cents
      totalPrice: 10500,
      liability: 500000,
      collision: 50000,
      comprehensive: 50000,
      interior: false,
      roadside: false,
      tripCancellation: false,
      deductible: 250000,
      best: true,
    },
    {
      provider: 'Cover Genius',
      name: 'Basic Protection',
      pricePerDay: 2300,
      totalPrice: 11500,
      liability: 500000,
      collision: 50000,
      comprehensive: 50000,
      interior: false,
      roadside: false,
      tripCancellation: false,
      deductible: 250000,
      best: false,
    },
    {
      provider: 'Roamly',
      name: 'Basic Protection',
      pricePerDay: 2700,
      totalPrice: 13500,
      liability: 500000,
      collision: 50000,
      comprehensive: 50000,
      interior: false,
      roadside: false,
      tripCancellation: false,
      deductible: 250000,
      best: false,
    },
  ],
  ESSENTIAL: [
    {
      provider: 'MBP Insurance',
      name: 'Essential Protection',
      pricePerDay: 3600,
      totalPrice: 18000,
      liability: 1000000,
      collision: 150000,
      comprehensive: 150000,
      interior: true,
      roadside: true,
      tripCancellation: false,
      deductible: 100000,
      best: true,
    },
    {
      provider: 'Cover Genius',
      name: 'Essential Protection',
      pricePerDay: 3800,
      totalPrice: 19000,
      liability: 1000000,
      collision: 150000,
      comprehensive: 150000,
      interior: true,
      roadside: true,
      tripCancellation: false,
      deductible: 100000,
      best: false,
    },
    {
      provider: 'Roamly',
      name: 'Essential Protection',
      pricePerDay: 4200,
      totalPrice: 21000,
      liability: 1000000,
      collision: 150000,
      comprehensive: 150000,
      interior: true,
      roadside: true,
      tripCancellation: false,
      deductible: 100000,
      best: false,
    },
  ],
  PREMIUM: [
    {
      provider: 'MBP Insurance',
      name: 'Premium Protection',
      pricePerDay: 5700,
      totalPrice: 28500,
      liability: 1000000,
      collision: 300000,
      comprehensive: 300000,
      interior: true,
      roadside: true,
      tripCancellation: true,
      deductible: 50000,
      best: true,
    },
    {
      provider: 'Cover Genius',
      name: 'Premium Protection',
      pricePerDay: 6000,
      totalPrice: 30000,
      liability: 1000000,
      collision: 300000,
      comprehensive: 300000,
      interior: true,
      roadside: true,
      tripCancellation: true,
      deductible: 50000,
      best: false,
    },
    {
      provider: 'Roamly',
      name: 'Premium Protection',
      pricePerDay: 6300,
      totalPrice: 31500,
      liability: 1000000,
      collision: 300000,
      comprehensive: 300000,
      interior: true,
      roadside: true,
      tripCancellation: true,
      deductible: 50000,
      best: false,
    },
  ],
};

const ADD_ONS = [
  { id: 'kitchen-kit', name: 'Kitchen Kit', description: 'Pots, pans, utensils, plates, cups for 6', price: 5000 },
  { id: 'camping-chairs', name: 'Camping Chairs (4)', description: 'Folding camp chairs with cup holders', price: 2500 },
  { id: 'bedding', name: 'Bedding Package', description: 'Sheets, pillows, blankets for all beds', price: 6000 },
  { id: 'patio-mat', name: 'Outdoor Mat & Lights', description: '9x12 patio mat with LED string lights', price: 3000 },
  { id: 'bikes', name: 'Bike Rack + 2 Bikes', description: 'Hitch-mounted rack with 2 mountain bikes', price: 7500 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InsuranceSelector({
  selectedTier,
  selectedProvider,
  onSelect,
  expandedTier,
  onExpandTier,
}: {
  selectedTier: InsuranceTier;
  selectedProvider: string;
  onSelect: (tier: InsuranceTier, provider: string) => void;
  expandedTier: InsuranceTier | null;
  onExpandTier: (tier: InsuranceTier | null) => void;
}) {
  const tiers: InsuranceTier[] = ['BASIC', 'ESSENTIAL', 'PREMIUM'];
  const tierLabels: Record<InsuranceTier, string> = {
    BASIC: 'Basic',
    ESSENTIAL: 'Essential',
    PREMIUM: 'Premium',
  };

  return (
    <div className="space-y-3">
      {tiers.map((tier) => {
        const quotes = INSURANCE_QUOTES[tier];
        const bestQuote = quotes.find((q) => q.best)!;
        const isSelected = selectedTier === tier;
        const isExpanded = expandedTier === tier;

        return (
          <div key={tier}>
            {/* Tier Card */}
            <div
              className={cn(
                'rounded-xl border-2 transition-all',
                isSelected ? 'border-brand-500 bg-brand-50/30' : 'border-gray-200'
              )}
            >
              <button
                className="w-full p-4 text-left"
                onClick={() => onSelect(tier, bestQuote.provider)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        isSelected ? 'border-brand-500' : 'border-gray-300'
                      )}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{bestQuote.name}</span>
                        {tier === 'ESSENTIAL' && (
                          <span className="badge bg-brand-100 text-brand-700 text-[10px]">Most Popular</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatCents(bestQuote.liability / 100)} liability
                        {bestQuote.roadside ? ' + roadside' : ''}
                        {bestQuote.tripCancellation ? ' + trip cancellation' : ''}
                        {' | '}{formatCents(bestQuote.deductible)} deductible
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-gray-900">{formatCents(bestQuote.totalPrice)}</p>
                    <p className="text-xs text-gray-500">{formatCents(bestQuote.pricePerDay)}/day</p>
                  </div>
                </div>

                {/* Coverage icons row */}
                <div className="flex items-center gap-4 mt-3 ml-8 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    Liability
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    Collision
                  </span>
                  {bestQuote.interior && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Interior
                    </span>
                  )}
                  {bestQuote.roadside && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Roadside
                    </span>
                  )}
                  {bestQuote.tripCancellation && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Cancellation
                    </span>
                  )}
                </div>
              </button>

              {/* Compare Providers */}
              {isSelected && (
                <div className="px-4 pb-3">
                  <button
                    className="text-xs text-brand-600 font-medium hover:text-brand-700 ml-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpandTier(isExpanded ? null : tier);
                    }}
                  >
                    {isExpanded ? 'Hide' : 'Compare'} {quotes.length} providers
                    <svg
                      className={cn('w-3 h-3 inline ml-1 transition-transform', isExpanded && 'rotate-180')}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Expanded Provider Comparison */}
            {isExpanded && isSelected && (
              <div className="mt-2 ml-8 space-y-2 animate-slide-down">
                {quotes.map((quote) => (
                  <button
                    key={quote.provider}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors',
                      selectedProvider === quote.provider
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    onClick={() => onSelect(tier, quote.provider)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          selectedProvider === quote.provider ? 'border-brand-500' : 'border-gray-300'
                        )}
                      >
                        {selectedProvider === quote.provider && (
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{quote.provider}</span>
                        {quote.best && (
                          <span className="ml-2 text-[10px] font-medium text-brand-600">Best Rate</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCents(quote.totalPrice)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function BookingPage() {
  const params = useParams();
  const listingId = params.id as string;
  const { listing, dates } = MOCK_BOOKING;

  // Form State
  const [selectedInsuranceTier, setSelectedInsuranceTier] = useState<InsuranceTier>('ESSENTIAL');
  const [selectedProvider, setSelectedProvider] = useState('MBP Insurance');
  const [expandedTier, setExpandedTier] = useState<InsuranceTier | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [wantsDelivery, setWantsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryMiles, setDeliveryMiles] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    driversLicense: '',
  });
  const [specialRequests, setSpecialRequests] = useState('');

  // Derived pricing
  const selectedQuotes = INSURANCE_QUOTES[selectedInsuranceTier];
  const activeQuote = selectedQuotes.find((q) => q.provider === selectedProvider) || selectedQuotes[0];

  const addOnsTotal = useMemo(() => {
    return ADD_ONS.filter((ao) => selectedAddOns.includes(ao.id)).reduce((sum, ao) => sum + ao.price, 0);
  }, [selectedAddOns]);

  const deliveryFee = wantsDelivery ? listing.deliveryFeePerMile * deliveryMiles : 0;

  const nightlyTotal = listing.nightlyRate * dates.nights;
  const subtotal = nightlyTotal + listing.cleaningFee + activeQuote.totalPrice + addOnsTotal + deliveryFee;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  // Outdoorsy comparison
  const outdoorsyFee = Math.round(subtotal * 0.25);
  const savings = outdoorsyFee - serviceFee;

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleInsuranceSelect = (tier: InsuranceTier, provider: string) => {
    setSelectedInsuranceTier(tier);
    setSelectedProvider(provider);
  };

  return (
    <div className="container-wide py-6 sm:py-10">
      {/* Back Link */}
      <Link
        href={`/listing/${listingId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listing
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Confirm Your Booking</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Form */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Booking Summary */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Trip</h2>
            <div className="card p-4 flex gap-4">
              <div className="w-28 h-20 rounded-xl bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.rvType} &middot; {listing.location}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <strong>Check-in:</strong> {new Date(dates.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>
                    <strong>Check-out:</strong> {new Date(dates.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{dates.nights} nights</span>
                  <span>&middot;</span>
                  <span>{MOCK_BOOKING.guests} guests</span>
                  <span>&middot;</span>
                  <ReviewStars rating={listing.rating} count={listing.reviewCount} size="sm" />
                </div>
              </div>
            </div>
          </section>

          {/* Insurance Comparison */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Choose Your Insurance</h2>
              <span className="text-xs text-gray-500">Best rates from 3 providers</span>
            </div>
            <InsuranceSelector
              selectedTier={selectedInsuranceTier}
              selectedProvider={selectedProvider}
              onSelect={handleInsuranceSelect}
              expandedTier={expandedTier}
              onExpandTier={setExpandedTier}
            />
          </section>

          {/* Add-ons */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add-ons from Host</h2>
            <div className="space-y-2">
              {ADD_ONS.map((addOn) => (
                <label
                  key={addOn.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                    selectedAddOns.includes(addOn.id)
                      ? 'border-brand-500 bg-brand-50/30'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-5 h-5"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{addOn.name}</span>
                    <p className="text-sm text-gray-500">{addOn.description}</p>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCents(addOn.price)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Delivery Option */}
          {listing.deliveryAvailable && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h2>
              <label className="flex items-center gap-4 cursor-pointer select-none mb-4">
                <div
                  className={cn(
                    'relative w-10 h-6 rounded-full transition-colors',
                    wantsDelivery ? 'bg-brand-600' : 'bg-gray-300'
                  )}
                  onClick={() => setWantsDelivery(!wantsDelivery)}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                      wantsDelivery && 'translate-x-4'
                    )}
                  />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Have the RV delivered to you</span>
                  <p className="text-sm text-gray-500">
                    {formatCentsDecimal(listing.deliveryFeePerMile)}/mile &middot; up to {listing.deliveryRadius} miles
                  </p>
                </div>
              </label>

              {wantsDelivery && (
                <div className="space-y-4 ml-14 animate-slide-down">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Campground name or street address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated distance (miles)</label>
                    <input
                      type="number"
                      className="input-field w-32"
                      placeholder="0"
                      max={listing.deliveryRadius}
                      value={deliveryMiles || ''}
                      onChange={(e) => setDeliveryMiles(Math.min(listing.deliveryRadius, Number(e.target.value) || 0))}
                    />
                    {deliveryMiles > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Delivery fee: {formatCents(deliveryFee)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Guest Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John"
                  value={guestInfo.firstName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                  value={guestInfo.lastName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="(555) 123-4567"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="input-field"
                  value={guestInfo.dob}
                  onChange={(e) => setGuestInfo({ ...guestInfo, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver&apos;s License #</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="License number"
                  value={guestInfo.driversLicense}
                  onChange={(e) => setGuestInfo({ ...guestInfo, driversLicense: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Special Requests */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h2>
            <textarea
              className="input-field min-h-[100px] resize-y"
              placeholder="Any special requests or questions for the host? (optional)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
            <div className="card p-5">
              <span className="badge bg-brand-50 text-brand-700 font-semibold mb-3 capitalize">
                {listing.cancellationPolicy.toLowerCase()}
              </span>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Full refund if cancelled 7+ days before check-in
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  50% refund if cancelled 3-7 days before check-in
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                  No refund within 3 days of check-in
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Price Breakdown (sticky) */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Price Breakdown Card */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{formatCents(listing.nightlyRate)}/night x {dates.nights} nights</span>
                  <span>{formatCents(nightlyTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cleaning fee</span>
                  <span>{formatCents(listing.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Insurance ({activeQuote.name})
                  </span>
                  <span>{formatCents(activeQuote.totalPrice)}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Add-ons ({selectedAddOns.length})</span>
                    <span>{formatCents(addOnsTotal)}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery ({deliveryMiles} mi)</span>
                    <span>{formatCents(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Service fee (5%)</span>
                  <span>{formatCents(serviceFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{formatCents(total)}</span>
                </div>
              </div>

              {/* Security Deposit */}
              <p className="text-xs text-gray-400 mt-3">
                + {formatCents(listing.securityDeposit)} refundable security deposit hold
              </p>

              {/* Savings */}
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 mt-4 text-center">
                <p className="text-sm font-semibold text-brand-800">
                  You save {formatCents(savings)} vs Outdoorsy
                </p>
                <p className="text-xs text-brand-600 mt-0.5">5% service fee vs their 25%</p>
              </div>

              {/* Verification Gate */}
              <div className="mt-6 p-3 bg-sunset-50 border border-sunset-200 rounded-xl flex items-start gap-2.5">
                <svg className="h-5 w-5 text-sunset-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 2.632.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516c-2.95.1-5.669-.98-7.877-2.632zM15.53 9.53a.75.75 0 00-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-sunset-800">Identity verification required</p>
                  <p className="text-xs text-sunset-600 mt-0.5">Verify your ID to book. It takes about 2 minutes.</p>
                  <Link href="/verify" className="inline-flex items-center gap-1 text-xs font-semibold text-sunset-700 hover:text-sunset-800 mt-1.5">
                    Verify Now
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>

              {/* Continue to Payment */}
              <button className="btn-primary w-full text-base py-3.5 mt-4">
                Continue to Payment
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">
                You won&apos;t be charged until you complete the next step
              </p>
            </div>

            {/* Trust Badges */}
            <div className="card p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">$1M Insured</p>
                </div>
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Verified Host</p>
                </div>
                <div>
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Secure Payment</p>
                </div>
              </div>
            </div>

            {/* Host Info Reminder */}
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-200 flex items-center justify-center text-forest-700 font-bold text-sm flex-shrink-0">
                MR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Hosted by {listing.host.name}
                  {listing.host.superhost && (
                    <span className="ml-1 text-[10px] badge bg-sunset-50 text-sunset-700 align-middle">Superhost</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">Responds {listing.host.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

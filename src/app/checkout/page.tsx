'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PaymentMethod = 'card' | 'affirm' | 'klarna';
type InsuranceTier = 'basic' | 'standard' | 'premium';

const mockBooking = {
  rv: {
    title: '2024 Thor Chateau 31W',
    image: '/images/rv-placeholder.jpg',
    type: 'Class C Motorhome',
    location: 'Denver, CO',
    host: 'Mike R.',
    rating: 4.9,
    reviewCount: 47,
  },
  dates: {
    start: 'Mar 22, 2026',
    end: 'Mar 29, 2026',
    nights: 7,
  },
  pricing: {
    nightlyRate: 185,
    nights: 7,
    subtotal: 1295,
    cleaningFee: 125,
    serviceFee: 71.0,
    insuranceBasic: 0,
    insuranceStandard: 98,
    insurancePremium: 175,
    securityDeposit: 500,
    outdoorsyComparison: 1842,
  },
};

const insuranceTiers: { id: InsuranceTier; name: string; price: number; coverage: string; features: string[] }[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    coverage: '$50K',
    features: ['Liability coverage', '$2,500 deductible'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 98,
    coverage: '$250K',
    features: ['Comprehensive coverage', '$1,000 deductible', 'Roadside assistance'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 175,
    coverage: '$1M',
    features: ['Full coverage', '$0 deductible', 'Roadside assistance', 'Personal belongings', 'Trip interruption'],
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceTier>('standard');
  const [affirmTerm, setAffirmTerm] = useState<3 | 6 | 12>(6);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const insurancePrice =
    selectedInsurance === 'basic'
      ? 0
      : selectedInsurance === 'standard'
        ? mockBooking.pricing.insuranceStandard
        : mockBooking.pricing.insurancePremium;

  const total =
    mockBooking.pricing.subtotal +
    mockBooking.pricing.cleaningFee +
    mockBooking.pricing.serviceFee +
    insurancePrice;

  const savings = mockBooking.pricing.outdoorsyComparison - total;

  const affirmMonthly: Record<3 | 6 | 12, number> = {
    3: Math.ceil(total / 3),
    6: Math.ceil(total / 6),
    12: Math.ceil(total / 12),
  };

  const klarnaInstallment = Math.ceil(total / 4);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    // Simulated processing
    setTimeout(() => {
      window.location.href = '/checkout/success';
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Savings banner */}
      <div className="bg-brand-600 text-white py-3">
        <div className="container-wide text-center">
          <p className="text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Save ${savings.toFixed(0)} compared to Outdoorsy on this booking!
            </span>
          </p>
        </div>
      </div>

      <div className="container-wide py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
          <Link href="/search" className="hover:text-brand-600 transition-colors">Browse</Link>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-6">
                  {/* Tabs */}
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
                    {[
                      { id: 'card' as const, label: 'Credit/Debit Card', icon: (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" /></svg>
                      )},
                      { id: 'affirm' as const, label: 'Affirm', icon: (
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 rounded px-1.5 py-0.5">affirm</span>
                      )},
                      { id: 'klarna' as const, label: 'Klarna', icon: (
                        <span className="text-xs font-bold text-pink-700 bg-pink-100 rounded px-1.5 py-0.5">klarna</span>
                      )},
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors',
                          paymentMethod === tab.id
                            ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Card Fields */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                        <div className="relative">
                          <input
                            id="card-number"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input-field pl-11"
                            maxLength={19}
                          />
                          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                          <input id="expiry" type="text" placeholder="MM / YY" className="input-field" maxLength={7} />
                        </div>
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                          <input id="cvc" type="text" placeholder="123" className="input-field" maxLength={4} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                        <input id="card-name" type="text" placeholder="John Doe" className="input-field" />
                      </div>
                    </div>
                  )}

                  {/* Affirm BNPL */}
                  {paymentMethod === 'affirm' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">Pay over time with Affirm</p>
                        <p className="text-xs text-blue-600">Choose your payment plan. No hidden fees.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {([3, 6, 12] as const).map((months) => (
                          <button
                            key={months}
                            type="button"
                            onClick={() => setAffirmTerm(months)}
                            className={cn(
                              'rounded-xl border-2 p-4 text-center transition-all',
                              affirmTerm === months
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <p className="text-2xl font-bold text-gray-900">{months}</p>
                            <p className="text-xs text-gray-500 mb-2">months</p>
                            <p className="text-lg font-semibold text-blue-700">${affirmMonthly[months]}/mo</p>
                            <p className="text-[10px] text-gray-400 mt-1">{months === 3 ? '0%' : months === 6 ? '10%' : '15%'} APR</p>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Pay as low as ${affirmMonthly[12]}/mo. Subject to credit check.
                      </p>
                    </div>
                  )}

                  {/* Klarna Pay in 4 */}
                  {paymentMethod === 'klarna' && (
                    <div className="space-y-4">
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                        <p className="text-sm font-medium text-pink-800 mb-1">Pay in 4 interest-free installments</p>
                        <p className="text-xs text-pink-600">Split your purchase into 4 payments. No interest.</p>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="rounded-xl border border-gray-200 p-3 text-center">
                            <p className="text-[10px] text-gray-400 uppercase font-medium mb-1">
                              {n === 1 ? 'Today' : `In ${(n - 1) * 2} wks`}
                            </p>
                            <p className="text-lg font-bold text-gray-900">${klarnaInstallment}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Total: ${total.toFixed(2)} -- 4 payments of ${klarnaInstallment}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Tier Confirmation */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Trip Protection</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {insuranceTiers.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedInsurance(tier.id)}
                        className={cn(
                          'relative rounded-xl border-2 p-4 text-left transition-all',
                          selectedInsurance === tier.id
                            ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {tier.id === 'standard' && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-sunset-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                            Best Rate
                          </span>
                        )}
                        <p className="text-sm font-semibold text-gray-900">{tier.name}</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">
                          {tier.price === 0 ? 'Included' : `$${tier.price}`}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">{tier.coverage} coverage</p>
                        <ul className="space-y-1">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <svg className="h-3.5 w-3.5 text-brand-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input id="first-name" type="text" placeholder="John" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input id="last-name" type="text" placeholder="Doe" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input id="email" type="email" placeholder="john@example.com" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input id="phone" type="tel" placeholder="(555) 123-4567" className="input-field" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Billing Address</label>
                    <input id="address" type="text" placeholder="123 Main St" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input id="city" type="text" placeholder="Denver" className="input-field" />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                      <input id="state" type="text" placeholder="CO" className="input-field" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1.5">ZIP</label>
                      <input id="zip" type="text" placeholder="80202" className="input-field" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Deposit + Cancellation */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-4">
                  {/* Security Deposit */}
                  <div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                    <svg className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                    <div>
                      <p className="text-sm font-medium text-sky-800">Security Deposit: ${mockBooking.pricing.securityDeposit} hold</p>
                      <p className="text-xs text-sky-600 mt-0.5">A temporary hold of ${mockBooking.pricing.securityDeposit} will be authorized on your card. This is released within 3 business days after your trip ends, provided no damage claims are filed.</p>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <svg className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Flexible Cancellation Policy</p>
                      <p className="text-xs text-gray-500 mt-0.5">Full refund if cancelled 7+ days before trip. 50% refund for cancellations 3-7 days before. No refund within 3 days of departure.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Submit (mobile only version at bottom) */}
              <div className="lg:hidden space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-brand-600 hover:underline">Terms of Service</Link>,{' '}
                    <Link href="/legal/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>, and{' '}
                    <Link href="/legal/rental-agreement" className="text-brand-600 hover:underline">Rental Agreement</Link>.
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={!agreeTerms || isProcessing}
                  className="btn-primary w-full !py-4 !text-base gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* RV Image */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-forest-100 to-brand-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-16 w-16 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="6" width="22" height="12" rx="2" />
                        <path d="M6 18v2M18 18v2M1 12h22M6 6V4M14 6V4" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{mockBooking.rv.title}</h3>
                    <p className="text-sm text-gray-500">{mockBooking.rv.type} &middot; {mockBooking.rv.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="h-4 w-4 text-sunset-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                      <span className="text-sm font-medium text-gray-900">{mockBooking.rv.rating}</span>
                      <span className="text-xs text-gray-500">({mockBooking.rv.reviewCount} reviews)</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
                        {mockBooking.dates.start} - {mockBooking.dates.end}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{mockBooking.dates.nights} nights</p>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">${mockBooking.pricing.nightlyRate} x {mockBooking.pricing.nights} nights</span>
                        <span className="text-gray-900">${mockBooking.pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cleaning fee</span>
                        <span className="text-gray-900">${mockBooking.pricing.cleaningFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service fee (5%)</span>
                        <span className="text-gray-900">${mockBooking.pricing.serviceFee.toFixed(2)}</span>
                      </div>
                      {insurancePrice > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Trip protection ({selectedInsurance})</span>
                          <span className="text-gray-900">${insurancePrice.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-100">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Hosted by */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">MR</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Hosted by {mockBooking.rv.host}</p>
                        <p className="text-xs text-gray-500">Superhost &middot; Usually responds within 1 hour</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms & Submit (desktop) */}
                <div className="hidden lg:block space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/legal/terms" className="text-brand-600 hover:underline">Terms of Service</Link>,{' '}
                      <Link href="/legal/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>, and{' '}
                      <Link href="/legal/rental-agreement" className="text-brand-600 hover:underline">Rental Agreement</Link>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!agreeTerms || isProcessing}
                    className="btn-primary w-full !py-4 !text-base gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                        Pay ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                    256-bit encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.258a33.186 33.186 0 016.668.83.75.75 0 01-.336 1.461 31.28 31.28 0 00-1.103-.232l1.702 7.545a.75.75 0 01-.387.832A4.981 4.981 0 0115 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.77-7.849a31.743 31.743 0 00-3.339-.254v11.505A20.01 20.01 0 0113.196 16H15.5a.75.75 0 010 1.5h-11a.75.75 0 010-1.5h2.304a20.04 20.04 0 002.446-.086V4.51a31.6 31.6 0 00-3.339.254l1.77 7.85a.75.75 0 01-.387.831A4.98 4.98 0 015 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832L4.02 5.067c-.375.07-.748.15-1.12.237a.75.75 0 11-.337-1.462 33.053 33.053 0 016.668-.829V2.75A.75.75 0 0110 2z" clipRule="evenodd" /></svg>
                    $1M coverage
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    Verified host
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

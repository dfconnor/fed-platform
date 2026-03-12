'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    q: 'Is insurance required for every booking?',
    a: 'Yes. All bookings on Rival RV require an active insurance plan. The Basic plan is included at no additional cost. Guests may upgrade to Essential or Premium during checkout for enhanced coverage and lower deductibles.',
  },
  {
    q: 'Does this insurance replace my personal auto insurance?',
    a: 'No. Rival RV insurance operates on a secondary/excess basis, meaning it supplements your existing personal auto insurance. Your personal policy is primary. If your personal insurance does not cover RV rentals (many do not), then the Rival RV plan becomes the primary source of coverage.',
  },
  {
    q: 'What if I already have RV insurance through my own policy?',
    a: 'You are still required to carry a Rival RV insurance plan for every booking. However, you may choose the Basic plan (included free) if you are confident your personal policy provides adequate primary coverage for a rented RV.',
  },
  {
    q: 'How do I file a claim?',
    a: 'Claims are filed through the Rival RV damage claims process. Report damage immediately, document it with photos and video, and the host will initiate a claim through the dashboard. Our team coordinates with the insurance provider on your behalf.',
  },
  {
    q: 'Are there geographic restrictions on coverage?',
    a: 'Coverage is valid throughout the continental United States and Canada. Coverage does not extend to Mexico, Alaska (unless specifically noted), or any country outside North America. Operating the vehicle outside the covered territory voids coverage.',
  },
  {
    q: 'What happens if the claim exceeds the coverage limit?',
    a: 'If damages exceed the coverage limit of your selected plan, the renter is personally responsible for the remaining amount. This is one reason we recommend the Premium plan for high-value vehicles, as it provides the highest coverage limits and lowest deductible.',
  },
];

const tiers = [
  {
    name: 'Basic',
    price: 'Included',
    description: 'Essential protection at no extra cost',
    popular: false,
    color: 'gray',
    liability: '$500,000',
    collision: '$50,000',
    comprehensive: '$50,000',
    interior: false,
    roadside: false,
    tripCancellation: false,
    deductible: '$2,500',
  },
  {
    name: 'Essential',
    price: '$29/day',
    description: 'Enhanced coverage for peace of mind',
    popular: true,
    color: 'brand',
    liability: '$1,000,000',
    collision: '$150,000',
    comprehensive: '$150,000',
    interior: true,
    roadside: true,
    tripCancellation: false,
    deductible: '$1,000',
  },
  {
    name: 'Premium',
    price: '$49/day',
    description: 'Maximum protection with lowest deductible',
    popular: false,
    color: 'forest',
    liability: '$1,000,000',
    collision: '$300,000',
    comprehensive: '$300,000',
    interior: true,
    roadside: true,
    tripCancellation: true,
    deductible: '$500',
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export default function InsurancePolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-12 sm:-mt-16 lg:-mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">
            Insurance &amp; Coverage
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Every trip includes insurance protection. Choose the tier that fits your needs and travel with confidence.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Comparison table */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Compare Coverage Tiers</h2>

          {/* Mobile cards */}
          <div className="md:hidden space-y-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'rounded-2xl border p-6',
                  tier.popular
                    ? 'border-brand-300 bg-brand-50/50 shadow-md ring-1 ring-brand-200 relative'
                    : 'border-gray-200 bg-white'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{tier.price}</p>
                <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Liability</span><span className="font-medium text-gray-900">{tier.liability}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Collision</span><span className="font-medium text-gray-900">{tier.collision}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Comprehensive</span><span className="font-medium text-gray-900">{tier.comprehensive}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Interior Protection</span><span>{tier.interior ? <CheckIcon /> : <XIcon />}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">24/7 Roadside</span><span>{tier.roadside ? <CheckIcon /> : <XIcon />}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Trip Cancellation</span><span>{tier.tripCancellation ? <CheckIcon /> : <XIcon />}</span></div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between"><span className="text-gray-500">Deductible</span><span className="font-semibold text-gray-900">{tier.deductible}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900 w-1/4">Coverage</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className={cn('text-center px-4 py-4 w-1/4', tier.popular && 'bg-brand-50')}>
                      <div className="font-bold text-gray-900">{tier.name}</div>
                      <div className="text-lg font-bold text-gray-900 mt-0.5">{tier.price}</div>
                      {tier.popular && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-full">
                          Most Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-3 text-gray-600">Liability</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3 font-medium text-gray-900', t.popular && 'bg-brand-50/50')}>{t.liability}</td>)}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-600">Collision</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3 font-medium text-gray-900', t.popular && 'bg-brand-50/50')}>{t.collision}</td>)}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-600">Comprehensive</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3 font-medium text-gray-900', t.popular && 'bg-brand-50/50')}>{t.comprehensive}</td>)}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-600">Interior Protection</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3', t.popular && 'bg-brand-50/50')}><span className="inline-flex justify-center">{t.interior ? <CheckIcon /> : <XIcon />}</span></td>)}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-600">24/7 Roadside Assistance</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3', t.popular && 'bg-brand-50/50')}><span className="inline-flex justify-center">{t.roadside ? <CheckIcon /> : <XIcon />}</span></td>)}
                </tr>
                <tr>
                  <td className="px-6 py-3 text-gray-600">Trip Cancellation</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3', t.popular && 'bg-brand-50/50')}><span className="inline-flex justify-center">{t.tripCancellation ? <CheckIcon /> : <XIcon />}</span></td>)}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 font-semibold text-gray-900">Deductible</td>
                  {tiers.map((t) => <td key={t.name} className={cn('text-center px-4 py-3 font-bold text-gray-900', t.popular && 'bg-brand-50')}>{t.deductible}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How insurance works */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How Insurance Works</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              Rival RV insurance operates on a <span className="font-semibold text-gray-900">secondary/excess basis</span>. This means it supplements your existing personal auto insurance rather than replacing it. If your personal policy provides coverage for rental RVs, your personal policy is primary and the Rival RV plan covers any gaps or remaining amounts.
            </p>
            <p>
              If your personal auto insurance does not cover RV rentals (which is common), the Rival RV plan becomes your primary source of coverage for the duration of the trip.
            </p>
            <p>
              In the event of a claim, our team works directly with the insurance provider to process and resolve claims on your behalf, reducing the administrative burden for both guests and hosts.
            </p>
          </div>
        </div>

        {/* Providers */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Providers</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            We compare quotes from multiple A-rated insurance providers to offer you the best coverage at competitive rates:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-900">Cover Genius</p>
              <p className="text-xs text-gray-500 mt-1">Global insurtech specializing in embedded protection for travel and rental marketplaces.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-900">Roamly</p>
              <p className="text-xs text-gray-500 mt-1">Purpose-built RV and outdoor vehicle insurance provider with deep industry expertise.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-900">MBP Insurance</p>
              <p className="text-xs text-gray-500 mt-1">Specialty recreational vehicle insurance with tailored coverage for peer-to-peer rentals.</p>
            </div>
          </div>
        </div>

        {/* What's NOT covered */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What Is Not Covered</h2>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="mb-3">The following are excluded from all insurance plans:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Intentional damage or vandalism by the renter',
                'Damage while operating under the influence of drugs or alcohol (DUI/DWI)',
                'Damage caused by unauthorized or unlicensed drivers',
                'Normal wear and tear',
                'Pre-existing damage documented before the trip',
                'Personal belongings left inside the vehicle',
                'Damage from operating outside geographic restrictions',
                'Mechanical failure due to renter negligence',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-sunset-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Claims process */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Claims Process</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Report Damage', description: 'Document damage with photos and video immediately upon discovery. Notify the host and Rival RV support.' },
              { step: 2, title: 'File Claim Within 7 Days', description: 'Host files a damage claim through the dashboard with documentation and cost estimates.' },
              { step: 3, title: 'Review', description: 'Our claims team reviews evidence from both parties and coordinates with the insurance provider.' },
              { step: 4, title: 'Resolution', description: 'Claim is approved, partially approved, or denied. Funds are disbursed or the security deposit is adjusted accordingly.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-1.5">
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{item.q}</span>
                  <svg
                    className={cn(
                      'w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200',
                      openFaq === i && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openFaq === i ? 'max-h-96 pb-5 px-6' : 'max-h-0'
                  )}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-6">
            <Link href="/policies/cancellation" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              &larr; Cancellation Policy
            </Link>
            <Link href="/policies/damage-claims" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Damage Claims &rarr;
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Rival RV, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

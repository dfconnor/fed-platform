'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    q: 'What happens if the host cancels my booking?',
    a: 'If a host cancels your booking, you will receive a 100% refund of the total booking amount, including all fees. The host will also incur a cancellation penalty, which may include a financial fee and reduced search ranking.',
  },
  {
    q: 'Does the 48-hour grace period apply to all bookings?',
    a: 'Yes. All bookings include a 48-hour grace period from the time of booking confirmation. During this period, you may cancel for a full refund regardless of the cancellation policy tier. This does not apply if the trip start date is within 48 hours of booking.',
  },
  {
    q: 'Are service fees refundable?',
    a: 'No. The 5% guest service fee is non-refundable for all cancellation tiers. This fee covers payment processing, platform operations, and customer support costs. The only exception is if the host cancels the booking.',
  },
  {
    q: 'Can I change my dates instead of cancelling?',
    a: 'Yes. You can request a date change through the booking details page. Date changes are subject to host approval and availability. If the new dates result in a lower total, the difference will be refunded according to the applicable cancellation policy.',
  },
  {
    q: 'What if I need to cancel due to an emergency?',
    a: 'We review emergency cancellations on a case-by-case basis. Qualifying emergencies include severe weather events at the destination, documented medical emergencies, and government-issued travel restrictions. Contact support@rivalrv.com with documentation.',
  },
  {
    q: 'How long does it take to receive my refund?',
    a: 'Refunds are processed within 3-5 business days of cancellation. The funds may take an additional 5-10 business days to appear on your statement, depending on your bank or payment provider.',
  },
];

export default function CancellationPolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-12 sm:-mt-16 lg:-mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">
            Cancellation Policies
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Flexible options for guests and hosts. Every booking includes a 48-hour grace period.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grace period callout */}
        <div className="rounded-xl bg-brand-50 border-l-4 border-brand-600 p-5 mb-12">
          <div className="flex gap-3">
            <svg className="h-6 w-6 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div>
              <h2 className="font-semibold text-brand-900">48-Hour Grace Period</h2>
              <p className="mt-1 text-sm text-brand-700">
                All bookings include a 48-hour grace period from the time of booking confirmation. Cancel within this window for a 100% refund, regardless of the cancellation tier &mdash; as long as the trip start date is more than 48 hours away.
              </p>
            </div>
          </div>
        </div>

        {/* 3-column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Flexible */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-brand-50 px-6 py-4 border-b border-brand-100">
              <h3 className="text-lg font-bold text-brand-800">Flexible</h3>
              <p className="text-sm text-brand-600 mt-0.5">Best for guests who want maximum flexibility</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">14+ days before</span>
                <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">100%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">7&ndash;13 days before</span>
                <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">75%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">1&ndash;6 days before</span>
                <span className="font-semibold text-sunset-600 bg-sunset-50 px-2 py-0.5 rounded">50%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Less than 24 hours</span>
                <span className="font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">0%</span>
              </div>
            </div>
          </div>

          {/* Moderate */}
          <div className="rounded-2xl border-2 border-brand-300 bg-white shadow-md overflow-hidden relative">
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
              Most Common
            </div>
            <div className="bg-brand-50 px-6 py-4 border-b border-brand-100">
              <h3 className="text-lg font-bold text-brand-800">Moderate</h3>
              <p className="text-sm text-brand-600 mt-0.5">Balance between flexibility and commitment</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">14+ days before</span>
                <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">100%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">7&ndash;13 days before</span>
                <span className="font-semibold text-sunset-600 bg-sunset-50 px-2 py-0.5 rounded">50%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Less than 7 days</span>
                <span className="font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">0%</span>
              </div>
            </div>
          </div>

          {/* Strict */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Strict</h3>
              <p className="text-sm text-gray-500 mt-0.5">Maximum protection for hosts</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">30+ days before</span>
                <span className="font-semibold text-sunset-600 bg-sunset-50 px-2 py-0.5 rounded">50%</span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Less than 30 days</span>
                <span className="font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund calculation example */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Refund Calculation Example</h2>
          <p className="text-sm text-gray-600 mb-4">
            A guest books a $185/night RV for 7 nights with the <span className="font-medium">Moderate</span> cancellation policy and cancels 10 days before the trip start date.
          </p>
          <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Nightly Rate</span><span className="text-gray-900">$185 x 7 nights = $1,295</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service Fee (5%)</span><span className="text-gray-900">$64.75</span></div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between font-medium"><span className="text-gray-700">Total Charged</span><span className="text-gray-900">$1,359.75</span></div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between"><span className="text-gray-500">Cancellation (10 days = 50% of nightly)</span><span className="text-gray-900">$1,295 x 50% = $647.50</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service Fee (non-refundable)</span><span className="text-gray-400">$0.00</span></div>
            <div className="h-px bg-brand-200 my-1" />
            <div className="flex justify-between font-semibold text-brand-700"><span>Total Refund</span><span>$647.50</span></div>
          </div>
        </div>

        {/* Service fees note */}
        <div className="rounded-xl bg-sunset-50 border border-sunset-200 p-5 mb-12">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-sunset-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div className="text-sm">
              <p className="font-semibold text-sunset-900">Service fees are non-refundable</p>
              <p className="mt-1 text-sunset-700">
                The 5% guest service fee is non-refundable for all cancellation tiers and cancellation timeframes. The only exception is when the host cancels the booking.
              </p>
            </div>
          </div>
        </div>

        {/* Host cancellation */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <div className="flex gap-4">
            <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-forest-100 text-forest-600 items-center justify-center">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Host Cancellations</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                If a host cancels a confirmed booking, the guest always receives a <span className="font-semibold text-brand-700">100% full refund</span>, including all fees and service charges. Hosts who cancel confirmed bookings may face the following penalties:
              </p>
              <ul className="mt-3 text-sm text-gray-600 space-y-1.5 list-disc list-inside ml-2">
                <li>A cancellation fee deducted from future payouts</li>
                <li>Reduced visibility in search results</li>
                <li>A public cancellation mark on their profile visible to guests</li>
                <li>Account suspension for repeated cancellations</li>
              </ul>
            </div>
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

        {/* Back to terms link */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-6">
            <Link href="/legal/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              &larr; Terms of Service
            </Link>
            <Link href="/policies/insurance" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Insurance Coverage &rarr;
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

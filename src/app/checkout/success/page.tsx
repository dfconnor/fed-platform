'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockConfirmation = {
  bookingRef: 'RRV-2026-0322-7WK4',
  rv: {
    title: '2024 Thor Chateau 31W',
    type: 'Class C Motorhome',
    location: 'Denver, CO',
    image: '/images/rv-placeholder.jpg',
  },
  dates: {
    start: 'Saturday, March 22, 2026',
    end: 'Saturday, March 29, 2026',
    nights: 7,
    pickupTime: '10:00 AM',
    dropoffTime: '10:00 AM',
  },
  host: {
    name: 'Mike R.',
    initials: 'MR',
    phone: '(303) ***-**47',
    responseTime: 'Usually responds within 1 hour',
  },
  total: 1589.0,
  insurance: 'Standard ($250K coverage)',
  paymentMethod: 'Visa ending in 4242',
};

const nextSteps = [
  {
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Review & Sign Agreement',
    description: 'Your rental agreement is ready. Review the terms, vehicle policies, and sign electronically before your trip.',
    action: 'View Agreement',
    href: `/booking/${mockConfirmation.bookingRef}/agreement`,
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
    title: 'Pre-Trip Condition Report',
    description: 'Complete your departure condition report 24 hours before pickup. Document the vehicle state with photos to protect both parties.',
    action: 'Complete Report',
    href: `/booking/${mockConfirmation.bookingRef}/condition-report`,
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 2.632.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516c-2.95.1-5.669-.98-7.877-2.632zM15.53 9.53a.75.75 0 00-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Verify Your Identity',
    description: 'Complete identity verification to unlock instant booking and build trust with hosts. Takes about 2 minutes.',
    action: 'Get Verified',
    href: '/verify',
  },
];

export default function CheckoutSuccessPage() {
  const [copied, setCopied] = useState(false);

  function copyBookingRef() {
    navigator.clipboard.writeText(mockConfirmation.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-wide py-8 sm:py-12 max-w-3xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-brand-100 mb-6 animate-[bounceIn_0.6s_ease-out]">
            <svg className="h-10 w-10 text-brand-600 animate-[checkDraw_0.4s_ease-out_0.3s_both]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your RV adventure is booked. Get ready for an amazing trip!</p>
        </div>

        {/* Booking Reference */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">{mockConfirmation.bookingRef}</p>
            </div>
            <button
              onClick={copyBookingRef}
              className="btn-ghost gap-2"
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4 text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Trip Summary</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* RV Image placeholder */}
              <div className="w-full sm:w-48 h-32 rounded-xl bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                <svg className="h-12 w-12 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="22" height="12" rx="2" />
                  <path d="M6 18v2M18 18v2M1 12h22M6 6V4M14 6V4" />
                </svg>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{mockConfirmation.rv.title}</h3>
                  <p className="text-sm text-gray-500">{mockConfirmation.rv.type} &middot; {mockConfirmation.rv.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Pick-up</p>
                    <p className="text-sm font-medium text-gray-900">{mockConfirmation.dates.start}</p>
                    <p className="text-xs text-gray-500">{mockConfirmation.dates.pickupTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Drop-off</p>
                    <p className="text-sm font-medium text-gray-900">{mockConfirmation.dates.end}</p>
                    <p className="text-xs text-gray-500">{mockConfirmation.dates.dropoffTime}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Total Paid</p>
                    <p className="text-lg font-bold text-gray-900">${mockConfirmation.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Insurance</p>
                    <p className="text-sm font-medium text-gray-900">{mockConfirmation.insurance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium">Payment</p>
                    <p className="text-sm font-medium text-gray-900">{mockConfirmation.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Host</h2>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-semibold">
              {mockConfirmation.host.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{mockConfirmation.host.name}</p>
              <p className="text-sm text-gray-500">{mockConfirmation.host.phone}</p>
              <p className="text-xs text-gray-400">{mockConfirmation.host.responseTime}</p>
            </div>
            <Link href="/dashboard/messages" className="btn-primary !py-2.5 !px-5 gap-2">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" /><path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.942V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" /></svg>
              Message Host
            </Link>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">What&apos;s Next</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {nextSteps.map((step, i) => (
              <div key={i} className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                </div>
                <Link href={step.href} className="btn-ghost text-brand-600 shrink-0 !text-sm">
                  {step.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn-secondary flex-1 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
            Add to Calendar
          </button>
          <button className="btn-secondary flex-1 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
            Download Confirmation
          </button>
          <Link href="/dashboard/guest" className="btn-primary flex-1 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg>
            Go to Dashboard
          </Link>
        </div>

        {/* CSS Keyframes for animations */}
        <style jsx>{`
          @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.15); }
            70% { transform: scale(0.95); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes checkDraw {
            0% { stroke-dashoffset: 24; stroke-dasharray: 24; opacity: 0; }
            50% { opacity: 1; }
            100% { stroke-dashoffset: 0; stroke-dasharray: 24; opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

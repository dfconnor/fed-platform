'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  formatCents,
  DAMAGE_TYPE_LABELS,
  CLAIM_FILING_DEADLINE_DAYS,
  type ClaimStatus,
  type DamageType,
} from '@/types';
import DamageClaimForm from '@/components/DamageClaimForm';
import PolicyCard from '@/components/PolicyCard';
import ImageUploader from '@/components/ImageUploader';
import type { UploadedImage } from '@/lib/upload-types';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_BOOKING = {
  id: 'booking-201',
  ref: 'RRV-2026-0322-7WK4',
  listing: {
    id: '1',
    title: '2023 Thor Chateau 31W Class C Motorhome',
    rvType: 'Class C Motorhome',
    location: 'Denver, CO',
  },
  host: {
    id: 'host-1',
    name: 'Mike Rodriguez',
    initials: 'MR',
    email: 'mike@example.com',
  },
  guest: {
    id: 'guest-1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    email: 'sarah@example.com',
  },
  dates: {
    checkIn: '2026-03-22',
    checkOut: '2026-03-29',
    nights: 7,
  },
  status: 'COMPLETED' as const,
  securityDeposit: 150000,
  endDate: '2026-03-29T14:00:00Z',
};

const MOCK_DEPARTURE_REPORT = {
  type: 'DEPARTURE' as const,
  photos: [
    '/photos/dep-1.jpg',
    '/photos/dep-2.jpg',
    '/photos/dep-3.jpg',
    '/photos/dep-4.jpg',
    '/photos/dep-5.jpg',
    '/photos/dep-6.jpg',
  ],
  mileage: 45230,
  fuelLevel: 100,
  notes: 'Vehicle in excellent condition. Small scratch on rear bumper, right side.',
  createdAt: '2026-03-22T10:15:00Z',
};

const MOCK_RETURN_REPORT = {
  type: 'RETURN' as const,
  photos: [
    '/photos/ret-1.jpg',
    '/photos/ret-2.jpg',
    '/photos/ret-3.jpg',
    '/photos/ret-4.jpg',
    '/photos/ret-5.jpg',
    '/photos/ret-6.jpg',
    '/photos/ret-7.jpg',
    '/photos/ret-8.jpg',
  ],
  mileage: 45892,
  fuelLevel: 75,
  notes: 'Minor scuff on kitchen cabinet door. Interior clean otherwise.',
  createdAt: '2026-03-29T14:30:00Z',
};

// Mock existing claim (set to null to show the filing form)
const MOCK_EXISTING_CLAIM = null as null | {
  id: string;
  status: ClaimStatus;
  damageType: DamageType;
  description: string;
  photos: string[];
  requestedAmount: number;
  approvedAmount: number | null;
  renterResponse: string | null;
  renterResponseAt: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolutionNotes: string | null;
};

// ---------------------------------------------------------------------------
// Status badge config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ClaimStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      </svg>
    ),
  },
  SUBMITTED: {
    label: 'Submitted',
    color: 'bg-sky-100 text-sky-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-sunset-100 text-sunset-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-brand-100 text-brand-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  PARTIALLY_ACCEPTED: {
    label: 'Partially Accepted',
    color: 'bg-brand-100 text-brand-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  APPEALED: {
    label: 'Appealed',
    color: 'bg-sunset-100 text-sunset-700',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'bg-gray-100 text-gray-600',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

// ---------------------------------------------------------------------------
// Claim Status Tracker
// ---------------------------------------------------------------------------

function ClaimStatusTracker({
  status,
  createdAt,
  renterResponseAt,
  resolvedAt,
}: {
  status: ClaimStatus;
  createdAt: string;
  renterResponseAt: string | null;
  resolvedAt: string | null;
}) {
  const steps = [
    {
      label: 'Claim Filed',
      date: createdAt,
      done: true,
    },
    {
      label: 'Guest Notified',
      date: createdAt, // notified immediately
      done: true,
    },
    {
      label: 'Guest Response',
      date: renterResponseAt,
      done: !!renterResponseAt,
    },
    {
      label: 'Review',
      date: resolvedAt,
      done: [
        'ACCEPTED',
        'PARTIALLY_ACCEPTED',
        'REJECTED',
        'RESOLVED',
      ].includes(status),
    },
    {
      label: 'Resolved',
      date: resolvedAt,
      done: status === 'RESOLVED',
    },
  ];

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Claim Progress
      </h3>
      <div className="relative">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3 pb-6 last:pb-0">
            {/* Connector line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-3 h-3 rounded-full border-2 flex-shrink-0',
                  step.done
                    ? 'bg-brand-500 border-brand-500'
                    : 'bg-white border-gray-300'
                )}
              />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 mt-1',
                    step.done ? 'bg-brand-300' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
            {/* Step details */}
            <div className="flex-1 min-w-0 -mt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  step.done ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {step.label}
              </p>
              {step.date && step.done && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(step.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guest Response Form
// ---------------------------------------------------------------------------

function GuestResponseForm({
  claimId,
  onSubmit,
}: {
  claimId: string;
  onSubmit: (response: any) => void;
}) {
  const [responseText, setResponseText] = useState('');
  const [photos, setPhotos] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = responseText.length >= 10 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/damage-claims/${claimId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: responseText.trim(),
          photos: photos.map((p) => p.url),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(data.error || 'Failed to submit response');
      }

      const data = await res.json();
      onSubmit(data.claim);
    } catch (error) {
      console.error('Response submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Response
        </label>
        <textarea
          className="input-field min-h-[120px] resize-y"
          placeholder="Explain your perspective on this claim..."
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          maxLength={3000}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {responseText.length}/3,000
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Counter-Evidence Photos (optional)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload any photos that support your response.
        </p>
        <ImageUploader
          onUpload={setPhotos}
          category="damage_claim"
          maxFiles={5}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'btn-primary px-6 py-2.5',
            !canSubmit && 'opacity-50 cursor-not-allowed'
          )}
        >
          {submitting ? 'Submitting...' : 'Submit Response'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function DamageClaimPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const booking = MOCK_BOOKING;

  // Simulate role — in production this comes from session
  const [viewRole, setViewRole] = useState<'host' | 'guest'>('host');
  const [claim, setClaim] = useState(MOCK_EXISTING_CLAIM);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Calculate filing deadline
  const tripEnd = new Date(booking.endDate);
  const deadline = new Date(tripEnd);
  deadline.setDate(deadline.getDate() + CLAIM_FILING_DEADLINE_DAYS);
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="container-wide py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/dashboard/host"
          className="hover:text-brand-600 transition-colors"
        >
          Dashboard
        </Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          href={`/booking/${bookingId}`}
          className="hover:text-brand-600 transition-colors"
        >
          Booking {booking.ref}
        </Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">Damage Claim</span>
      </nav>

      {/* Role Switcher (demo only) */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs text-gray-400">Demo view:</span>
        <button
          onClick={() => setViewRole('host')}
          className={cn(
            'text-xs px-3 py-1 rounded-full transition-colors',
            viewRole === 'host'
              ? 'bg-brand-100 text-brand-700 font-semibold'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          Host View
        </button>
        <button
          onClick={() => setViewRole('guest')}
          className={cn(
            'text-xs px-3 py-1 rounded-full transition-colors',
            viewRole === 'guest'
              ? 'bg-brand-100 text-brand-700 font-semibold'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          Guest View
        </button>
      </div>

      {/* Booking Summary Card */}
      <div className="card p-4 sm:p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-24 rounded-xl bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {claim || claimSubmitted ? 'Damage Claim' : 'File a Damage Claim'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {booking.listing.title}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span>
                {new Date(booking.dates.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' - '}
                {new Date(booking.dates.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>{booking.dates.nights} nights</span>
              <span className="font-mono text-brand-600 text-xs">{booking.ref}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-400">Security Deposit</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCents(booking.securityDeposit)}
              </p>
            </div>
            {!claim && !claimSubmitted && daysRemaining > 0 && (
              <span className="badge bg-sunset-100 text-sunset-700 text-xs">
                {daysRemaining} days to file
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* HOST VIEW: Filing a claim */}
      {/* ================================================================= */}
      {viewRole === 'host' && !claim && !claimSubmitted && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Condition Report Comparison */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Condition Report Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departure */}
                <div className="rounded-xl border border-brand-200 bg-brand-50/30 p-4">
                  <h3 className="text-sm font-semibold text-brand-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Departure
                  </h3>
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
                    {MOCK_DEPARTURE_REPORT.photos.slice(0, 4).map((_, i) => (
                      <div key={i} className="w-14 h-10 rounded bg-gradient-to-br from-forest-200 to-forest-300 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[8px] text-forest-700">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Mileage</span>
                      <span className="font-medium">{MOCK_DEPARTURE_REPORT.mileage?.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel</span>
                      <span className="font-medium">{MOCK_DEPARTURE_REPORT.fuelLevel}%</span>
                    </div>
                  </div>
                </div>

                {/* Return */}
                <div className="rounded-xl border border-sunset-200 bg-sunset-50/30 p-4">
                  <h3 className="text-sm font-semibold text-sunset-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Return
                  </h3>
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
                    {MOCK_RETURN_REPORT.photos.slice(0, 4).map((_, i) => (
                      <div key={i} className="w-14 h-10 rounded bg-gradient-to-br from-sunset-200 to-sunset-300 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[8px] text-sunset-700">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Mileage</span>
                      <span className="font-medium">{MOCK_RETURN_REPORT.mileage?.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel</span>
                      <span className="font-medium">{MOCK_RETURN_REPORT.fuelLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip delta */}
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
                <span>
                  Miles driven:{' '}
                  <strong className="text-gray-700">
                    {(MOCK_RETURN_REPORT.mileage - MOCK_DEPARTURE_REPORT.mileage).toLocaleString()}
                  </strong>
                </span>
                <span>
                  Fuel change:{' '}
                  <strong className={cn('', MOCK_RETURN_REPORT.fuelLevel < MOCK_DEPARTURE_REPORT.fuelLevel ? 'text-red-600' : 'text-brand-600')}>
                    {MOCK_RETURN_REPORT.fuelLevel - MOCK_DEPARTURE_REPORT.fuelLevel}%
                  </strong>
                </span>
              </div>
            </section>

            {/* Claim Form */}
            <DamageClaimForm
              bookingId={bookingId}
              securityDepositAmount={booking.securityDeposit}
              departureReport={MOCK_DEPARTURE_REPORT}
              returnReport={MOCK_RETURN_REPORT}
              onSubmit={(newClaim) => {
                setClaimSubmitted(true);
                setClaim({
                  id: 'claim-new',
                  status: 'SUBMITTED',
                  damageType: newClaim.damageType,
                  description: newClaim.description,
                  photos: newClaim.photos || [],
                  requestedAmount: newClaim.requestedAmount,
                  approvedAmount: null,
                  renterResponse: null,
                  renterResponseAt: null,
                  createdAt: new Date().toISOString(),
                  resolvedAt: null,
                  resolutionNotes: null,
                });
              }}
            />
          </div>

          {/* Right: Sidebar */}
          <div className="lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Filing deadline */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Filing Deadline
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        daysRemaining <= 2
                          ? 'bg-red-500'
                          : daysRemaining <= 4
                            ? 'bg-sunset-500'
                            : 'bg-brand-500'
                      )}
                      style={{
                        width: `${Math.max(5, ((CLAIM_FILING_DEADLINE_DAYS - daysRemaining) / CLAIM_FILING_DEADLINE_DAYS) * 100)}%`,
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      daysRemaining <= 2 ? 'text-red-600' : 'text-gray-900'
                    )}
                  >
                    {daysRemaining}d
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Claims must be filed within {CLAIM_FILING_DEADLINE_DAYS} days of
                  trip end. Deadline:{' '}
                  {deadline.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Policies */}
              <PolicyCard
                title="Damage Claim Process"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                }
                summary="How damage claims are reviewed and resolved"
                variant="info"
                details={
                  <ol className="space-y-2 list-decimal list-inside text-xs text-gray-600">
                    <li>Host files claim with photos and description</li>
                    <li>Guest is notified and has 3 days to respond</li>
                    <li>Rival RV team reviews evidence from both parties</li>
                    <li>Decision is made: accepted, partially accepted, or rejected</li>
                    <li>If accepted, the approved amount is captured from the security deposit</li>
                    <li>Either party may appeal within 5 days of the decision</li>
                  </ol>
                }
              />

              <PolicyCard
                title="What Can Be Claimed"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                summary="Eligible damage categories and limits"
                variant="success"
                details={
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Physical damage to exterior or interior
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Mechanical damage caused by misuse
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Excessive cleaning beyond normal wear
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Maximum claim: security deposit amount
                    </li>
                  </ul>
                }
              />

              {/* Guest info */}
              <div className="card p-4">
                <h4 className="text-xs text-gray-400 uppercase font-medium mb-2">
                  Renter
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs flex-shrink-0">
                    {booking.guest.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.guest.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.guest.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* HOST VIEW: After claim submitted — status tracker */}
      {/* ================================================================= */}
      {viewRole === 'host' && claim && (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0 space-y-6">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'badge flex items-center gap-1.5',
                  STATUS_CONFIG[claim.status].color
                )}
              >
                {STATUS_CONFIG[claim.status].icon}
                {STATUS_CONFIG[claim.status].label}
              </span>
              <span className="text-xs text-gray-400">
                Filed{' '}
                {new Date(claim.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Claim details */}
            <div className="card p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Damage Type
                </h3>
                <span className="badge bg-gray-100 text-gray-700">
                  {DAMAGE_TYPE_LABELS[claim.damageType]}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Description
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {claim.description}
                </p>
              </div>

              {claim.photos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Evidence Photos
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {claim.photos.map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center"
                      >
                        <span className="text-[10px] text-red-600 font-medium">
                          Evidence {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Requested Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCents(claim.requestedAmount)}
                </span>
              </div>

              {claim.approvedAmount != null && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Approved Amount
                  </span>
                  <span className="text-lg font-bold text-brand-600">
                    {formatCents(claim.approvedAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Guest response section */}
            {claim.renterResponse && (
              <div className="card p-5 border-sky-200 bg-sky-50/30">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-[9px] font-bold flex-shrink-0">
                    {booking.guest.initials}
                  </div>
                  Guest Response
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {claim.renterResponse}
                </p>
                {claim.renterResponseAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Responded{' '}
                    {new Date(claim.renterResponseAt).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Resolution notes */}
            {claim.resolutionNotes && (
              <div className="card p-5 border-gray-300">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Resolution Notes
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {claim.resolutionNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar: Status tracker */}
          <div className="lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <ClaimStatusTracker
                status={claim.status}
                createdAt={claim.createdAt}
                renterResponseAt={claim.renterResponseAt}
                resolvedAt={claim.resolvedAt}
              />

              <div className="card p-4">
                <h4 className="text-xs text-gray-400 uppercase font-medium mb-2">
                  Renter
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs flex-shrink-0">
                    {booking.guest.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.guest.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.guest.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GUEST VIEW: Responding to a claim */}
      {/* ================================================================= */}
      {viewRole === 'guest' && (
        <div className="space-y-8">
          {/* No claim filed yet */}
          {!claim && !claimSubmitted && (
            <div className="card p-8 text-center">
              <svg
                className="w-16 h-16 text-brand-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">
                No Damage Claim Filed
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                The host has not filed any damage claims for this booking. Your
                security deposit of {formatCents(booking.securityDeposit)} will
                be automatically released within 3 days of trip completion.
              </p>
              {daysRemaining > 0 && (
                <p className="text-xs text-gray-400 mt-3">
                  Filing window closes in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Claim exists — show details and response form */}
          {claim && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1 min-w-0 space-y-6">
                {/* Alert banner */}
                <div className="rounded-xl border border-sunset-200 bg-sunset-50 p-4 flex gap-3">
                  <svg className="w-5 h-5 text-sunset-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-sunset-800">
                      A damage claim has been filed against your booking
                    </p>
                    <p className="text-xs text-sunset-700 mt-1">
                      You have 3 days to respond. Your response will be reviewed
                      alongside the host&apos;s evidence.
                    </p>
                  </div>
                </div>

                {/* Claim details */}
                <div className="card p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Claim Details
                    </h2>
                    <span
                      className={cn(
                        'badge flex items-center gap-1.5',
                        STATUS_CONFIG[claim.status].color
                      )}
                    >
                      {STATUS_CONFIG[claim.status].icon}
                      {STATUS_CONFIG[claim.status].label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Damage Type
                    </h3>
                    <span className="badge bg-gray-100 text-gray-700">
                      {DAMAGE_TYPE_LABELS[claim.damageType]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {claim.description}
                    </p>
                  </div>

                  {claim.photos.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Host&apos;s Evidence Photos
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {claim.photos.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-[4/3] rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center"
                          >
                            <span className="text-[10px] text-red-600 font-medium">
                              Photo {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Amount Requested
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCents(claim.requestedAmount)}
                    </span>
                  </div>
                </div>

                {/* Response form */}
                {!claim.renterResponse &&
                  ['SUBMITTED', 'UNDER_REVIEW'].includes(claim.status) && (
                    <div className="card p-5 sm:p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Response
                      </h2>
                      <GuestResponseForm
                        claimId={claim.id}
                        onSubmit={(updated) => {
                          setClaim({
                            ...claim,
                            renterResponse: updated.renterResponse,
                            renterResponseAt: updated.renterResponseAt,
                            status: updated.status,
                          });
                        }}
                      />
                    </div>
                  )}

                {/* Already responded */}
                {claim.renterResponse && (
                  <div className="card p-5 border-brand-200 bg-brand-50/30">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your Response (Submitted)
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {claim.renterResponse}
                    </p>
                  </div>
                )}
              </div>

              {/* Right sidebar: Status + host info */}
              <div className="lg:w-[340px] flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <ClaimStatusTracker
                    status={claim.status}
                    createdAt={claim.createdAt}
                    renterResponseAt={claim.renterResponseAt}
                    resolvedAt={claim.resolvedAt}
                  />

                  <div className="card p-4">
                    <h4 className="text-xs text-gray-400 uppercase font-medium mb-2">
                      Host
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-xs flex-shrink-0">
                        {booking.host.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.host.name}
                        </p>
                        <p className="text-xs text-gray-500">Host</p>
                      </div>
                    </div>
                  </div>

                  <PolicyCard
                    title="Your Rights as a Renter"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    }
                    summary="Understand the claim process and your protections"
                    variant="info"
                    details={
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>You have 3 days to respond to any damage claim.</li>
                        <li>You can upload counter-evidence with your response.</li>
                        <li>All claims are independently reviewed by Rival RV.</li>
                        <li>Normal wear and tear is not claimable.</li>
                        <li>You may appeal any decision within 5 days.</li>
                        <li>Your deposit is only captured after a reviewed decision.</li>
                      </ul>
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

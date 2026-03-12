'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatCents } from '@/types';
import ConditionReportForm from '@/components/ConditionReportForm';
import PolicyCard from '@/components/PolicyCard';

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
    imageUrl: '/placeholder-rv-main.jpg',
  },
  host: {
    name: 'Mike Rodriguez',
    initials: 'MR',
  },
  guest: {
    name: 'Sarah Johnson',
    initials: 'SJ',
  },
  dates: {
    checkIn: '2026-03-22',
    checkOut: '2026-03-29',
    nights: 7,
  },
  status: 'COMPLETED' as const, // Change to test different states
  securityDeposit: 150000,
};

// Mock departure report (set to null to test "no departure report" state)
const MOCK_DEPARTURE_REPORT = {
  id: 'cr-dep-1',
  type: 'DEPARTURE' as const,
  photos: [
    '/photos/departure-front.jpg',
    '/photos/departure-rear.jpg',
    '/photos/departure-driver.jpg',
    '/photos/departure-passenger.jpg',
    '/photos/departure-dashboard.jpg',
    '/photos/departure-living.jpg',
    '/photos/departure-kitchen.jpg',
    '/photos/departure-bedroom.jpg',
  ],
  mileage: 45230,
  fuelLevel: 100,
  notes:
    'Vehicle in excellent condition at pickup. Small existing scratch on rear bumper, right side — approximately 3 inches. All systems operational.',
  reportedBy: 'guest-1',
  reportedByName: 'Sarah Johnson',
  createdAt: '2026-03-22T10:15:00Z',
};

// Mock return report (set to null to test "no return report" state)
const MOCK_RETURN_REPORT = {
  id: 'cr-ret-1',
  type: 'RETURN' as const,
  photos: [
    '/photos/return-front.jpg',
    '/photos/return-rear.jpg',
    '/photos/return-driver.jpg',
    '/photos/return-passenger.jpg',
    '/photos/return-dashboard.jpg',
    '/photos/return-living.jpg',
    '/photos/return-kitchen.jpg',
    '/photos/return-bedroom.jpg',
    '/photos/return-damage-1.jpg',
    '/photos/return-damage-2.jpg',
  ],
  mileage: 45892,
  fuelLevel: 75,
  notes:
    'Vehicle returned in good condition overall. Existing scratch on rear bumper unchanged. Minor scuff on kitchen cabinet door, left side — appears to have happened during trip. Interior clean.',
  reportedBy: 'guest-1',
  reportedByName: 'Sarah Johnson',
  createdAt: '2026-03-29T14:30:00Z',
};

// ---------------------------------------------------------------------------
// Fuel gauge display
// ---------------------------------------------------------------------------

function FuelGaugeDisplay({
  level,
  label,
}: {
  level: number | null;
  label: string;
}) {
  if (level === null) return null;
  const fillPct = Math.max(level, 5);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="relative w-10 h-16 rounded-lg border-2 border-gray-300 bg-gray-100 overflow-hidden">
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 rounded-b transition-all',
            level === 0
              ? 'bg-red-400'
              : level < 25
                ? 'bg-sunset-400'
                : 'bg-brand-400'
          )}
          style={{ height: `${fillPct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-900">{level}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Report Card (used in comparison view)
// ---------------------------------------------------------------------------

function ReportCard({
  report,
  type,
}: {
  report: { id: string; type: string; photos: string[]; mileage: number; fuelLevel: number; notes: string; reportedBy: string; reportedByName: string; createdAt: string };
  type: 'departure' | 'return';
}) {
  const colors =
    type === 'departure'
      ? { bg: 'bg-brand-50', border: 'border-brand-200', text: 'text-brand-700', photoBg: 'from-forest-200 to-forest-300', photoText: 'text-forest-700' }
      : { bg: 'bg-sunset-50', border: 'border-sunset-200', text: 'text-sunset-700', photoBg: 'from-sunset-200 to-sunset-300', photoText: 'text-sunset-700' };

  return (
    <div className="space-y-4">
      <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold', colors.bg, colors.text)}>
        {type === 'departure' ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        )}
        {type === 'departure' ? 'Departure' : 'Return'} Report
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {report.photos.map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg overflow-hidden"
          >
            <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', colors.photoBg)}>
              <span className={cn('text-[10px] font-medium', colors.photoText)}>
                Photo {i + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">Odometer</span>
          <span className="text-sm font-semibold text-gray-900">
            {report.mileage?.toLocaleString() ?? 'N/A'} mi
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">Fuel Level</span>
          <FuelGaugeDisplay level={report.fuelLevel} label="" />
        </div>
        <div className="py-2">
          <span className="text-sm text-gray-500 block mb-1">Notes</span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {report.notes}
          </p>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-100 text-xs text-gray-400">
          <span>Reported by {report.reportedByName}</span>
          <span>
            {new Date(report.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ConditionReportPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const booking = MOCK_BOOKING;

  // Determine the view state
  // For demo purposes, show both reports to display the comparison view.
  // Set these to null to test the form views.
  const [departureReport, setDepartureReport] = useState<
    typeof MOCK_DEPARTURE_REPORT | null
  >(MOCK_DEPARTURE_REPORT);
  const [returnReport, setReturnReport] = useState<
    typeof MOCK_RETURN_REPORT | null
  >(MOCK_RETURN_REPORT);

  const hasBothReports = departureReport !== null && returnReport !== null;
  const needsDepartureReport = departureReport === null;
  const needsReturnReport =
    departureReport !== null && returnReport === null;

  // Trip stats for comparison
  const milesDriven =
    departureReport?.mileage != null && returnReport?.mileage != null
      ? returnReport.mileage - departureReport.mileage
      : null;

  const fuelDiff =
    departureReport?.fuelLevel != null && returnReport?.fuelLevel != null
      ? returnReport.fuelLevel - departureReport.fuelLevel
      : null;

  return (
    <div className="container-wide py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/dashboard/guest/trips"
          className="hover:text-brand-600 transition-colors"
        >
          My Trips
        </Link>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <Link
          href={`/booking/${bookingId}`}
          className="hover:text-brand-600 transition-colors"
        >
          Booking {booking.ref}
        </Link>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 font-medium">Condition Report</span>
      </nav>

      {/* Booking Summary Header */}
      <div className="card p-4 sm:p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-24 rounded-xl bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-10 h-10 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Condition Report
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {booking.listing.title}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span>
                {new Date(booking.dates.checkIn + 'T00:00:00').toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                )}{' '}
                -{' '}
                {new Date(booking.dates.checkOut + 'T00:00:00').toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' }
                )}
              </span>
              <span>{booking.dates.nights} nights</span>
              <span>{booking.listing.location}</span>
              <span className="font-mono text-brand-600 text-xs">
                {booking.ref}
              </span>
            </div>
          </div>
          {/* Report completion badges */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
            <span
              className={cn(
                'badge text-xs',
                departureReport
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              {departureReport ? 'Departure Filed' : 'Departure Pending'}
            </span>
            <span
              className={cn(
                'badge text-xs',
                returnReport
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              {returnReport ? 'Return Filed' : 'Return Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* View: Both reports exist — show side-by-side comparison */}
      {/* ------------------------------------------------------------------- */}
      {hasBothReports && (
        <div className="space-y-8">
          {/* Trip Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-medium">
                Miles Driven
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {milesDriven?.toLocaleString() ?? 'N/A'}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-medium">
                Fuel Change
              </p>
              <p
                className={cn(
                  'text-2xl font-bold mt-1',
                  fuelDiff !== null && fuelDiff < 0
                    ? 'text-red-600'
                    : 'text-brand-600'
                )}
              >
                {fuelDiff !== null
                  ? `${fuelDiff > 0 ? '+' : ''}${fuelDiff}%`
                  : 'N/A'}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-medium">
                Trip Duration
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {booking.dates.nights} days
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-medium">
                Deposit
              </p>
              <p className="text-2xl font-bold text-brand-600 mt-1">
                {formatCents(booking.securityDeposit)}
              </p>
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="card p-5 sm:p-6">
              <ReportCard
                report={departureReport}
                type="departure"
              />
            </div>
            <div className="card p-5 sm:p-6">
              <ReportCard report={returnReport} type="return" />
            </div>
          </div>

          {/* Fuel comparison visual */}
          {departureReport.fuelLevel != null &&
            returnReport.fuelLevel != null && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Fuel Level Comparison
                </h3>
                <div className="flex items-end justify-center gap-12">
                  <FuelGaugeDisplay
                    level={departureReport.fuelLevel}
                    label="Departure"
                  />
                  <div className="flex flex-col items-center pb-6">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                    <span
                      className={cn(
                        'text-xs font-semibold mt-1',
                        fuelDiff !== null && fuelDiff < 0
                          ? 'text-red-500'
                          : 'text-brand-600'
                      )}
                    >
                      {fuelDiff !== null && fuelDiff < 0 ? '' : '+'}
                      {fuelDiff}%
                    </span>
                  </div>
                  <FuelGaugeDisplay
                    level={returnReport.fuelLevel}
                    label="Return"
                  />
                </div>
              </div>
            )}

          {/* Policy card */}
          <PolicyCard
            title="Security Deposit Policy"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            }
            summary={`${formatCents(booking.securityDeposit)} security deposit will be automatically released within 3 days if no claim is filed.`}
            variant="success"
            details={
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Deposits are held as an authorization only, not charged.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Auto-released 3 days after trip completion if no claim is filed.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Hosts have 7 days after trip end to file a damage claim.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Condition reports serve as evidence for both parties.
                </li>
              </ul>
            }
          />
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* View: Needs departure report — show form */}
      {/* ------------------------------------------------------------------- */}
      {needsDepartureReport && (
        <div className="space-y-6">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex gap-3">
            <svg
              className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-sky-800">
                Time to document the vehicle before departure
              </p>
              <p className="text-xs text-sky-700 mt-1">
                Take photos and record the condition of the RV before your trip
                begins. This protects both you and the host.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Departure Condition Report
          </h2>

          <ConditionReportForm
            bookingId={bookingId}
            type="DEPARTURE"
            onSubmit={(report) => {
              setDepartureReport({
                ...report,
                reportedByName: booking.guest.name,
              });
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* View: Needs return report — show form */}
      {/* ------------------------------------------------------------------- */}
      {needsReturnReport && (
        <div className="space-y-6">
          <div className="rounded-xl border border-sunset-200 bg-sunset-50 p-4 flex gap-3">
            <svg
              className="w-5 h-5 text-sunset-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-sunset-800">
                Document the vehicle condition before returning
              </p>
              <p className="text-xs text-sunset-700 mt-1">
                Record any changes from the departure report. This protects you
                if any claims are filed after the trip.
              </p>
            </div>
          </div>

          {/* Show departure report summary for reference */}
          {departureReport && (
            <div className="card p-4 border-brand-200 bg-brand-50/30">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Departure Report on File
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  {departureReport.photos.length} photos
                </span>
                <span>
                  {departureReport.mileage?.toLocaleString()} mi
                </span>
                <span>Fuel: {departureReport.fuelLevel}%</span>
                <span>
                  Filed{' '}
                  {new Date(departureReport.createdAt).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric' }
                  )}
                </span>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900">
            Return Condition Report
          </h2>

          <ConditionReportForm
            bookingId={bookingId}
            type="RETURN"
            onSubmit={(report) => {
              setReturnReport({
                ...report,
                reportedByName: booking.guest.name,
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

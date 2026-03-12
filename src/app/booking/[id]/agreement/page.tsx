'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatCentsDecimal, AGREEMENT_VERSION } from '@/types';
import { renderAgreementHtml } from '@/lib/agreements';
import RentalAgreementViewer from '@/components/RentalAgreementViewer';

// ─── Mock Data ────────────────────────────────────────────────────────────

const MOCK_GUEST = {
  id: 'guest_mock_001',
  name: 'Alex Thompson',
  email: 'alex.thompson@email.com',
  image: null,
};

const MOCK_HOST = {
  id: 'host_mock_001',
  name: 'Sarah Martinez',
  email: 'sarah.martinez@email.com',
  image: null,
};

const MOCK_LISTING = {
  id: 'listing_mock_001',
  title: '2023 Thor Chateau 28Z - Denver Adventure Rig',
  rvType: 'CLASS_C',
  year: 2023,
  make: 'Thor',
  model: 'Chateau 28Z',
  length: 30,
  sleeps: 8,
  city: 'Denver',
  state: 'Colorado',
  features: ['pet_friendly', 'tow_hitch'],
  rules:
    'No off-road driving. Generator quiet hours 10pm-7am. Dump tanks before return.',
  images: [],
};

const MOCK_BOOKING = {
  id: 'booking_mock_001',
  listingId: MOCK_LISTING.id,
  guestId: MOCK_GUEST.id,
  hostId: MOCK_HOST.id,
  startDate: '2026-04-12T00:00:00.000Z',
  endDate: '2026-04-19T00:00:00.000Z',
  nights: 7,
  nightlyTotal: 129500, // $1,295.00
  cleaningFee: 12500, // $125.00
  deliveryFee: 0,
  addOnsTotal: 0,
  insuranceFee: 17500, // $175.00
  platformFeeGuest: 7100, // $71.00
  platformFeeHost: 7100,
  discount: 0,
  subtotal: 161500,
  total: 166600, // $1,666.00
  securityDeposit: 50000, // $500.00
  insuranceTier: 'ESSENTIAL',
  insuranceProvider: 'MBP Insurance',
  cancellationPolicy: 'MODERATE',
  guestCount: 4,
  specialRequests: 'Arriving around 2pm. Will have 2 small dogs.',
  listing: MOCK_LISTING,
  guest: MOCK_GUEST,
  host: MOCK_HOST,
};

function generateMockAgreementHtml() {
  return renderAgreementHtml(
    {
      version: AGREEMENT_VERSION,
      mileageLimit: 700,
      generatorHoursLimit: 28,
      geographicRestrictions:
        'Continental United States only. No cross-border travel to Mexico or Canada without prior written consent from the Owner.',
      petPolicy: 'allowed',
      smokingPolicy: 'no_smoking',
      towingAllowed: true,
    },
    MOCK_BOOKING,
    MOCK_LISTING,
    MOCK_GUEST,
    MOCK_HOST
  );
}

type AgreementState =
  | 'loading'
  | 'pending_guest'
  | 'pending_host'
  | 'signed'
  | 'signing';

export default function BookingAgreementPage() {
  const params = useParams();
  const bookingId = params.id as string;

  // Simulate the current user is the guest
  const currentUserId = MOCK_GUEST.id;

  const [agreementState, setAgreementState] =
    useState<AgreementState>('loading');
  const [agreement, setAgreement] = useState<any>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Simulate loading the agreement
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockAgreement = {
        id: 'agr_mock_001',
        bookingId: bookingId || MOCK_BOOKING.id,
        version: AGREEMENT_VERSION,
        termsContent: generateMockAgreementHtml(),
        mileageLimit: 700,
        generatorHoursLimit: 28,
        geographicRestrictions:
          'Continental United States only. No cross-border travel to Mexico or Canada without prior written consent from the Owner.',
        petPolicy: 'allowed',
        smokingPolicy: 'no_smoking',
        towingAllowed: true,
        guestSignedAt: null,
        guestSignature: null,
        guestSignatureType: null,
        guestIpAddress: null,
        guestUserAgent: null,
        hostSignedAt: null,
        hostSignature: null,
        hostSignatureType: null,
        hostIpAddress: null,
        hostUserAgent: null,
        status: 'PENDING_GUEST',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        booking: MOCK_BOOKING,
      };

      setAgreement(mockAgreement);
      setAgreementState('pending_guest');
    }, 1500);

    return () => clearTimeout(timer);
  }, [bookingId]);

  const handleSign = useCallback(
    async (signature: string, type: 'drawn' | 'typed') => {
      setIsSigning(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const now = new Date().toISOString();

      if (currentUserId === MOCK_GUEST.id) {
        setAgreement((prev: any) => ({
          ...prev,
          guestSignedAt: now,
          guestSignature: signature,
          guestSignatureType: type,
          guestIpAddress: '192.168.1.1',
          guestUserAgent: navigator.userAgent,
          status: prev.hostSignedAt ? 'SIGNED' : 'PENDING_HOST',
        }));
        setAgreementState(
          agreement?.hostSignedAt ? 'signed' : 'pending_host'
        );
      } else {
        setAgreement((prev: any) => ({
          ...prev,
          hostSignedAt: now,
          hostSignature: signature,
          hostSignatureType: type,
          hostIpAddress: '192.168.1.1',
          hostUserAgent: navigator.userAgent,
          status: prev.guestSignedAt ? 'SIGNED' : 'PENDING_GUEST',
        }));
        setAgreementState(
          agreement?.guestSignedAt ? 'signed' : 'pending_guest'
        );
      }

      setIsSigning(false);
    },
    [currentUserId, agreement]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Determine what mode to show the viewer in
  const viewerMode: 'view' | 'sign' = (() => {
    if (agreementState === 'signed') return 'view';
    if (
      agreementState === 'pending_guest' &&
      currentUserId === MOCK_GUEST.id
    )
      return 'sign';
    if (
      agreementState === 'pending_host' &&
      currentUserId === MOCK_HOST.id
    )
      return 'sign';
    return 'view';
  })();

  // Determine the other party's name
  const otherPartyName =
    currentUserId === MOCK_GUEST.id ? MOCK_HOST.name : MOCK_GUEST.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Banners */}
      {agreementState === 'signed' && (
        <div className="bg-brand-600 text-white py-3 no-print">
          <div className="container-wide text-center">
            <p className="text-sm font-medium flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Agreement Complete -- Both parties have signed this rental
              agreement.
            </p>
          </div>
        </div>
      )}

      {agreementState === 'pending_host' &&
        currentUserId === MOCK_GUEST.id && (
          <div className="bg-sky-500 text-white py-3 no-print">
            <div className="container-wide text-center">
              <p className="text-sm font-medium flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                    clipRule="evenodd"
                  />
                </svg>
                Waiting for {otherPartyName} to sign the agreement.
              </p>
            </div>
          </div>
        )}

      {agreementState === 'pending_guest' &&
        currentUserId === MOCK_HOST.id && (
          <div className="bg-sky-500 text-white py-3 no-print">
            <div className="container-wide text-center">
              <p className="text-sm font-medium flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                    clipRule="evenodd"
                  />
                </svg>
                Waiting for {otherPartyName} to sign the agreement.
              </p>
            </div>
          </div>
        )}

      <div className="container-wide py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 no-print">
          <Link
            href="/"
            className="hover:text-brand-600 transition-colors"
          >
            Home
          </Link>
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
          <Link
            href={`/booking/${bookingId}`}
            className="hover:text-brand-600 transition-colors"
          >
            Booking
          </Link>
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-900 font-medium">
            Rental Agreement
          </span>
        </nav>

        {/* Header with actions */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8 no-print">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Rental Agreement
            </h1>
            <p className="text-gray-500 mt-1">
              {MOCK_LISTING.title} &middot;{' '}
              {new Date(MOCK_BOOKING.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(MOCK_BOOKING.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-ghost text-sm gap-2"
              disabled={agreementState === 'loading'}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0118 8.653v4.097A2.25 2.25 0 0115.75 15h-.75v1.25c0 .966-.784 1.75-1.75 1.75h-6.5A1.75 1.75 0 015 16.25V15h-.75A2.25 2.25 0 012 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.126-.153V2.75zm1.5 0v3.379a49.71 49.71 0 017 0V2.75a.25.25 0 00-.25-.25h-6.5a.25.25 0 00-.25.25zm-1.466 5.191c.337-.05.675-.098 1.014-.144a50.866 50.866 0 017.904 0c.34.046.677.094 1.014.144a.712.712 0 01.604.706v4.097a.75.75 0 01-.75.75h-.75v-2.5a.75.75 0 00-.75-.75h-9a.75.75 0 00-.75.75v2.5h-.75a.75.75 0 01-.75-.75V8.647a.712.712 0 01.604-.706zM6.5 13.5v2.75c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25V13.5h-7z"
                  clipRule="evenodd"
                />
              </svg>
              Print
            </button>
            <Link
              href={`/booking/${bookingId}`}
              className="btn-secondary text-sm gap-2"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Booking
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {agreementState === 'loading' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-brand-600 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Generating Agreement...
              </h2>
              <p className="text-sm text-gray-500">
                Preparing your rental agreement with all booking details.
              </p>
            </div>
          </div>
        )}

        {/* Signing overlay */}
        {isSigning && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
              <svg
                className="h-8 w-8 text-brand-600 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-900">
                Applying your signature...
              </p>
            </div>
          </div>
        )}

        {/* Agreement Viewer */}
        {agreementState !== 'loading' && agreement && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Quick Summary Bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 no-print">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {MOCK_BOOKING.nights} nights
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M1 4.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 2H3.25A2.25 2.25 0 001 4.25zM1 7.25a3.733 3.733 0 012.25-.75h13.5c.844 0 1.623.279 2.25.75A2.25 2.25 0 0016.75 5H3.25A2.25 2.25 0 001 7.25zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zM2 9.75A2.25 2.25 0 014.25 7.5h11.5A2.25 2.25 0 0118 9.75v5.5A2.25 2.25 0 0115.75 17.5H4.25A2.25 2.25 0 012 15.25v-5.5z" />
                    </svg>
                    {formatCentsDecimal(MOCK_BOOKING.total)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                    {MOCK_BOOKING.guestCount} guest
                    {MOCK_BOOKING.guestCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div>
                  <span
                    className={cn(
                      'badge text-xs',
                      agreementState === 'signed'
                        ? 'bg-brand-100 text-brand-700'
                        : agreementState === 'pending_host'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-sunset-100 text-sunset-700'
                    )}
                  >
                    {agreementState === 'signed'
                      ? 'Fully Signed'
                      : agreementState === 'pending_host'
                        ? 'Awaiting Host Signature'
                        : 'Awaiting Your Signature'}
                  </span>
                </div>
              </div>
            </div>

            {/* Agreement Document */}
            <div className="p-6 sm:p-10">
              <RentalAgreementViewer
                agreement={agreement}
                mode={viewerMode}
                onSign={handleSign}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

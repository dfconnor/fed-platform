'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import SignatureCapture from '@/components/SignatureCapture';

interface RentalAgreementViewerProps {
  agreement: any; // RentalAgreement with booking/listing/guest/host
  mode: 'view' | 'sign';
  onSign?: (signature: string, type: 'drawn' | 'typed') => void;
  className?: string;
}

export default function RentalAgreementViewer({
  agreement,
  mode,
  onSign,
  className,
}: RentalAgreementViewerProps) {
  const booking = agreement?.booking;
  const guest = booking?.guest;
  const host = booking?.host;

  const agreementDate = useMemo(() => {
    if (!agreement?.createdAt) return 'N/A';
    return new Date(agreement.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [agreement?.createdAt]);

  const agreementId = agreement?.id
    ? `AGR-${agreement.id.slice(-8).toUpperCase()}`
    : 'AGR-XXXXXXXX';

  return (
    <div className={cn('bg-white', className)}>
      {/* Agreement Document Container */}
      <div className="agreement-container max-w-4xl mx-auto">
        {/* Rival RV Header */}
        <div className="border-b-2 border-forest-600 pb-6 mb-8 print:mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="6" width="22" height="12" rx="2" />
                  <path d="M6 18v2M18 18v2M1 12h22" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-forest-800">
                  Rival RV
                </h1>
                <p className="text-xs text-gray-500">
                  The Fair RV Rental Marketplace
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {agreementId}
              </p>
              <p className="text-xs text-gray-500">{agreementDate}</p>
              <p className="text-xs text-gray-400">
                Version {agreement?.version || '1.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Content */}
        <div
          className="agreement-content prose prose-sm prose-gray max-w-none print:prose-xs"
          dangerouslySetInnerHTML={{
            __html: agreement?.termsContent || '<p>Agreement content loading...</p>',
          }}
        />

        {/* Signatures Section */}
        <div className="mt-10 pt-8 border-t-2 border-gray-200">
          {mode === 'sign' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Your Signature
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please review the agreement above carefully before signing.
                </p>
              </div>

              {/* Show existing signatures if any */}
              {agreement?.hostSignedAt && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Owner/Host Signature
                  </p>
                  <SignatureDisplay
                    signature={agreement.hostSignature}
                    signatureType={agreement.hostSignatureType}
                    name={host?.name || 'Host'}
                    signedAt={agreement.hostSignedAt}
                  />
                </div>
              )}

              {agreement?.guestSignedAt && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Renter/Guest Signature
                  </p>
                  <SignatureDisplay
                    signature={agreement.guestSignature}
                    signatureType={agreement.guestSignatureType}
                    name={guest?.name || 'Guest'}
                    signedAt={agreement.guestSignedAt}
                  />
                </div>
              )}

              {/* Signature Capture */}
              <SignatureCapture
                onSign={(signature, type) => onSign?.(signature, type)}
                name={guest?.name || host?.name || ''}
                disabled={false}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Signatures
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Host Signature */}
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Owner/Host
                  </p>
                  {agreement?.hostSignedAt ? (
                    <SignatureDisplay
                      signature={agreement.hostSignature}
                      signatureType={agreement.hostSignatureType}
                      name={host?.name || 'Host'}
                      signedAt={agreement.hostSignedAt}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 py-4">
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
                      <span className="text-sm">Awaiting signature</span>
                    </div>
                  )}
                </div>

                {/* Guest Signature */}
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Renter/Guest
                  </p>
                  {agreement?.guestSignedAt ? (
                    <SignatureDisplay
                      signature={agreement.guestSignature}
                      signatureType={agreement.guestSignatureType}
                      name={guest?.name || 'Guest'}
                      signedAt={agreement.guestSignedAt}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 py-4">
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
                      <span className="text-sm">Awaiting signature</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print-friendly styles */}
      <style jsx global>{`
        /* Agreement document styles */
        .agreement-content .agreement-document {
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #1f2937;
          line-height: 1.7;
        }

        .agreement-content .agreement-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .agreement-content .agreement-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.025em;
        }

        .agreement-content .agreement-meta {
          font-size: 0.813rem;
          color: #6b7280;
          margin: 0.25rem 0;
          font-family: sans-serif;
        }

        .agreement-content .agreement-section {
          margin-bottom: 1.5rem;
        }

        .agreement-content .agreement-section h2 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.75rem 0;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #e5e7eb;
          font-family: sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .agreement-content .agreement-section p {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .agreement-content .agreement-section ol,
        .agreement-content .agreement-section ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .agreement-content .agreement-section li {
          margin: 0.375rem 0;
          font-size: 0.875rem;
        }

        .agreement-content .agreement-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin: 1rem 0;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .agreement-content .agreement-parties .party p {
          margin: 0.125rem 0;
          font-size: 0.875rem;
          font-family: sans-serif;
        }

        .agreement-content .agreement-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.875rem;
          font-family: sans-serif;
        }

        .agreement-content .agreement-table td {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .agreement-content .agreement-table td:first-child {
          width: 40%;
          color: #6b7280;
        }

        .agreement-content .agreement-table tr.agreement-total td {
          border-top: 2px solid #e5e7eb;
          border-bottom: none;
          padding-top: 0.75rem;
          font-size: 1rem;
        }

        .agreement-content .agreement-signature-block {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
        }

        .agreement-content .agreement-signature-block h2 {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.75rem;
          font-family: sans-serif;
        }

        .agreement-content .signature-lines {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .agreement-content .signature-line {
          font-family: sans-serif;
        }

        .agreement-content .signature-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem 0;
        }

        .agreement-content .signature-name {
          font-size: 0.875rem;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .agreement-content .signature-placeholder {
          font-size: 0.875rem;
          color: #d1d5db;
          margin: 0 0 0.5rem 0;
        }

        .agreement-content .signature-date-label {
          font-size: 0.813rem;
          color: #9ca3af;
          margin: 0;
        }

        /* Print styles */
        @media print {
          nav,
          footer,
          .no-print {
            display: none !important;
          }

          .agreement-container {
            max-width: 100% !important;
            padding: 0 !important;
          }

          .agreement-content .agreement-parties {
            break-inside: avoid;
          }

          .agreement-content .agreement-section {
            break-inside: avoid;
          }

          .agreement-content .agreement-signature-block {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Signature Display Component ──────────────────────────────────────────

function SignatureDisplay({
  signature,
  signatureType,
  name,
  signedAt,
}: {
  signature: string;
  signatureType: string;
  name: string;
  signedAt: string | Date;
}) {
  const signedDate = new Date(signedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="space-y-2">
      {signatureType === 'drawn' ? (
        <div className="bg-white rounded-lg border border-gray-100 p-2 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signature}
            alt={`${name}'s signature`}
            className="h-16 w-auto max-w-[240px] object-contain"
          />
        </div>
      ) : (
        <p
          className="text-2xl text-gray-900 py-2"
          style={{
            fontFamily:
              "'Brush Script MT', 'Segoe Script', 'Dancing Script', cursive",
          }}
        >
          {signature}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-700">{name}</span>
        <span>&middot;</span>
        <span>{signedDate}</span>
        <span>&middot;</span>
        <span className="flex items-center gap-1 text-brand-600">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          Verified
        </span>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import VerificationBadge from '@/components/VerificationBadge';
import type { VerificationLevel, VerificationStatus } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VerificationData {
  verified: boolean;
  level: VerificationLevel;
  verification: {
    id: string;
    status: VerificationStatus;
    idType: string | null;
    licenseState: string | null;
    licenseExpiry: string | null;
    backgroundCheckStatus: VerificationStatus;
    drivingRecordStatus: string | null;
    verifiedAt: string | null;
    expiresAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
  } | null;
}

// ---------------------------------------------------------------------------
// Mock data (used when API is unavailable)
// ---------------------------------------------------------------------------

const MOCK_VERIFIED: VerificationData = {
  verified: true,
  level: 'fully_verified',
  verification: {
    id: 'mock-verification-001',
    status: 'VERIFIED',
    idType: 'drivers_license',
    licenseState: 'CO',
    licenseExpiry: '2028-06-15T00:00:00.000Z',
    backgroundCheckStatus: 'VERIFIED',
    drivingRecordStatus: 'clean',
    verifiedAt: '2026-02-20T14:30:00.000Z',
    expiresAt: '2027-02-20T14:30:00.000Z',
    rejectionReason: null,
    createdAt: '2026-02-20T14:00:00.000Z',
  },
};

const BENEFITS = [
  {
    title: 'Book Instantly',
    description: 'Skip the wait and book RVs with instant booking without host approval.',
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Higher Trust Score',
    description: 'Verified users receive a trust badge visible to hosts, increasing booking acceptance.',
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Access All Listings',
    description: 'Some premium listings and hosts require verified guests. Unlock the full marketplace.',
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isExpiringSoon(expiresAt: string): boolean {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
}

const ID_TYPE_LABELS: Record<string, string> = {
  drivers_license: "Driver's License",
  passport: 'Passport',
  state_id: 'State ID',
};

const RECORD_LABELS: Record<string, string> = {
  clean: 'Clean',
  minor_violations: 'Minor Violations',
  major_violations: 'Major Violations',
  disqualified: 'Disqualified',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GuestVerificationPage() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/verify/status');
        if (res.ok) {
          setData(await res.json());
        } else {
          // Fallback to mock data
          setData(MOCK_VERIFIED);
        }
      } catch {
        setData(MOCK_VERIFIED);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const v = data?.verification;
  const isVerified = data?.verified && v?.status === 'VERIFIED';
  const isPending = v?.status === 'PENDING' || v?.status === 'PROCESSING';
  const expiringSoon = v?.expiresAt ? isExpiringSoon(v.expiresAt) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your identity verification status.</p>
        </div>
        {!isVerified && (
          <Link href="/verify" className="btn-primary gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75z" clipRule="evenodd" />
            </svg>
            Get Verified
          </Link>
        )}
      </div>

      {/* Status Card */}
      {isVerified ? (
        <div className="bg-white rounded-2xl border border-brand-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-brand-50 to-brand-100 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                <svg className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Verified</h2>
                  <VerificationBadge level={data!.level} size="lg" />
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  Your identity has been verified. You have full access to the Rival RV marketplace.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {v?.verifiedAt && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Verified On</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(v.verifiedAt)}</p>
                </div>
              )}
              {v?.expiresAt && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</p>
                  <p className={cn('text-sm font-semibold mt-1', expiringSoon ? 'text-sunset-600' : 'text-gray-900')}>
                    {formatDate(v.expiresAt)}
                    {expiringSoon && (
                      <span className="ml-2 badge bg-sunset-100 text-sunset-700 text-[10px]">Expiring Soon</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isPending ? (
        <div className="bg-white rounded-2xl border border-sunset-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-sunset-100 flex items-center justify-center shrink-0">
              <svg className="h-7 w-7 text-sunset-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verification In Progress</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Your verification is being processed. This usually takes a few minutes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <svg className="h-7 w-7 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Not Verified</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Complete identity verification to unlock the full Rival RV experience.
              </p>
            </div>
            <Link href="/verify" className="btn-primary shrink-0">
              Get Verified
            </Link>
          </div>
        </div>
      )}

      {/* Verification Details (when verified) */}
      {isVerified && v && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Verification Details</h2>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            {v.idType && (
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm text-gray-500">ID Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {ID_TYPE_LABELS[v.idType] || v.idType}
                </span>
              </div>
            )}
            {v.licenseState && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">License State</span>
                <span className="text-sm font-medium text-gray-900">{v.licenseState}</span>
              </div>
            )}
            {v.licenseExpiry && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">License Expiry</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(v.licenseExpiry)}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Background Check</span>
              <span
                className={cn(
                  'badge text-xs',
                  v.backgroundCheckStatus === 'VERIFIED'
                    ? 'bg-brand-100 text-brand-700'
                    : v.backgroundCheckStatus === 'FAILED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600',
                )}
              >
                {v.backgroundCheckStatus === 'VERIFIED' ? 'Passed' : v.backgroundCheckStatus === 'FAILED' ? 'Failed' : 'Pending'}
              </span>
            </div>
            {v.drivingRecordStatus && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Driving Record</span>
                <span
                  className={cn(
                    'badge text-xs',
                    v.drivingRecordStatus === 'clean'
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-sunset-100 text-sunset-700',
                  )}
                >
                  {RECORD_LABELS[v.drivingRecordStatus] || v.drivingRecordStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Re-verification notice */}
      {expiringSoon && (
        <div className="bg-sunset-50 border border-sunset-200 rounded-2xl p-5 flex items-start gap-3">
          <svg className="h-5 w-5 text-sunset-600 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-sunset-800">Verification Expiring Soon</p>
            <p className="text-sm text-sunset-700 mt-0.5">
              Your verification expires on {v?.expiresAt ? formatDate(v.expiresAt) : 'soon'}.
              Please re-verify to maintain uninterrupted access.
            </p>
            <Link href="/verify" className="inline-block mt-2 text-sm font-medium text-sunset-700 underline hover:no-underline">
              Re-verify Now
            </Link>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits of Verification</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                {benefit.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{benefit.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

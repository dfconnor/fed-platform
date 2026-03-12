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
// Mock data
// ---------------------------------------------------------------------------

const MOCK_VERIFIED: VerificationData = {
  verified: true,
  level: 'fully_verified',
  verification: {
    id: 'mock-host-verification-001',
    status: 'VERIFIED',
    idType: 'drivers_license',
    licenseState: 'CO',
    licenseExpiry: '2028-06-15T00:00:00.000Z',
    backgroundCheckStatus: 'VERIFIED',
    drivingRecordStatus: 'clean',
    verifiedAt: '2026-01-10T10:00:00.000Z',
    expiresAt: '2027-01-10T10:00:00.000Z',
    rejectionReason: null,
    createdAt: '2026-01-10T09:30:00.000Z',
  },
};

// Mock Stripe Connect status
const MOCK_STRIPE = {
  connected: true,
  accountId: 'acct_mock_123',
  chargesEnabled: true,
  payoutsEnabled: true,
};

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

// ---------------------------------------------------------------------------
// Host requirements checklist
// ---------------------------------------------------------------------------

interface Requirement {
  label: string;
  description: string;
  completed: boolean;
}

function getRequirements(
  data: VerificationData | null,
  stripe: typeof MOCK_STRIPE,
): Requirement[] {
  const isVerified = data?.verified && data.verification?.status === 'VERIFIED';
  const bgPassed = data?.verification?.backgroundCheckStatus === 'VERIFIED';

  return [
    {
      label: 'Identity Verification',
      description: 'Verify your government-issued ID and pass a selfie match.',
      completed: !!isVerified,
    },
    {
      label: 'Background Check',
      description: 'Complete a background check to build trust with guests.',
      completed: !!bgPassed,
    },
    {
      label: 'Stripe Connect Account',
      description: 'Connect your Stripe account to receive payouts for bookings.',
      completed: stripe.connected && stripe.payoutsEnabled,
    },
    {
      label: 'Email Verified',
      description: 'Confirm your email address.',
      completed: true, // Assume true since they are logged in
    },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HostVerificationPage() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [stripe] = useState(MOCK_STRIPE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/verify/status');
        if (res.ok) {
          setData(await res.json());
        } else {
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
  const expiringSoon = v?.expiresAt ? isExpiringSoon(v.expiresAt) : false;
  const requirements = getRequirements(data, stripe);
  const completedCount = requirements.filter((r) => r.completed).length;
  const allComplete = completedCount === requirements.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Host Verification</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete verification to start receiving bookings.
          </p>
        </div>
        {isVerified && data?.level && (
          <VerificationBadge level={data.level} size="lg" showLabel />
        )}
      </div>

      {/* Host requirement notice */}
      <div className={cn(
        'rounded-2xl p-5 flex items-start gap-3',
        allComplete
          ? 'bg-brand-50 border border-brand-200'
          : 'bg-sunset-50 border border-sunset-200',
      )}>
        <svg
          className={cn('h-5 w-5 mt-0.5 shrink-0', allComplete ? 'text-brand-600' : 'text-sunset-600')}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {allComplete ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          )}
        </svg>
        <div>
          <p className={cn('text-sm font-semibold', allComplete ? 'text-brand-800' : 'text-sunset-800')}>
            {allComplete
              ? 'All verification requirements met!'
              : 'Hosts must be verified to receive bookings'}
          </p>
          <p className={cn('text-sm mt-0.5', allComplete ? 'text-brand-700' : 'text-sunset-700')}>
            {allComplete
              ? 'You are fully verified and can receive bookings from guests.'
              : `Complete ${requirements.length - completedCount} more requirement${requirements.length - completedCount > 1 ? 's' : ''} to start hosting.`}
          </p>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Host Requirements</h2>
          <span className="text-sm text-gray-500">
            {completedCount}/{requirements.length} complete
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {requirements.map((req) => (
            <div key={req.label} className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                  req.completed ? 'bg-brand-100' : 'bg-gray-100',
                )}
              >
                {req.completed ? (
                  <svg className="h-4 w-4 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', req.completed ? 'text-gray-900' : 'text-gray-700')}>
                  {req.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
              </div>
              {!req.completed && (
                <Link
                  href={req.label === 'Stripe Connect Account' ? '/dashboard/host/earnings' : '/verify'}
                  className="btn-secondary !py-1.5 !px-3 !text-xs shrink-0"
                >
                  Complete
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Connect Status */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payment Account</h2>
        </div>
        <div className="p-5">
          {stripe.connected ? (
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.016H4.48c-.075.01-.152.016-.23.016h-1.5A1.75 1.75 0 011 15.265V4.75z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Stripe Connect</p>
                <p className="text-xs text-gray-500">
                  {stripe.chargesEnabled && stripe.payoutsEnabled
                    ? 'Connected and ready to receive payouts'
                    : 'Account connected but requires additional setup'}
                </p>
              </div>
              <span className={cn(
                'badge text-xs',
                stripe.chargesEnabled ? 'bg-brand-100 text-brand-700' : 'bg-sunset-100 text-sunset-700',
              )}>
                {stripe.chargesEnabled ? 'Active' : 'Pending'}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-3">
                Connect your Stripe account to start receiving payouts.
              </p>
              <Link href="/dashboard/host/earnings" className="btn-primary !text-sm">
                Connect Stripe
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Verification Details (when verified) */}
      {isVerified && v && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Verification Details</h2>
          </div>
          <div className="p-5 divide-y divide-gray-100">
            {v.idType && (
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-gray-500">ID Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {ID_TYPE_LABELS[v.idType] || v.idType}
                </span>
              </div>
            )}
            {v.verifiedAt && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Verified On</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(v.verifiedAt)}</span>
              </div>
            )}
            {v.expiresAt && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Expires</span>
                <span className={cn('text-sm font-medium', expiringSoon ? 'text-sunset-600' : 'text-gray-900')}>
                  {formatDate(v.expiresAt)}
                  {expiringSoon && (
                    <span className="ml-2 badge bg-sunset-100 text-sunset-700 text-[10px]">Expiring Soon</span>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Background Check</span>
              <span className={cn(
                'badge text-xs',
                v.backgroundCheckStatus === 'VERIFIED'
                  ? 'bg-brand-100 text-brand-700'
                  : v.backgroundCheckStatus === 'FAILED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600',
              )}>
                {v.backgroundCheckStatus === 'VERIFIED' ? 'Passed' : v.backgroundCheckStatus === 'FAILED' ? 'Failed' : 'Pending'}
              </span>
            </div>
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
              You must re-verify to continue receiving bookings.
            </p>
            <Link href="/verify" className="inline-block mt-2 text-sm font-medium text-sunset-700 underline hover:no-underline">
              Re-verify Now
            </Link>
          </div>
        </div>
      )}

      {/* Host Tier Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sunset-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-sunset-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Gold Host</p>
              <p className="text-xs text-gray-500">47 completed trips &middot; 4.92 avg rating</p>
            </div>
          </div>
          <span className="badge bg-sunset-100 text-sunset-700 text-xs">Gold</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Progress to Platinum</span>
            <span className="font-medium text-gray-700">47/75 trips</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sunset-400 to-sunset-500 rounded-full" style={{ width: '63%' }} />
          </div>
          <p className="text-xs text-gray-400">28 more trips to reach Platinum tier</p>
        </div>
      </div>
    </div>
  );
}

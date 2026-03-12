'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCents, DAMAGE_TYPE_LABELS, type DamageType } from '@/types';
import ImageUploader from '@/components/ImageUploader';
import type { UploadedImage } from '@/lib/upload-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConditionReport {
  type: 'DEPARTURE' | 'RETURN';
  photos: string[];
  mileage: number | null;
  fuelLevel: number | null;
  notes: string;
  createdAt: string;
}

interface DamageClaimFormProps {
  bookingId: string;
  securityDepositAmount: number; // cents
  departureReport?: ConditionReport;
  returnReport?: ConditionReport;
  onSubmit: (claim: any) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Damage type options with icons
// ---------------------------------------------------------------------------

const DAMAGE_TYPE_OPTIONS: {
  value: DamageType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: 'exterior',
    label: 'Exterior Damage',
    description: 'Dents, scratches, paint damage, broken lights',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25" />
      </svg>
    ),
  },
  {
    value: 'interior',
    label: 'Interior Damage',
    description: 'Upholstery, appliances, fixtures, flooring',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    value: 'mechanical',
    label: 'Mechanical Issue',
    description: 'Engine, transmission, plumbing, electrical',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.1-5.1a6 6 0 118.49-8.49l5.1 5.1a6 6 0 01-8.49 8.49zM15.75 3.75L20.25 8.25" />
      </svg>
    ),
  },
  {
    value: 'cleaning',
    label: 'Excessive Cleaning',
    description: 'Stains, odors, trash, biohazard cleanup',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Missing items, policy violations, other issues',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Fuel gauge display helper
// ---------------------------------------------------------------------------

function FuelGauge({ level, small }: { level: number | null; small?: boolean }) {
  if (level === null) return <span className="text-gray-400 text-xs">N/A</span>;
  const fillPct = Math.max(level, 8);
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'relative rounded border border-gray-300 bg-gray-100 overflow-hidden',
          small ? 'w-4 h-6' : 'w-6 h-8'
        )}
      >
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 rounded-b-sm',
            level === 0 ? 'bg-red-400' : 'bg-brand-400'
          )}
          style={{ height: `${fillPct}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{level}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DamageClaimForm({
  bookingId,
  securityDepositAmount,
  departureReport,
  returnReport,
  onSubmit,
  className,
}: DamageClaimFormProps) {
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<UploadedImage[]>([]);
  const [amountStr, setAmountStr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse dollar input to cents
  const amountCents = Math.round(parseFloat(amountStr || '0') * 100);
  const maxAmountDollars = securityDepositAmount / 100;

  const canSubmit =
    damageType !== null &&
    description.length >= 50 &&
    photos.length > 0 &&
    amountCents > 0 &&
    amountCents <= securityDepositAmount &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/damage-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          description: description.trim(),
          photos: photos.map((p) => p.url),
          requestedAmount: amountCents,
          damageType,
        }),
      });

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({ error: 'Failed to file claim' }));
        throw new Error(data.error || 'Failed to file claim');
      }

      const data = await res.json();
      onSubmit(data.claim);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to file claim');
    } finally {
      setSubmitting(false);
    }
  };

  // Format amount input on blur
  const handleAmountBlur = () => {
    const value = parseFloat(amountStr);
    if (!isNaN(value) && value > 0) {
      // Clamp to max
      const clamped = Math.min(value, maxAmountDollars);
      setAmountStr(clamped.toFixed(2));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-8', className)}>
      {/* Section: Damage Type */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Type of Damage
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Select the category that best describes the damage.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAMAGE_TYPE_OPTIONS.map((option) => {
            const isSelected = damageType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDamageType(option.value)}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-200'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                <div
                  className={cn(
                    'flex-shrink-0 mt-0.5',
                    isSelected ? 'text-brand-600' : 'text-gray-400'
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <span
                    className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-brand-900' : 'text-gray-900'
                    )}
                  >
                    {option.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section: Description */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Description
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Provide a detailed description of the damage (minimum 50 characters).
        </p>
        <textarea
          className="input-field min-h-[140px] resize-y"
          placeholder="Describe the damage in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
        />
        <div className="flex items-center justify-between mt-1">
          <p
            className={cn(
              'text-xs',
              description.length < 50 && description.length > 0
                ? 'text-red-500'
                : 'text-gray-400'
            )}
          >
            {description.length < 50 && description.length > 0
              ? `${50 - description.length} more characters needed`
              : `${description.length}/5,000`}
          </p>
        </div>
      </section>

      {/* Section: Photo Evidence */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Photo Evidence
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Upload clear photos showing the damage. Include close-ups and wider
          context shots.
        </p>
        <ImageUploader
          onUpload={setPhotos}
          category="damage_claim"
          maxFiles={10}
        />
      </section>

      {/* Section: Requested Amount */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Requested Amount
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Enter the amount you are requesting for repairs or compensation.
        </p>
        <div className="max-w-xs">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              className="input-field pl-7"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              onBlur={handleAmountBlur}
              min={0}
              max={maxAmountDollars}
              step={0.01}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Security deposit:{' '}
            <span className="font-medium text-gray-700">
              {formatCents(securityDepositAmount)}
            </span>
          </p>
          {amountCents > securityDepositAmount && (
            <p className="text-xs text-red-500 mt-1">
              Amount cannot exceed the security deposit
            </p>
          )}
        </div>
      </section>

      {/* Section: Reference Reports (side-by-side comparison) */}
      {(departureReport || returnReport) && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Condition Report Reference
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Compare departure and return reports to support your claim.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Report */}
            {departureReport && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Departure Report
                </h4>
                {/* Photo thumbnails */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
                  {departureReport.photos.slice(0, 4).map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-forest-200 to-forest-300 flex items-center justify-center">
                        <span className="text-[9px] text-forest-700 font-medium">
                          Photo {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                  {departureReport.photos.length > 4 && (
                    <div className="w-16 h-12 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        +{departureReport.photos.length - 4}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mileage</span>
                    <span className="text-gray-900 font-medium">
                      {departureReport.mileage?.toLocaleString() ?? 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Fuel Level</span>
                    <FuelGauge level={departureReport.fuelLevel} small />
                  </div>
                </div>
              </div>
            )}

            {/* Return Report */}
            {returnReport && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-sunset-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  Return Report
                </h4>
                {/* Photo thumbnails */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
                  {returnReport.photos.slice(0, 4).map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-sunset-200 to-sunset-300 flex items-center justify-center">
                        <span className="text-[9px] text-sunset-700 font-medium">
                          Photo {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                  {returnReport.photos.length > 4 && (
                    <div className="w-16 h-12 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        +{returnReport.photos.length - 4}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mileage</span>
                    <span className="text-gray-900 font-medium">
                      {returnReport.mileage?.toLocaleString() ?? 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Fuel Level</span>
                    <FuelGauge level={returnReport.fuelLevel} small />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comparison summary */}
          {departureReport && returnReport && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 space-y-2">
              <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trip Summary
              </h5>
              {departureReport.mileage != null &&
                returnReport.mileage != null && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Miles Driven</span>
                    <span className="font-medium text-gray-900">
                      {(
                        returnReport.mileage - departureReport.mileage
                      ).toLocaleString()}{' '}
                      mi
                    </span>
                  </div>
                )}
              {departureReport.fuelLevel != null &&
                returnReport.fuelLevel != null && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Fuel Change</span>
                    <span
                      className={cn(
                        'font-medium',
                        returnReport.fuelLevel < departureReport.fuelLevel
                          ? 'text-red-600'
                          : 'text-brand-600'
                      )}
                    >
                      {returnReport.fuelLevel - departureReport.fuelLevel > 0
                        ? '+'
                        : ''}
                      {returnReport.fuelLevel - departureReport.fuelLevel}%
                    </span>
                  </div>
                )}
            </div>
          )}
        </section>
      )}

      {/* Warning */}
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-sunset-800">
            Filing a damage claim initiates a formal process
          </p>
          <p className="text-xs text-sunset-700 mt-1">
            The renter will be notified and given 3 days to respond. Claims are
            reviewed by the Rival RV team. False claims may result in account
            suspension.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'btn-primary px-8 py-3 text-base',
            !canSubmit && 'opacity-50 cursor-not-allowed'
          )}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Filing Claim...
            </span>
          ) : (
            'File Damage Claim'
          )}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageUploader from '@/components/ImageUploader';
import type { UploadedImage } from '@/lib/upload-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConditionReportFormProps {
  bookingId: string;
  type: 'DEPARTURE' | 'RETURN';
  onSubmit: (report: any) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Photo prompt labels
// ---------------------------------------------------------------------------

const PHOTO_PROMPTS = [
  'Front Exterior',
  'Rear Exterior',
  'Driver Side',
  'Passenger Side',
  'Dashboard/Odometer',
  'Interior - Living',
  'Interior - Kitchen',
  'Interior - Bedroom',
  'Bathroom',
  'Any Existing Damage',
];

// ---------------------------------------------------------------------------
// Fuel level options
// ---------------------------------------------------------------------------

const FUEL_LEVELS = [
  { value: 0, label: 'Empty', short: 'E', pct: '0%' },
  { value: 25, label: 'Quarter', short: '1/4', pct: '25%' },
  { value: 50, label: 'Half', short: '1/2', pct: '50%' },
  { value: 75, label: 'Three-Quarters', short: '3/4', pct: '75%' },
  { value: 100, label: 'Full', short: 'F', pct: '100%' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConditionReportForm({
  bookingId,
  type,
  onSubmit,
  className,
}: ConditionReportFormProps) {
  const [photos, setPhotos] = useState<UploadedImage[]>([]);
  const [mileage, setMileage] = useState<string>('');
  const [fuelLevel, setFuelLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const canSubmit =
    photos.length > 0 && acknowledged && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const report = {
        bookingId,
        type,
        photos: photos.map((p) => p.url),
        notes: notes.trim() || undefined,
        mileage: mileage ? parseInt(mileage, 10) : undefined,
        fuelLevel: fuelLevel ?? undefined,
      };

      // Submit to API
      const res = await fetch('/api/condition-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Submit failed' }));
        throw new Error(data.error || 'Failed to submit condition report');
      }

      const data = await res.json();
      onSubmit(data.report);
    } catch (error) {
      console.error('Condition report submit error:', error);
      // In production, show toast or error UI
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-8', className)}>
      {/* Section: Photo Documentation */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Photo Documentation
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Take clear photos of each area. The more thorough the documentation,
          the better protected both parties are.
        </p>

        {/* Photo prompt guide */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
          {PHOTO_PROMPTS.map((prompt, i) => (
            <div
              key={prompt}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-xs text-gray-700 leading-tight">
                {prompt}
              </span>
            </div>
          ))}
        </div>

        <ImageUploader
          onUpload={setPhotos}
          category="condition_report"
          maxFiles={20}
        />
      </section>

      {/* Section: Mileage */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Odometer Reading
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Record the current mileage shown on the dashboard.
        </p>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Odometer Reading (miles)
          </label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 45,230"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            min={0}
            max={999999}
          />
        </div>
      </section>

      {/* Section: Fuel Level */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Fuel Level
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Select the current fuel gauge reading.
        </p>
        <div className="flex items-end gap-2">
          {FUEL_LEVELS.map((level) => {
            const isSelected = fuelLevel === level.value;
            // Visual height of the "fuel" fill
            const fillHeight = Math.max(level.value, 8); // min 8% so empty is visible
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => setFuelLevel(level.value)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 w-16 sm:w-20 rounded-xl border-2 p-2 pt-3 pb-2 transition-all',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                {/* Fuel gauge visualization */}
                <div className="relative w-8 h-12 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 right-0 rounded-b-sm transition-all duration-300',
                      isSelected ? 'bg-brand-400' : 'bg-gray-300',
                      level.value === 0 && 'bg-red-400',
                      level.value === 100 && isSelected && 'bg-brand-500'
                    )}
                    style={{ height: `${fillHeight}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isSelected ? 'text-brand-700' : 'text-gray-600'
                  )}
                >
                  {level.short}
                </span>
                <span className="text-[10px] text-gray-400">{level.pct}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section: Notes */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Condition Notes
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {type === 'DEPARTURE'
            ? 'Document any pre-existing damage or issues you notice before departure.'
            : 'Document any changes, new damage, or issues that occurred during the trip.'}
        </p>
        <textarea
          className="input-field min-h-[120px] resize-y"
          placeholder={
            type === 'DEPARTURE'
              ? 'Note any pre-existing damage or issues...'
              : 'Note any changes or damage that occurred...'
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {notes.length}/2,000
        </p>
      </section>

      {/* Section: Acknowledgment */}
      <section className="border-t border-gray-200 pt-6">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-5 h-5"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I confirm this report accurately represents the vehicle&apos;s
            current condition as of{' '}
            <strong>
              {formattedDate} at {formattedTime}
            </strong>
            .
          </span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-400">
          {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
          {mileage ? ` | ${parseInt(mileage, 10).toLocaleString()} miles` : ''}
          {fuelLevel !== null
            ? ` | Fuel: ${FUEL_LEVELS.find((l) => l.value === fuelLevel)?.pct}`
            : ''}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'btn-primary px-8 py-3',
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
              Submitting...
            </span>
          ) : (
            `Submit ${type === 'DEPARTURE' ? 'Departure' : 'Return'} Report`
          )}
        </button>
      </div>
    </form>
  );
}

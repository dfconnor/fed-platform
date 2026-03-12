'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { formatCents, formatCentsDecimal, type PricingBreakdown } from '@/types';

interface PricingCardProps {
  nightlyRate: number; // cents
  cleaningFee?: number; // cents
  pricing?: PricingBreakdown;
  instantBook?: boolean;
  maxGuests?: number;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultGuests?: number;
  onDateChange?: (startDate: string, endDate: string) => void;
  onGuestsChange?: (guests: number) => void;
  onBook?: () => void;
  onRequestBook?: () => void;
  loading?: boolean;
  className?: string;
}

export default function PricingCard({
  nightlyRate,
  cleaningFee = 0,
  pricing,
  instantBook = false,
  maxGuests = 8,
  defaultStartDate = '',
  defaultEndDate = '',
  defaultGuests = 2,
  onDateChange,
  onGuestsChange,
  onBook,
  onRequestBook,
  loading = false,
  className,
}: PricingCardProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [guests, setGuests] = useState(defaultGuests);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  function handleStartDate(value: string) {
    setStartDate(value);
    onDateChange?.(value, endDate);
  }

  function handleEndDate(value: string) {
    setEndDate(value);
    onDateChange?.(startDate, value);
  }

  function handleGuests(value: number) {
    setGuests(value);
    onGuestsChange?.(value);
  }

  return (
    <div className={cn('card p-6 sticky top-20', className)}>
      {/* Nightly rate */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-bold text-gray-900">{formatCents(nightlyRate)}</span>
        <span className="text-gray-500">/ night</span>
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-0 mb-3">
        <div className="border border-gray-300 rounded-tl-xl p-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">CHECK-IN</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDate(e.target.value)}
            min={today}
            className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
          />
        </div>
        <div className="border border-gray-300 border-l-0 rounded-tr-xl p-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">CHECKOUT</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDate(e.target.value)}
            min={startDate || today}
            className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Guest selector */}
      <div className="border border-gray-300 rounded-xl p-3 mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">GUESTS</label>
        <select
          value={guests}
          onChange={(e) => handleGuests(Number(e.target.value))}
          className="w-full text-sm text-gray-900 focus:outline-none bg-transparent cursor-pointer"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </div>

      {/* Book button */}
      {instantBook ? (
        <button
          onClick={onBook}
          disabled={!nights || loading}
          className="btn-primary w-full !py-3.5 !text-base mb-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Booking...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
              </svg>
              Book Now
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={onRequestBook}
          disabled={!nights || loading}
          className="btn-primary w-full !py-3.5 !text-base mb-3"
        >
          {loading ? 'Sending request...' : 'Request to Book'}
        </button>
      )}

      {!nights && (
        <p className="text-center text-sm text-gray-400 mb-3">Select dates to see total</p>
      )}

      {/* Price breakdown */}
      {pricing && nights > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-2">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 mb-3"
          >
            <span className="font-medium">Price breakdown</span>
            <svg
              className={cn('h-4 w-4 transition-transform', showBreakdown && 'rotate-180')}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {showBreakdown && (
            <div className="space-y-2 text-sm animate-slide-down">
              <div className="flex justify-between">
                <span className="text-gray-600 underline decoration-dotted underline-offset-4 cursor-help" title="Base nightly rate">
                  {formatCents(nightlyRate)} x {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="text-gray-900">{formatCentsDecimal(pricing.nightlyTotal)}</span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <span>Long stay discount</span>
                  <span>-{formatCentsDecimal(pricing.discount)}</span>
                </div>
              )}

              {pricing.cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="text-gray-900">{formatCentsDecimal(pricing.cleaningFee)}</span>
                </div>
              )}

              {pricing.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="text-gray-900">{formatCentsDecimal(pricing.deliveryFee)}</span>
                </div>
              )}

              {pricing.insuranceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="text-gray-900">{formatCentsDecimal(pricing.insuranceFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Service fee (5%)</span>
                <span className="text-gray-900">{formatCentsDecimal(pricing.platformFeeGuest)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold text-base">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCentsDecimal(pricing.total)}</span>
              </div>

              {pricing.securityDeposit > 0 && (
                <p className="text-xs text-gray-400 pt-1">
                  + {formatCents(pricing.securityDeposit)} refundable security deposit (hold only)
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fee comparison note */}
      <div className="mt-4 p-3 bg-brand-50 rounded-xl">
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-brand-800">Only 5% service fee</p>
            <p className="text-xs text-brand-600 mt-0.5">
              Other platforms charge 15-25%. You save more with Rival RV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

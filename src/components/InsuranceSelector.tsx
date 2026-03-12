'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { type InsuranceTier, type InsuranceQuote, formatCents } from '@/types';

interface InsuranceSelectorProps {
  quotes: InsuranceQuote[];
  selectedTier?: InsuranceTier;
  onSelect?: (tier: InsuranceTier, quote: InsuranceQuote) => void;
  nights?: number;
  className?: string;
}

const TIER_ORDER: InsuranceTier[] = ['BASIC', 'ESSENTIAL', 'PREMIUM'];

const TIER_ICONS: Record<InsuranceTier, JSX.Element> = {
  BASIC: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ESSENTIAL: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  PREMIUM: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg className="h-4 w-4 text-brand-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-gray-300 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  );
}

export default function InsuranceSelector({
  quotes,
  selectedTier,
  onSelect,
  nights = 1,
  className,
}: InsuranceSelectorProps) {
  const [selected, setSelected] = useState<InsuranceTier>(selectedTier ?? 'ESSENTIAL');

  // Group quotes by tier and pick cheapest per tier
  const bestByTier: Record<string, InsuranceQuote> = {};
  for (const q of quotes) {
    if (!bestByTier[q.tier] || q.price < bestByTier[q.tier].price) {
      bestByTier[q.tier] = q;
    }
  }

  function handleSelect(tier: InsuranceTier) {
    setSelected(tier);
    const quote = bestByTier[tier];
    if (quote) {
      onSelect?.(tier, quote);
    }
  }

  // Find the cheapest overall to mark as "Best rate"
  const cheapestTier = TIER_ORDER.reduce<InsuranceTier | null>((best, tier) => {
    if (!bestByTier[tier]) return best;
    if (!best || !bestByTier[best]) return tier;
    return bestByTier[tier].price < bestByTier[best].price ? tier : best;
  }, null);

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose your protection</h3>
        <p className="text-sm text-gray-500">
          We compare rates from multiple providers to get you the best price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIER_ORDER.map((tier) => {
          const quote = bestByTier[tier];
          if (!quote) return null;

          const isSelected = selected === tier;
          const isRecommended = tier === 'ESSENTIAL';
          const isBestRate = tier === cheapestTier;
          const perNight = nights > 0 ? Math.round(quote.price / nights) : quote.price;

          return (
            <button
              key={tier}
              onClick={() => handleSelect(tier)}
              className={cn(
                'relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all',
                isSelected
                  ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              {/* Badges */}
              <div className="absolute -top-3 left-4 flex items-center gap-2">
                {isRecommended && (
                  <span className="badge bg-brand-600 text-white text-xs shadow-sm">
                    Recommended
                  </span>
                )}
                {isBestRate && (
                  <span className="badge bg-sunset-500 text-white text-xs shadow-sm">
                    Best Rate
                  </span>
                )}
              </div>

              {/* Icon and tier name */}
              <div className="flex items-center gap-3 mb-3 mt-1">
                <div className={cn(
                  'p-2 rounded-lg',
                  isSelected ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {TIER_ICONS[tier]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{quote.name}</h4>
                  <p className="text-xs text-gray-500">via {quote.provider}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">{formatCents(quote.price)}</span>
                <span className="text-sm text-gray-500"> total</span>
                {nights > 1 && (
                  <p className="text-xs text-gray-400">{formatCents(perNight)}/night</p>
                )}
              </div>

              {/* Coverage details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included />
                  <span className="text-gray-700">
                    {formatCents(quote.coverage.liability)} liability
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included />
                  <span className="text-gray-700">
                    {formatCents(quote.coverage.collision)} collision
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included />
                  <span className="text-gray-700">
                    {formatCents(quote.coverage.comprehensive)} comprehensive
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included={quote.coverage.interior} />
                  <span className={cn(quote.coverage.interior ? 'text-gray-700' : 'text-gray-400')}>
                    Interior damage
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included={quote.coverage.roadside} />
                  <span className={cn(quote.coverage.roadside ? 'text-gray-700' : 'text-gray-400')}>
                    24/7 Roadside assistance
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon included={quote.coverage.tripCancellation} />
                  <span className={cn(quote.coverage.tripCancellation ? 'text-gray-700' : 'text-gray-400')}>
                    Trip cancellation
                  </span>
                </div>
              </div>

              {/* Deductible */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Deductible: <span className="font-medium text-gray-700">{formatCents(quote.deductible)}</span>
                </p>
              </div>

              {/* Radio indicator */}
              <div className="absolute top-5 right-5">
                <div className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-brand-600 bg-brand-600' : 'border-gray-300'
                )}>
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Description of selected tier */}
      {bestByTier[selected] && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">{bestByTier[selected].description}</p>
        </div>
      )}
    </div>
  );
}

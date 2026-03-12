'use client';

import { formatCents } from '@/types';

interface FeeBannerProps {
  subtotal: number; // cents
  variant?: 'inline' | 'banner';
}

export function FeeBanner({ subtotal, variant = 'inline' }: FeeBannerProps) {
  const rivalFee = Math.round(subtotal * 0.05);
  const outdoorsyFee = Math.round(subtotal * 0.225);
  const rvShareFee = Math.round(subtotal * 0.25);
  const savings = outdoorsyFee - rivalFee;

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-800">
              You save {formatCents(savings)} with Rival RV
            </p>
            <p className="text-xs text-brand-600">
              Our 5% fee vs Outdoorsy&apos;s ~22.5% and RVshare&apos;s 25%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-brand-700 flex items-center gap-1.5">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Save {formatCents(savings)} vs competitors</span>
    </div>
  );
}

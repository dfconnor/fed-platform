'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { VerificationLevel } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ICON_SIZE: Record<'sm' | 'md' | 'lg', number> = { sm: 14, md: 18, lg: 24 };

const LEVEL_CONFIG: Record<
  Exclude<VerificationLevel, 'none'>,
  { label: string; tooltip: string; colorClass: string }
> = {
  id_verified: {
    label: 'ID Verified',
    tooltip: 'ID Verified',
    colorClass: 'text-brand-500',
  },
  background_checked: {
    label: 'Background Checked',
    tooltip: 'Background Checked',
    colorClass: 'text-forest-600',
  },
  fully_verified: {
    label: 'Fully Verified',
    tooltip: 'Fully Verified',
    colorClass: 'text-sunset-500',
  },
};

// ---------------------------------------------------------------------------
// Shield icons (inline SVG)
// ---------------------------------------------------------------------------

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 2.632.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516c-2.95.1-5.669-.98-7.877-2.632zM15.53 9.53a.75.75 0 00-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ShieldStar({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 2.632.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516c-2.95.1-5.669-.98-7.877-2.632zM12 7.25a.75.75 0 01.672.418l.9 1.82 2.01.293a.75.75 0 01.416 1.28l-1.455 1.417.343 2.003a.75.75 0 01-1.088.79L12 14.347l-1.798.945a.75.75 0 01-1.088-.79l.343-2.003-1.455-1.418a.75.75 0 01.416-1.28l2.01-.292.9-1.82A.75.75 0 0112 7.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function VerificationBadge({
  level,
  size = 'md',
  showLabel = false,
  className,
}: VerificationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (level === 'none') return null;

  const config = LEVEL_CONFIG[level];
  const iconSize = ICON_SIZE[size];

  const Icon = level === 'fully_verified' ? ShieldStar : ShieldCheck;

  return (
    <span
      className={cn('relative inline-flex items-center gap-1', className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon size={iconSize} className={config.colorClass} />
      {showLabel && (
        <span
          className={cn(
            'font-medium whitespace-nowrap',
            config.colorClass,
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
          )}
        >
          {config.label}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && !showLabel && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap z-50 pointer-events-none">
          {config.tooltip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

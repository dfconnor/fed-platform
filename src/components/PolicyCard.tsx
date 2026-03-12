'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface PolicyCardProps {
  title: string;
  icon: React.ReactNode;
  summary: string;
  details: React.ReactNode;
  variant?: 'info' | 'warning' | 'success';
  defaultExpanded?: boolean;
  className?: string;
}

const variantStyles: Record<
  'info' | 'warning' | 'success',
  { bg: string; border: string; iconColor: string; titleColor: string }
> = {
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    iconColor: 'text-sky-600',
    titleColor: 'text-sky-900',
  },
  warning: {
    bg: 'bg-sunset-50',
    border: 'border-sunset-200',
    iconColor: 'text-sunset-600',
    titleColor: 'text-sunset-900',
  },
  success: {
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    iconColor: 'text-brand-600',
    titleColor: 'text-brand-900',
  },
};

export default function PolicyCard({
  title,
  icon,
  summary,
  details,
  variant = 'info',
  defaultExpanded = false,
  className,
}: PolicyCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Icon */}
        <div className={cn('flex-shrink-0', styles.iconColor)}>{icon}</div>

        {/* Title + Summary */}
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-semibold text-sm', styles.titleColor)}>
            {title}
          </h4>
          <p className="text-xs text-gray-600 mt-0.5">{summary}</p>
        </div>

        {/* Chevron */}
        <svg
          className={cn(
            'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expandable Details */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 pt-0 text-sm text-gray-700 border-t border-gray-200/50">
          <div className="pt-3">{details}</div>
        </div>
      </div>
    </div>
  );
}

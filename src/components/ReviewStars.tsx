import { cn } from '@/lib/utils';

interface ReviewStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'lg';
  className?: string;
}

function StarIcon({ fill, className }: { fill: 'full' | 'half' | 'empty'; className?: string }) {
  if (fill === 'full') {
    return (
      <svg
        className={cn('text-sunset-400', className)}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (fill === 'half') {
    return (
      <svg
        className={cn('text-sunset-400', className)}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="halfStarGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#d4d4d8" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
          clipRule="evenodd"
          fill="url(#halfStarGrad)"
        />
      </svg>
    );
  }

  return (
    <svg
      className={cn('text-gray-300', className)}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ReviewStars({ rating, count, size = 'sm', className }: ReviewStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const adjustedFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFull - (hasHalf ? 1 : 0);

  const starSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: adjustedFull }, (_, i) => (
          <StarIcon key={`full-${i}`} fill="full" className={starSize} />
        ))}
        {hasHalf && <StarIcon fill="half" className={starSize} />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarIcon key={`empty-${i}`} fill="empty" className={starSize} />
        ))}
      </div>
      {typeof count === 'number' && (
        <span
          className={cn(
            'text-gray-600',
            size === 'lg' ? 'text-sm' : 'text-xs'
          )}
        >
          ({count})
        </span>
      )}
    </div>
  );
}

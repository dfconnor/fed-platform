'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type RVType, RV_TYPE_LABELS, formatCents } from '@/types';
import ReviewStars from './ReviewStars';

interface RVCardProps {
  id: string;
  slug: string;
  title: string;
  images: string[];
  nightlyRate: number; // cents
  allInPrice?: number; // cents, total per night including fees
  rvType: RVType;
  location: string;
  sleeps: number;
  rating: number;
  reviewCount: number;
  instantBook?: boolean;
  petFriendly?: boolean;
  deliveryAvailable?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export default function RVCard({
  id,
  slug,
  title,
  images,
  nightlyRate,
  allInPrice,
  rvType,
  location,
  sleeps,
  rating,
  reviewCount,
  instantBook = false,
  petFriendly = false,
  deliveryAvailable = false,
  isFavorited = false,
  onFavoriteToggle,
  className,
}: RVCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(isFavorited);
  const [imageError, setImageError] = useState(false);

  const displayImages = images.length > 0 ? images : [];
  const totalImages = displayImages.length;

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onFavoriteToggle?.(id);
  }

  function handlePrevImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }

  function handleNextImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }

  const rvTypeLabel = RV_TYPE_LABELS[rvType] ?? rvType;
  const displayRate = allInPrice ?? nightlyRate;

  return (
    <Link
      href={`/listing/${id}`}
      className={cn('card group block overflow-hidden', className)}
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {displayImages.length > 0 && !imageError ? (
          <img
            src={displayImages[currentImage]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-forest-50">
            <svg className="h-16 w-16 text-forest-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="8" width="20" height="10" rx="2" />
              <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </div>
        )}

        {/* Image navigation arrows */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Previous image"
            >
              <svg className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Next image"
            >
              <svg className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}

        {/* Image dots */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {displayImages.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors',
                  idx === currentImage ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
            {totalImages > 5 && (
              <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            )}
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={cn('h-5 w-5 transition-colors', favorited ? 'text-red-500 fill-red-500' : 'text-gray-600')}
            viewBox="0 0 24 24"
            fill={favorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {instantBook && (
            <span className="badge bg-brand-600 text-white shadow-sm">
              <svg className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
              </svg>
              Instant Book
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type badge and location */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="badge bg-forest-50 text-forest-700 text-xs">
            {rvTypeLabel}
          </span>
          <div className="flex items-center gap-1">
            {petFriendly && (
              <span className="badge bg-sunset-50 text-sunset-700 text-xs" title="Pet Friendly">
                <svg className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.5 3a2.5 2.5 0 00-2.457 2.96l.37 2.022A2.5 2.5 0 006.87 10h.13a2.5 2.5 0 002.457-2.018l.37-2.022A2.5 2.5 0 006.5 3zM13.5 3a2.5 2.5 0 00-2.326 3.404l.87 2.174A2.5 2.5 0 0014.37 10h.13a2.5 2.5 0 002.326-3.404l-.87-2.174A2.5 2.5 0 0013.5 3zM3.5 9a2.5 2.5 0 00-2.457 2.96l.37 2.022A2.5 2.5 0 003.87 16h.13a2.5 2.5 0 002.457-2.018l.37-2.022A2.5 2.5 0 003.5 9zM16.5 9a2.5 2.5 0 00-2.326 3.404l.87 2.174A2.5 2.5 0 0017.37 16h.13a2.5 2.5 0 002.326-3.404l-.87-2.174A2.5 2.5 0 0016.5 9zM10 12a3 3 0 00-2.83 2.004l-.67 1.894A1.5 1.5 0 007.915 18h4.17a1.5 1.5 0 001.415-1.102l-.67-1.894A3 3 0 0010 12z" />
                </svg>
                Pets
              </span>
            )}
            {deliveryAvailable && (
              <span className="badge bg-sky-50 text-sky-700 text-xs" title="Delivery Available">
                <svg className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h-.5a.5.5 0 00-.5.5v2a2.5 2.5 0 005 0V11h8v2a2.5 2.5 0 005 0v-2a.5.5 0 00-.5-.5H18V6a1.5 1.5 0 00-1.5-1.5h-2.012c-.07-.755-.15-1.503-.238-2.243A1.5 1.5 0 0012.762 1H9.238a1.5 1.5 0 00-1.488 1.257C7.662 3.497 7.08 4.5 6.5 3z" />
                </svg>
                Delivery
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1 mb-1">
          {title}
        </h3>

        {/* Location and sleeps */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {location}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
            Sleeps {sleeps}
          </span>
        </div>

        {/* Rating and price */}
        <div className="flex items-center justify-between">
          <ReviewStars rating={rating} count={reviewCount} size="sm" />
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">{formatCents(displayRate)}</span>
            <span className="text-sm text-gray-500"> /night</span>
            {allInPrice && allInPrice !== nightlyRate && (
              <p className="text-xs text-gray-400">all-in price</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  /** Optional thumbnail for grid display (falls back to url) */
  thumbnailUrl?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Placeholder gradients for when no real images are loaded
// ---------------------------------------------------------------------------

const PLACEHOLDER_GRADIENTS = [
  'from-forest-300 to-forest-500',
  'from-forest-200 to-forest-400',
  'from-brand-200 to-brand-400',
  'from-forest-200 to-brand-300',
  'from-brand-300 to-forest-400',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  // Determine the display images: first 5 for the grid
  const gridImages = images.slice(0, 5);
  const totalCount = images.length;
  const hasMore = totalCount > 5;

  // -------------------------------------------------------------------------
  // Modal controls
  // -------------------------------------------------------------------------

  const openModal = useCallback((index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  }, [totalCount]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  }, [totalCount]);

  // Keyboard navigation
  useEffect(() => {
    if (!modalOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'Escape':
          closeModal();
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalOpen, goNext, goPrev, closeModal]);

  function handleImageError(id: string) {
    setImageLoadErrors((prev) => new Set(prev).add(id));
  }

  function renderImageOrPlaceholder(
    image: GalleryImage,
    index: number,
    sizeClass: string,
    placeholderIconClass: string,
  ) {
    const hasError = imageLoadErrors.has(image.id);
    const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

    if (hasError || !image.url) {
      return (
        <div
          className={cn(
            'h-full w-full flex flex-col items-center justify-center bg-gradient-to-br',
            gradient,
          )}
        >
          <svg
            className={cn('text-white/60', placeholderIconClass)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-white/70">{image.alt}</p>
        </div>
      );
    }

    return (
      <img
        src={image.thumbnailUrl || image.url}
        alt={image.alt}
        className={cn('h-full w-full object-cover', sizeClass)}
        loading={index === 0 ? 'eager' : 'lazy'}
        onError={() => handleImageError(image.id)}
      />
    );
  }

  // -------------------------------------------------------------------------
  // Render: Grid layout
  // -------------------------------------------------------------------------

  return (
    <>
      <div className={cn('relative', className)}>
        {/* Desktop: 1 large + 4 small grid */}
        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[400px] md:h-[480px]">
          {/* Main large image (spans 2 cols x 2 rows) */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 transition-opacity overflow-hidden"
            onClick={() => openModal(0)}
          >
            {gridImages[0] ? (
              renderImageOrPlaceholder(gridImages[0], 0, 'transition-transform duration-300 hover:scale-105', 'w-20 h-20')
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>

          {/* 4 smaller images */}
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="relative cursor-pointer hover:opacity-95 transition-opacity overflow-hidden"
              onClick={() => gridImages[idx] && openModal(idx)}
            >
              {gridImages[idx] ? (
                renderImageOrPlaceholder(gridImages[idx], idx, 'transition-transform duration-300 hover:scale-105', 'w-10 h-10')
              ) : (
                <div
                  className={cn(
                    'h-full w-full bg-gradient-to-br flex items-center justify-center',
                    PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length],
                  )}
                >
                  <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* "Show all photos" button */}
          {hasMore && (
            <button
              type="button"
              onClick={() => openModal(0)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-lg shadow transition-colors"
            >
              Show all {totalCount} photos
            </button>
          )}
        </div>

        {/* Mobile: stacked single image with counter */}
        <div className="sm:hidden relative rounded-2xl overflow-hidden">
          <div
            className="aspect-[4/3] cursor-pointer"
            onClick={() => openModal(activeIndex)}
          >
            {gridImages[0] ? (
              renderImageOrPlaceholder(gridImages[0], 0, '', 'w-16 h-16')
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>
          {totalCount > 1 && (
            <button
              type="button"
              onClick={() => openModal(0)}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
            >
              1 / {totalCount}
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Fullscreen Modal                                                     */}
      {/* ------------------------------------------------------------------- */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <button
              type="button"
              onClick={closeModal}
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            <span className="text-sm font-medium text-gray-300">
              {activeIndex + 1} of {totalCount}
            </span>

            <div className="w-16" /> {/* Spacer for centering */}
          </div>

          {/* Image area */}
          <div className="flex-1 relative flex items-center justify-center px-4 pb-4">
            {/* Left arrow */}
            {totalCount > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}

            {/* Current image */}
            <div className="max-w-5xl max-h-full w-full flex items-center justify-center">
              {images[activeIndex] ? (
                imageLoadErrors.has(images[activeIndex].id) ? (
                  <div
                    className={cn(
                      'w-full aspect-[4/3] max-h-[80vh] rounded-lg bg-gradient-to-br flex flex-col items-center justify-center',
                      PLACEHOLDER_GRADIENTS[activeIndex % PLACEHOLDER_GRADIENTS.length],
                    )}
                  >
                    <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                    <p className="mt-3 text-white/60 text-sm">{images[activeIndex].alt}</p>
                  </div>
                ) : (
                  <img
                    src={images[activeIndex].url}
                    alt={images[activeIndex].alt}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg"
                    onError={() => handleImageError(images[activeIndex].id)}
                  />
                )
              ) : null}
            </div>

            {/* Right arrow */}
            {totalCount > 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom thumbnail strip */}
          {totalCount > 1 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
                      idx === activeIndex
                        ? 'border-white opacity-100 scale-105'
                        : 'border-transparent opacity-50 hover:opacity-75',
                    )}
                  >
                    {imageLoadErrors.has(img.id) ? (
                      <div
                        className={cn(
                          'h-full w-full bg-gradient-to-br',
                          PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length],
                        )}
                      />
                    ) : (
                      <img
                        src={img.thumbnailUrl || img.url}
                        alt={img.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={() => handleImageError(img.id)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image caption */}
          {images[activeIndex]?.alt && (
            <div className="px-4 pb-4 text-center">
              <p className="text-sm text-gray-400">{images[activeIndex].alt}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

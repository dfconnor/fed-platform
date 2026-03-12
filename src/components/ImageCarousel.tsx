'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
}

export interface ImageCarouselProps {
  images: CarouselImage[];
  /** Aspect ratio class (default: aspect-[4/3]) */
  aspectRatio?: string;
  /** Show navigation arrows on hover (default: true) */
  showArrows?: boolean;
  /** Show dot indicators (default: true) */
  showDots?: boolean;
  /** Max dots shown before collapsing (default: 5) */
  maxDots?: number;
  className?: string;
  /** Click handler for the image itself (e.g. navigate to listing) */
  onImageClick?: () => void;
}

// ---------------------------------------------------------------------------
// Placeholder gradient backgrounds
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

export default function ImageCarousel({
  images,
  aspectRatio = 'aspect-[4/3]',
  showArrows = true,
  showDots = true,
  maxDots = 5,
  className,
  onImageClick,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const totalImages = images.length;

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
      setActiveIndex(index);

      // Pre-load adjacent images
      const toLoad = new Set(isLoaded);
      if (index > 0) toLoad.add(index - 1);
      toLoad.add(index);
      if (index < totalImages - 1) toLoad.add(index + 1);
      setIsLoaded(toLoad);
    },
    [totalImages, isLoaded],
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (activeIndex < totalImages - 1) {
        scrollToIndex(activeIndex + 1);
      }
    },
    [activeIndex, totalImages, scrollToIndex],
  );

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (activeIndex > 0) {
        scrollToIndex(activeIndex - 1);
      }
    },
    [activeIndex, scrollToIndex],
  );

  // -------------------------------------------------------------------------
  // Scroll snapping sync
  // -------------------------------------------------------------------------

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    function handleScroll() {
      if (!container) return;
      isScrolling.current = true;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling.current = false;
        const itemWidth = container.offsetWidth;
        const newIndex = Math.round(container.scrollLeft / itemWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalImages) {
          setActiveIndex(newIndex);

          // Lazy-load adjacent
          const toLoad = new Set(isLoaded);
          if (newIndex > 0) toLoad.add(newIndex - 1);
          toLoad.add(newIndex);
          if (newIndex < totalImages - 1) toLoad.add(newIndex + 1);
          setIsLoaded(toLoad);
        }
      }, 100);
    }

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [activeIndex, totalImages, isLoaded]);

  function handleImageError(index: number) {
    setImageErrors((prev) => new Set(prev).add(index));
  }

  // -------------------------------------------------------------------------
  // Dot indicators
  // -------------------------------------------------------------------------

  function renderDots() {
    if (!showDots || totalImages <= 1) return null;

    const dots: React.ReactNode[] = [];
    const showCount = Math.min(totalImages, maxDots);

    for (let i = 0; i < showCount; i++) {
      dots.push(
        <div
          key={i}
          className={cn(
            'h-1.5 w-1.5 rounded-full transition-colors',
            i === activeIndex ? 'bg-white' : 'bg-white/50',
          )}
        />,
      );
    }

    if (totalImages > maxDots) {
      dots.push(
        <div key="overflow" className="h-1.5 w-1.5 rounded-full bg-white/30" />,
      );
    }

    return (
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
        {dots}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  // Empty state
  if (totalImages === 0) {
    return (
      <div className={cn(aspectRatio, 'bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center rounded-xl overflow-hidden', className)}>
        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  // Single image
  if (totalImages === 1) {
    const img = images[0];
    return (
      <div
        className={cn(aspectRatio, 'relative overflow-hidden bg-gray-100', className)}
        onClick={onImageClick}
      >
        {imageErrors.has(0) ? (
          <div className={cn('h-full w-full bg-gradient-to-br flex items-center justify-center', PLACEHOLDER_GRADIENTS[0])}>
            <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        ) : (
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover"
            onError={() => handleImageError(0)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('group relative overflow-hidden', aspectRatio, className)}>
      {/* Scrollable image strip */}
      <div
        ref={scrollRef}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, idx) => (
          <div
            key={img.id}
            className="h-full w-full flex-shrink-0 snap-center"
            onClick={onImageClick}
          >
            {/* Lazy load: only render img tag if within load window */}
            {isLoaded.has(idx) || idx <= 1 ? (
              imageErrors.has(idx) ? (
                <div
                  className={cn(
                    'h-full w-full bg-gradient-to-br flex items-center justify-center',
                    PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length],
                  )}
                >
                  <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              ) : (
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(idx)}
                />
              )
            ) : (
              // Placeholder gradient while not yet loaded
              <div
                className={cn(
                  'h-full w-full bg-gradient-to-br animate-pulse',
                  PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length],
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows (visible on hover) */}
      {showArrows && totalImages > 1 && (
        <>
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              aria-label="Previous image"
            >
              <svg className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          {activeIndex < totalImages - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              aria-label="Next image"
            >
              <svg className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Dot indicators */}
      {renderDots()}
    </div>
  );
}

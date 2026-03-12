'use client';

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReviewStars from '@/components/ReviewStars';
import { RVType, RV_TYPE_LABELS, AMENITY_LABELS, formatCents } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface MockListing {
  id: string;
  title: string;
  slug: string;
  rvType: RVType;
  location: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  nightlyRate: number; // cents
  sleeps: number;
  year: number;
  length: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  instantBook: boolean;
  deliveryAvailable: boolean;
  amenities: string[];
  superhost: boolean;
  hostName: string;
}

const MOCK_LISTINGS: MockListing[] = [
  {
    id: '1',
    title: '2023 Thor Palazzo 37.5 Class A Diesel Pusher',
    slug: 'thor-palazzo-375-class-a',
    rvType: 'CLASS_A',
    location: 'Denver, CO',
    city: 'Denver',
    state: 'CO',
    lat: 39.7392,
    lng: -104.9903,
    nightlyRate: 27500,
    sleeps: 6,
    year: 2023,
    length: 38,
    imageUrl: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 47,
    instantBook: true,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'shower', 'toilet', 'tv', 'generator', 'solar', 'washer_dryer'],
    superhost: true,
    hostName: 'Mike R.',
  },
  {
    id: '2',
    title: '2022 Winnebago Solis 59PX Campervan',
    slug: 'winnebago-solis-59px',
    rvType: 'CAMPERVAN',
    location: 'Boulder, CO',
    city: 'Boulder',
    state: 'CO',
    lat: 40.015,
    lng: -105.2705,
    nightlyRate: 17500,
    sleeps: 2,
    year: 2022,
    length: 19,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 32,
    instantBook: true,
    deliveryAvailable: false,
    amenities: ['kitchen', 'ac', 'solar', 'wifi', 'shower'],
    superhost: true,
    hostName: 'Sarah L.',
  },
  {
    id: '3',
    title: '2021 Airstream International 25FB',
    slug: 'airstream-international-25fb',
    rvType: 'AIRSTREAM',
    location: 'Colorado Springs, CO',
    city: 'Colorado Springs',
    state: 'CO',
    lat: 38.8339,
    lng: -104.8214,
    nightlyRate: 22000,
    sleeps: 4,
    year: 2021,
    length: 25,
    imageUrl: 'https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?w=800&h=600&fit=crop',
    rating: 4.95,
    reviewCount: 61,
    instantBook: false,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'heating', 'shower', 'toilet', 'awning', 'tv'],
    superhost: true,
    hostName: 'James & Kelly T.',
  },
  {
    id: '4',
    title: '2020 Forest River Cherokee 274RK Travel Trailer',
    slug: 'forest-river-cherokee-274rk',
    rvType: 'TRAVEL_TRAILER',
    location: 'Estes Park, CO',
    city: 'Estes Park',
    state: 'CO',
    lat: 40.3772,
    lng: -105.5217,
    nightlyRate: 12500,
    sleeps: 6,
    year: 2020,
    length: 33,
    imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 19,
    instantBook: true,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'heating', 'toilet', 'awning', 'outdoor_kitchen', 'grill'],
    superhost: false,
    hostName: 'Tom B.',
  },
  {
    id: '5',
    title: '2024 Coachmen Beyond 22C Class B+',
    slug: 'coachmen-beyond-22c',
    rvType: 'CLASS_B',
    location: 'Fort Collins, CO',
    city: 'Fort Collins',
    state: 'CO',
    lat: 40.5853,
    lng: -105.0844,
    nightlyRate: 21000,
    sleeps: 2,
    year: 2024,
    length: 22,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    rating: 5.0,
    reviewCount: 8,
    instantBook: true,
    deliveryAvailable: false,
    amenities: ['kitchen', 'ac', 'solar', 'shower', 'toilet', 'wifi', 'backup_camera'],
    superhost: false,
    hostName: 'Diana M.',
  },
  {
    id: '6',
    title: '2019 Keystone Montana 3761FL Fifth Wheel',
    slug: 'keystone-montana-3761fl',
    rvType: 'FIFTH_WHEEL',
    location: 'Castle Rock, CO',
    city: 'Castle Rock',
    state: 'CO',
    lat: 39.3722,
    lng: -104.8561,
    nightlyRate: 15000,
    sleeps: 8,
    year: 2019,
    length: 40,
    imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 25,
    instantBook: false,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'heating', 'fireplace', 'washer_dryer', 'shower', 'toilet', 'tv', 'leveling_jacks'],
    superhost: true,
    hostName: 'Greg P.',
  },
  {
    id: '7',
    title: '2023 nuCamp TAB 320S Teardrop',
    slug: 'nucamp-tab-320s',
    rvType: 'TEARDROP',
    location: 'Golden, CO',
    city: 'Golden',
    state: 'CO',
    lat: 39.7555,
    lng: -105.2211,
    nightlyRate: 8500,
    sleeps: 2,
    year: 2023,
    length: 13,
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    rating: 4.85,
    reviewCount: 14,
    instantBook: true,
    deliveryAvailable: false,
    amenities: ['ac', 'kitchen', 'awning'],
    superhost: false,
    hostName: 'Lily W.',
  },
  {
    id: '8',
    title: '2022 Jayco Eagle HT 284BHOK Travel Trailer',
    slug: 'jayco-eagle-ht-284bhok',
    rvType: 'TRAVEL_TRAILER',
    location: 'Lakewood, CO',
    city: 'Lakewood',
    state: 'CO',
    lat: 39.7047,
    lng: -105.0814,
    nightlyRate: 14000,
    sleeps: 10,
    year: 2022,
    length: 34,
    imageUrl: 'https://images.unsplash.com/photo-1533745848184-3db07256e163?w=800&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 38,
    instantBook: true,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'heating', 'shower', 'toilet', 'awning', 'outdoor_kitchen', 'bike_rack'],
    superhost: false,
    hostName: 'Carlos & Maria G.',
  },
  {
    id: '9',
    title: '2021 Winnebago View 24D Class C',
    slug: 'winnebago-view-24d',
    rvType: 'CLASS_C',
    location: 'Aurora, CO',
    city: 'Aurora',
    state: 'CO',
    lat: 39.7294,
    lng: -104.8319,
    nightlyRate: 19500,
    sleeps: 4,
    year: 2021,
    length: 25,
    imageUrl: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=800&h=600&fit=crop',
    rating: 4.75,
    reviewCount: 52,
    instantBook: true,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'generator', 'shower', 'toilet', 'tv', 'backup_camera', 'awning'],
    superhost: true,
    hostName: 'Pat H.',
  },
  {
    id: '10',
    title: '2020 Grand Design Imagine 2800BH Travel Trailer',
    slug: 'grand-design-imagine-2800bh',
    rvType: 'TRAVEL_TRAILER',
    location: 'Arvada, CO',
    city: 'Arvada',
    state: 'CO',
    lat: 39.8028,
    lng: -105.0875,
    nightlyRate: 11500,
    sleeps: 8,
    year: 2020,
    length: 32,
    imageUrl: 'https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?w=800&h=600&fit=crop',
    rating: 4.4,
    reviewCount: 11,
    instantBook: false,
    deliveryAvailable: true,
    amenities: ['kitchen', 'ac', 'heating', 'shower', 'toilet', 'awning'],
    superhost: false,
    hostName: 'Ryan S.',
  },
  {
    id: '11',
    title: '2023 Storyteller Overland Mode 4x4 Campervan',
    slug: 'storyteller-overland-mode',
    rvType: 'CAMPERVAN',
    location: 'Littleton, CO',
    city: 'Littleton',
    state: 'CO',
    lat: 39.6133,
    lng: -105.0166,
    nightlyRate: 25000,
    sleeps: 2,
    year: 2023,
    length: 19,
    imageUrl: 'https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=800&h=600&fit=crop',
    rating: 4.92,
    reviewCount: 22,
    instantBook: true,
    deliveryAvailable: false,
    amenities: ['kitchen', 'solar', 'shower', 'wifi', 'heating', 'inverter'],
    superhost: true,
    hostName: 'Alex K.',
  },
  {
    id: '12',
    title: '2018 Lance 650 Truck Camper',
    slug: 'lance-650-truck-camper',
    rvType: 'TRUCK_CAMPER',
    location: 'Longmont, CO',
    city: 'Longmont',
    state: 'CO',
    lat: 40.1672,
    lng: -105.1019,
    nightlyRate: 9500,
    sleeps: 3,
    year: 2018,
    length: 11,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    rating: 4.3,
    reviewCount: 7,
    instantBook: false,
    deliveryAvailable: false,
    amenities: ['kitchen', 'ac', 'shower', 'toilet'],
    superhost: false,
    hostName: 'Ben F.',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterBar({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
}) {
  const [amenityOpen, setAmenityOpen] = useState(false);

  const amenityKeys = Object.keys(AMENITY_LABELS);

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="px-4 py-3 flex flex-wrap items-center gap-3">
        {/* RV Type */}
        <select
          className="input-field py-2 px-3 text-sm w-auto min-w-[140px]"
          value={filters.rvType || ''}
          onChange={(e) => onFilterChange({ rvType: (e.target.value as RVType) || undefined })}
        >
          <option value="">All RV Types</option>
          {Object.entries(RV_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Min $"
            className="input-field py-2 px-3 text-sm w-24"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max $"
            className="input-field py-2 px-3 text-sm w-24"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        {/* Sleeps */}
        <select
          className="input-field py-2 px-3 text-sm w-auto min-w-[110px]"
          value={filters.sleeps ?? ''}
          onChange={(e) =>
            onFilterChange({ sleeps: e.target.value ? Number(e.target.value) : undefined })
          }
        >
          <option value="">Sleeps</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n}>
              {n}+ guests
            </option>
          ))}
        </select>

        {/* Amenities Multi-Select */}
        <div className="relative">
          <button
            className="input-field py-2 px-3 text-sm text-left min-w-[130px] flex items-center justify-between gap-2"
            onClick={() => setAmenityOpen(!amenityOpen)}
          >
            <span>
              {filters.amenities.length > 0
                ? `${filters.amenities.length} amenities`
                : 'Amenities'}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {amenityOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-30 w-64 max-h-72 overflow-y-auto scrollbar-thin">
              {amenityKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    checked={filters.amenities.includes(key)}
                    onChange={() => {
                      const next = filters.amenities.includes(key)
                        ? filters.amenities.filter((a) => a !== key)
                        : [...filters.amenities, key];
                      onFilterChange({ amenities: next });
                    }}
                  />
                  <span className="text-sm text-gray-700">{AMENITY_LABELS[key]}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Instant Book Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className={cn(
              'relative w-10 h-6 rounded-full transition-colors',
              filters.instantBook ? 'bg-brand-600' : 'bg-gray-300'
            )}
            onClick={() => onFilterChange({ instantBook: !filters.instantBook })}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                filters.instantBook && 'translate-x-4'
              )}
            />
          </div>
          <span className="text-sm text-gray-700 whitespace-nowrap">Instant Book</span>
        </label>

        {/* Delivery Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className={cn(
              'relative w-10 h-6 rounded-full transition-colors',
              filters.delivery ? 'bg-brand-600' : 'bg-gray-300'
            )}
            onClick={() => onFilterChange({ delivery: !filters.delivery })}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                filters.delivery && 'translate-x-4'
              )}
            />
          </div>
          <span className="text-sm text-gray-700 whitespace-nowrap">Delivery</span>
        </label>

        {/* Sort */}
        <select
          className="input-field py-2 px-3 text-sm w-auto min-w-[140px] ml-auto"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
        >
          <option value="rating">Sort: Top Rated</option>
          <option value="price_asc">Sort: Price Low to High</option>
          <option value="price_desc">Sort: Price High to Low</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>
    </div>
  );
}

function RVCard({ listing }: { listing: MockListing }) {
  return (
    <Link href={`/listing/${listing.id}`} className="group">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.superhost && (
              <span className="badge bg-white text-forest-700 shadow-sm">Superhost</span>
            )}
            {listing.instantBook && (
              <span className="badge bg-sunset-500 text-white shadow-sm">Instant Book</span>
            )}
          </div>
          {/* Favorite button */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="badge bg-brand-50 text-brand-700">{RV_TYPE_LABELS[listing.rvType]}</span>
            <ReviewStars rating={listing.rating} count={listing.reviewCount} size="sm" />
          </div>
          <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1 group-hover:text-brand-700 transition-colors">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{listing.location}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>Sleeps {listing.sleeps}</span>
            <span className="text-gray-300">|</span>
            <span>{listing.length} ft</span>
            <span className="text-gray-300">|</span>
            <span>{listing.year}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-lg font-bold text-gray-900">{formatCents(listing.nightlyRate)}</span>
              <span className="text-sm text-gray-500"> / night</span>
            </div>
            {listing.deliveryAvailable && (
              <span className="text-xs text-brand-600 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21"
                  />
                </svg>
                Delivery
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 py-8">
      <button
        className="btn-ghost px-3 py-2 disabled:opacity-30"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[40px] h-10 rounded-xl text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-brand-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        className="btn-ghost px-3 py-2 disabled:opacity-30"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Filter State
// ---------------------------------------------------------------------------

interface FilterState {
  rvType?: RVType;
  minPrice?: number;
  maxPrice?: number;
  sleeps?: number;
  amenities: string[];
  instantBook: boolean;
  delivery: boolean;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page: number;
}

const ITEMS_PER_PAGE = 6;

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-brand-200 border-t-brand-600 rounded-full" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locationQuery = searchParams.get('location') || 'Denver, CO';

  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const [filters, setFilters] = useState<FilterState>({
    rvType: (searchParams.get('rvType') as RVType) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sleeps: searchParams.get('sleeps') ? Number(searchParams.get('sleeps')) : undefined,
    amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
    instantBook: searchParams.get('instantBook') === 'true',
    delivery: searchParams.get('delivery') === 'true',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'rating',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  });

  // Sync filter state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (locationQuery) params.set('location', locationQuery);
    if (filters.rvType) params.set('rvType', filters.rvType);
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters.sleeps !== undefined) params.set('sleeps', String(filters.sleeps));
    if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
    if (filters.instantBook) params.set('instantBook', 'true');
    if (filters.delivery) params.set('delivery', 'true');
    if (filters.sortBy !== 'rating') params.set('sortBy', filters.sortBy);
    if (filters.page > 1) params.set('page', String(filters.page));

    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [filters, locationQuery, router]);

  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  // Apply filters to mock data
  const filtered = useMemo(() => {
    let results = [...MOCK_LISTINGS];

    if (filters.rvType) {
      results = results.filter((l) => l.rvType === filters.rvType);
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((l) => l.nightlyRate >= filters.minPrice! * 100);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((l) => l.nightlyRate <= filters.maxPrice! * 100);
    }
    if (filters.sleeps !== undefined) {
      results = results.filter((l) => l.sleeps >= filters.sleeps!);
    }
    if (filters.amenities.length > 0) {
      results = results.filter((l) =>
        filters.amenities.every((a) => l.amenities.includes(a))
      );
    }
    if (filters.instantBook) {
      results = results.filter((l) => l.instantBook);
    }
    if (filters.delivery) {
      results = results.filter((l) => l.deliveryAvailable);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.nightlyRate - b.nightlyRate);
        break;
      case 'price_desc':
        results.sort((a, b) => b.nightlyRate - a.nightlyRate);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        results.sort((a, b) => b.year - a.year);
        break;
    }

    return results;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Mobile View Toggle */}
      <div className="flex md:hidden border-b border-gray-200 bg-white">
        <button
          className={cn(
            'flex-1 py-3 text-sm font-medium text-center transition-colors',
            mobileView === 'list'
              ? 'text-brand-600 border-b-2 border-brand-600'
              : 'text-gray-500'
          )}
          onClick={() => setMobileView('list')}
        >
          List View
        </button>
        <button
          className={cn(
            'flex-1 py-3 text-sm font-medium text-center transition-colors',
            mobileView === 'map'
              ? 'text-brand-600 border-b-2 border-brand-600'
              : 'text-gray-500'
          )}
          onClick={() => setMobileView('map')}
        >
          Map View
        </button>
      </div>

      {/* Main Content: List + Map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Listing Grid */}
        <div
          className={cn(
            'w-full md:w-[60%] overflow-y-auto scrollbar-thin',
            mobileView === 'map' && 'hidden md:block'
          )}
        >
          {/* Results Header */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> results near{' '}
              <span className="font-semibold text-gray-900">{locationQuery}</span>
            </p>
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
              {paginated.map((listing) => (
                <RVCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">No RVs found</h3>
              <p className="text-gray-500 mt-1 max-w-sm">
                Try adjusting your filters or searching in a different area.
              </p>
              <button
                className="btn-primary mt-4"
                onClick={() =>
                  setFilters({
                    amenities: [],
                    instantBook: false,
                    delivery: false,
                    sortBy: 'rating',
                    page: 1,
                  })
                }
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>

        {/* Map Panel */}
        <div
          className={cn(
            'md:w-[40%] bg-gray-100 relative border-l border-gray-200',
            mobileView === 'list' ? 'hidden md:block' : 'w-full md:w-[40%]'
          )}
        >
          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-forest-50">
            <div className="text-center">
              <svg
                className="w-20 h-20 text-forest-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
              </svg>
              <p className="text-forest-600 font-medium">Map View</p>
              <p className="text-sm text-forest-400 mt-1">Mapbox integration goes here</p>
            </div>

            {/* Mock map pins for each listing */}
            {filtered.map((listing, idx) => (
              <div
                key={listing.id}
                className="absolute bg-white text-brand-700 font-bold text-xs px-2 py-1 rounded-full shadow-md border border-brand-200 hover:bg-brand-600 hover:text-white cursor-pointer transition-colors"
                style={{
                  top: `${15 + (idx * 6) % 70}%`,
                  left: `${10 + (idx * 11) % 80}%`,
                }}
              >
                {formatCents(listing.nightlyRate)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

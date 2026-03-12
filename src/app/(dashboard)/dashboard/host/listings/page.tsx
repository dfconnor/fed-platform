'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ListingStatus = 'active' | 'draft' | 'paused';
type ViewMode = 'grid' | 'list';

interface Listing {
  id: string;
  title: string;
  type: string;
  location: string;
  pricePerNight: number;
  status: ListingStatus;
  views: number;
  bookings: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  image: string | null;
}

const mockListings: Listing[] = [
  {
    id: 'lst-001',
    title: '2024 Thor Chateau 31W',
    type: 'Class C Motorhome',
    location: 'Denver, CO',
    pricePerNight: 185,
    status: 'active',
    views: 1243,
    bookings: 23,
    revenue: 14580,
    rating: 4.92,
    reviewCount: 47,
    image: null,
  },
  {
    id: 'lst-002',
    title: '2023 Winnebago View 24D',
    type: 'Class C Motorhome',
    location: 'Denver, CO',
    pricePerNight: 210,
    status: 'active',
    views: 876,
    bookings: 15,
    revenue: 9450,
    rating: 4.85,
    reviewCount: 28,
    image: null,
  },
  {
    id: 'lst-003',
    title: '2022 Airstream Interstate 24GL',
    type: 'Class B Camper Van',
    location: 'Boulder, CO',
    pricePerNight: 275,
    status: 'active',
    views: 2105,
    bookings: 31,
    revenue: 22100,
    rating: 4.97,
    reviewCount: 62,
    image: null,
  },
  {
    id: 'lst-004',
    title: '2021 Forest River Cherokee 274WK',
    type: 'Travel Trailer',
    location: 'Denver, CO',
    pricePerNight: 125,
    status: 'paused',
    views: 432,
    bookings: 8,
    revenue: 3200,
    rating: 4.6,
    reviewCount: 12,
    image: null,
  },
  {
    id: 'lst-005',
    title: '2024 Coachmen Beyond 22D',
    type: 'Class B Camper Van',
    location: 'Colorado Springs, CO',
    pricePerNight: 195,
    status: 'draft',
    views: 0,
    bookings: 0,
    revenue: 0,
    rating: 0,
    reviewCount: 0,
    image: null,
  },
];

const statusConfig: Record<ListingStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-brand-100 text-brand-700' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  paused: { label: 'Paused', color: 'bg-sunset-100 text-sunset-700' },
};

export default function HostListingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredListings = filterStatus === 'all'
    ? mockListings
    : mockListings.filter((l) => l.status === filterStatus);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredListings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredListings.map((l) => l.id)));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{mockListings.length} listings total &middot; {mockListings.filter(l => l.status === 'active').length} active</p>
        </div>
        <Link href="/listing/new" className="btn-primary gap-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Add New Listing
        </Link>
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filterStatus === status
                  ? 'bg-forest-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && <span className="ml-1 text-xs opacity-70">({mockListings.length})</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
              <button className="btn-ghost !py-1.5 !px-3 !text-xs text-sunset-600 hover:text-sunset-700">Pause</button>
              <button className="btn-ghost !py-1.5 !px-3 !text-xs text-red-600 hover:text-red-700">Delete</button>
            </div>
          )}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600')}
              aria-label="Grid view"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" /></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600')}
              aria-label="List view"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Select all */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          Select all
        </label>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <div key={listing.id} className={cn('bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md', selectedIds.has(listing.id) ? 'border-brand-500 ring-1 ring-brand-500/20' : 'border-gray-200')}>
              {/* Image */}
              <div className="aspect-[16/10] bg-gradient-to-br from-forest-100 to-brand-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-12 w-12 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="22" height="12" rx="2" />
                    <path d="M6 18v2M18 18v2M1 12h22" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(listing.id)}
                    onChange={() => toggleSelect(listing.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 bg-white"
                  />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={cn('badge text-xs', statusConfig[listing.status].color)}>
                    {statusConfig[listing.status].label}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.type} &middot; {listing.location}</p>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-gray-900">${listing.pricePerNight}<span className="text-sm font-normal text-gray-500">/night</span></p>
                  {listing.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-sunset-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                      <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
                      <span className="text-xs text-gray-400">({listing.reviewCount})</span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>{listing.views.toLocaleString()} views</span>
                  <span>{listing.bookings} bookings</span>
                  <span className="font-medium text-gray-700">${listing.revenue.toLocaleString()} rev</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button className="btn-ghost flex-1 !py-1.5 !text-xs">Edit</button>
                  <button className="btn-ghost flex-1 !py-1.5 !text-xs">
                    {listing.status === 'paused' ? 'Activate' : 'Pause'}
                  </button>
                  <button className="btn-ghost !py-1.5 !text-xs !px-2">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
                  </button>
                  <button className="btn-ghost !py-1.5 !text-xs !px-2">
                    <svg className="h-4 w-4 text-red-400 hover:text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 3.68V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.78.72l.5 6a.75.75 0 01-1.49.12l-.5-6a.75.75 0 01.71-.84zm3.62.72a.75.75 0 10-1.49-.12l-.5 6a.75.75 0 101.49.12l.5-6z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className={cn('hover:bg-gray-50 transition-colors', selectedIds.has(listing.id) && 'bg-brand-50/30')}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                          <svg className="h-5 w-5 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="22" height="12" rx="2" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                          <p className="text-xs text-gray-500">{listing.type} &middot; {listing.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">${listing.pricePerNight}/night</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs', statusConfig[listing.status].color)}>
                        {statusConfig[listing.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{listing.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{listing.bookings}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${listing.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-ghost !py-1 !px-2 !text-xs">Edit</button>
                        <button className="btn-ghost !py-1 !px-2 !text-xs">
                          {listing.status === 'paused' ? 'Activate' : 'Pause'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

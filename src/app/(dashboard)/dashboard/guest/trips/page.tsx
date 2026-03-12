'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type TripTab = 'upcoming' | 'active' | 'past' | 'cancelled';
type TripStatus = 'upcoming' | 'active' | 'past' | 'cancelled';

interface Trip {
  id: string;
  rv: string;
  rvType: string;
  location: string;
  host: string;
  hostInitials: string;
  dates: string;
  startDate: string;
  endDate: string;
  nights: number;
  total: number;
  status: TripStatus;
  hasReview: boolean;
  rating: number | null;
  insurance: string;
  bookingRef: string;
  cancellationReason?: string;
}

const mockTrips: Trip[] = [
  // Upcoming
  {
    id: 'trip-201',
    rv: '2024 Thor Chateau 31W',
    rvType: 'Class C Motorhome',
    location: 'Denver, CO',
    host: 'Mike R.',
    hostInitials: 'MR',
    dates: 'Mar 22 - Mar 29, 2026',
    startDate: '2026-03-22',
    endDate: '2026-03-29',
    nights: 7,
    total: 1589,
    status: 'upcoming',
    hasReview: false,
    rating: null,
    insurance: 'Standard ($250K)',
    bookingRef: 'RRV-2026-0322-7WK4',
  },
  {
    id: 'trip-202',
    rv: '2023 Jayco Greyhawk 27U',
    rvType: 'Class C Motorhome',
    location: 'Moab, UT',
    host: 'Sandra K.',
    hostInitials: 'SK',
    dates: 'Apr 14 - Apr 19, 2026',
    startDate: '2026-04-14',
    endDate: '2026-04-19',
    nights: 5,
    total: 1250,
    status: 'upcoming',
    hasReview: false,
    rating: null,
    insurance: 'Premium ($1M)',
    bookingRef: 'RRV-2026-0414-3MBQ',
  },
  // Active
  {
    id: 'trip-200',
    rv: '2024 Winnebago Travato 59KL',
    rvType: 'Class B Camper Van',
    location: 'Zion National Park, UT',
    host: 'Greg P.',
    hostInitials: 'GP',
    dates: 'Mar 8 - Mar 15, 2026',
    startDate: '2026-03-08',
    endDate: '2026-03-15',
    nights: 7,
    total: 1680,
    status: 'active',
    hasReview: false,
    rating: null,
    insurance: 'Standard ($250K)',
    bookingRef: 'RRV-2026-0308-9ZNP',
  },
  // Past
  {
    id: 'trip-195',
    rv: '2022 Winnebago Solis 59PX',
    rvType: 'Class B Camper Van',
    location: 'Sedona, AZ',
    host: 'Tom B.',
    hostInitials: 'TB',
    dates: 'Feb 8 - Feb 12, 2026',
    startDate: '2026-02-08',
    endDate: '2026-02-12',
    nights: 4,
    total: 980,
    status: 'past',
    hasReview: false,
    rating: null,
    insurance: 'Basic ($50K)',
    bookingRef: 'RRV-2026-0208-4SED',
  },
  {
    id: 'trip-188',
    rv: '2023 Airstream Basecamp 20',
    rvType: 'Travel Trailer',
    location: 'Joshua Tree, CA',
    host: 'Laura M.',
    hostInitials: 'LM',
    dates: 'Jan 15 - Jan 20, 2026',
    startDate: '2026-01-15',
    endDate: '2026-01-20',
    nights: 5,
    total: 1125,
    status: 'past',
    hasReview: true,
    rating: 5,
    insurance: 'Standard ($250K)',
    bookingRef: 'RRV-2026-0115-5JTR',
  },
  {
    id: 'trip-180',
    rv: '2022 Thor Gemini 23TW',
    rvType: 'Class B+ Motorhome',
    location: 'Big Sur, CA',
    host: 'Pat D.',
    hostInitials: 'PD',
    dates: 'Dec 20 - Dec 27, 2025',
    startDate: '2025-12-20',
    endDate: '2025-12-27',
    nights: 7,
    total: 1890,
    status: 'past',
    hasReview: true,
    rating: 4,
    insurance: 'Premium ($1M)',
    bookingRef: 'RRV-2025-1220-7BSR',
  },
  // Cancelled
  {
    id: 'trip-185',
    rv: '2023 Entegra Coach Odyssey 24B',
    rvType: 'Class C Motorhome',
    location: 'Yellowstone, WY',
    host: 'Nancy L.',
    hostInitials: 'NL',
    dates: 'Nov 10 - Nov 17, 2025',
    startDate: '2025-11-10',
    endDate: '2025-11-17',
    nights: 7,
    total: 1645,
    status: 'cancelled',
    hasReview: false,
    rating: null,
    insurance: 'Standard ($250K)',
    bookingRef: 'RRV-2025-1110-7YST',
    cancellationReason: 'Weather conditions - Full refund issued',
  },
];

const statusConfig: Record<TripStatus, { label: string; color: string }> = {
  upcoming: { label: 'Confirmed', color: 'bg-brand-100 text-brand-700' },
  active: { label: 'Active', color: 'bg-sky-100 text-sky-700' },
  past: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function GuestTripsPage() {
  const [activeTab, setActiveTab] = useState<TripTab>('upcoming');

  const filteredTrips = mockTrips.filter((t) => t.status === activeTab);

  const tabCounts: Record<TripTab, number> = {
    upcoming: mockTrips.filter((t) => t.status === 'upcoming').length,
    active: mockTrips.filter((t) => t.status === 'active').length,
    past: mockTrips.filter((t) => t.status === 'past').length,
    cancelled: mockTrips.filter((t) => t.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <p className="text-sm text-gray-500 mt-1">{mockTrips.length} total trips</p>
        </div>
        <Link href="/search" className="btn-primary gap-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 6z" />
            <path fillRule="evenodd" d="M2 9.5a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9.5zM9.5 4a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clipRule="evenodd" />
          </svg>
          Book Another Trip
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-thin">
          {(['upcoming', 'active', 'past', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tabCounts[tab] > 0 && (
                <span
                  className={cn(
                    'ml-2 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full text-[10px] font-bold px-1.5',
                    activeTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Cards */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="22" height="12" rx="2" />
            <path d="M6 18v2M18 18v2M1 12h22" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">No {activeTab} trips</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'upcoming'
              ? 'Time to plan your next adventure!'
              : `You don't have any ${activeTab} trips.`}
          </p>
          {activeTab === 'upcoming' && (
            <Link href="/search" className="btn-primary mt-4 inline-flex">
              Browse RVs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                {/* RV Image */}
                <div className="w-full sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                  <svg className="h-12 w-12 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="22" height="12" rx="2" />
                    <path d="M6 18v2M18 18v2M1 12h22M6 6V4M14 6V4" />
                  </svg>
                </div>

                {/* Trip Details */}
                <div className="flex-1 p-5 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn('badge text-xs', statusConfig[trip.status].color)}>
                          {statusConfig[trip.status].label}
                        </span>
                        {trip.status === 'upcoming' && (
                          <span className="inline-flex items-center gap-1 badge bg-brand-50 text-brand-700 text-xs">
                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>
                            {getDaysUntil(trip.startDate)} days to go
                          </span>
                        )}
                        {trip.status === 'active' && (
                          <span className="badge bg-sunset-50 text-sunset-700 text-xs animate-pulse">
                            Trip in progress
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg truncate">{trip.rv}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{trip.rvType} &middot; {trip.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-900">${trip.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{trip.nights} nights</p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Dates</p>
                      <p className="text-sm text-gray-900 mt-0.5">{trip.dates}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Host</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="h-5 w-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-[9px] font-semibold">
                          {trip.hostInitials}
                        </div>
                        <span className="text-sm text-gray-900">{trip.host}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Insurance</p>
                      <p className="text-sm text-gray-900 mt-0.5">{trip.insurance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Booking Ref</p>
                      <p className="text-sm font-mono text-brand-600 mt-0.5">{trip.bookingRef}</p>
                    </div>
                  </div>

                  {/* Cancellation reason */}
                  {trip.cancellationReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs text-red-600">{trip.cancellationReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    {trip.status === 'upcoming' && (
                      <>
                        <Link href="/dashboard/messages" className="btn-primary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" /><path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.942V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" /></svg>
                          Message Host
                        </Link>
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75z" clipRule="evenodd" /></svg>
                          View Insurance
                        </button>
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                          Download Docs
                        </button>
                        <button className="btn-ghost !py-2 !px-4 !text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                          Cancel Trip
                        </button>
                      </>
                    )}
                    {trip.status === 'active' && (
                      <>
                        <Link href="/dashboard/messages" className="btn-primary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" /><path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.942V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" /></svg>
                          Message Host
                        </Link>
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75z" clipRule="evenodd" /></svg>
                          View Insurance
                        </button>
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                          Emergency Assist
                        </button>
                      </>
                    )}
                    {trip.status === 'past' && (
                      <>
                        {trip.hasReview ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                  key={i}
                                  className={cn('h-3.5 w-3.5', i < (trip.rating || 0) ? 'text-sunset-400' : 'text-gray-300')}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Your review</span>
                          </div>
                        ) : (
                          <button className="btn-primary !py-2 !px-4 !text-xs gap-1.5 !bg-sunset-500 hover:!bg-sunset-600">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                            Leave a Review
                          </button>
                        )}
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.06-.179zm-10.624-3.85a5.5 5.5 0 019.201-2.465l.312.311H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V2.536a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 002.63 7.396a.75.75 0 001.06.178z" clipRule="evenodd" /></svg>
                          Rebook
                        </button>
                        <Link href="/dashboard/messages" className="btn-ghost !py-2 !px-4 !text-xs">
                          Message Host
                        </Link>
                      </>
                    )}
                    {trip.status === 'cancelled' && (
                      <>
                        <button className="btn-secondary !py-2 !px-4 !text-xs gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.06-.179zm-10.624-3.85a5.5 5.5 0 019.201-2.465l.312.311H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V2.536a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 002.63 7.396a.75.75 0 001.06.178z" clipRule="evenodd" /></svg>
                          Rebook Similar
                        </button>
                        <Link href="/search" className="btn-ghost !py-2 !px-4 !text-xs">
                          Browse RVs
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

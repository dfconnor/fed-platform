'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const upcomingTrips = [
  {
    id: 'trip-001',
    rv: '2024 Thor Chateau 31W',
    type: 'Class C Motorhome',
    location: 'Denver, CO',
    host: 'Mike R.',
    hostInitials: 'MR',
    dates: 'Mar 22 - Mar 29, 2026',
    daysUntil: 11,
    status: 'confirmed',
    total: '$1,589.00',
    insurance: 'Standard',
  },
  {
    id: 'trip-002',
    rv: '2023 Jayco Greyhawk 27U',
    type: 'Class C Motorhome',
    location: 'Moab, UT',
    host: 'Sandra K.',
    hostInitials: 'SK',
    dates: 'Apr 14 - Apr 19, 2026',
    daysUntil: 34,
    status: 'confirmed',
    total: '$1,250.00',
    insurance: 'Premium',
  },
];

const pastTrips = [
  {
    id: 'trip-past-001',
    rv: '2022 Winnebago Solis 59PX',
    type: 'Class B Camper Van',
    location: 'Sedona, AZ',
    host: 'Tom B.',
    hostInitials: 'TB',
    dates: 'Feb 8 - Feb 12, 2026',
    status: 'completed',
    total: '$980.00',
    hasReview: false,
    rating: null,
  },
  {
    id: 'trip-past-002',
    rv: '2023 Airstream Basecamp 20',
    type: 'Travel Trailer',
    location: 'Joshua Tree, CA',
    host: 'Laura M.',
    hostInitials: 'LM',
    dates: 'Jan 15 - Jan 20, 2026',
    status: 'completed',
    total: '$1,125.00',
    hasReview: true,
    rating: 5,
  },
];

const savedRVs = [
  { id: 'fav-1', title: '2024 Coachmen Beyond 22D', type: 'Class B', price: 195, location: 'Aspen, CO', rating: 4.95 },
  { id: 'fav-2', title: '2023 Thor Sequence 20L', type: 'Class B', price: 165, location: 'Flagstaff, AZ', rating: 4.88 },
  { id: 'fav-3', title: '2024 Winnebago Ekko 22A', type: 'Class C', price: 245, location: 'Bend, OR', rating: 4.91 },
];

const recentMessages = [
  {
    from: 'Mike R.',
    initials: 'MR',
    message: 'Great! See you on the 22nd. I will have everything ready for you.',
    time: '3h ago',
    unread: true,
  },
  {
    from: 'Sandra K.',
    initials: 'SK',
    message: 'Perfect timing for Moab! The weather should be beautiful in April.',
    time: '1d ago',
    unread: false,
  },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-sunset-100 text-sunset-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function GuestDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, John! Here&apos;s your trip overview.</p>
        </div>
        <Link href="/search" className="btn-primary gap-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 6z" /><path fillRule="evenodd" d="M2 9.5a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9.5zM9.5 4a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clipRule="evenodd" /></svg>
          Browse RVs
        </Link>
      </div>

      {/* Upcoming Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Trips</h2>
          <Link href="/dashboard/guest/trips" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                {/* Image placeholder */}
                <div className="w-32 sm:w-40 bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                  <svg className="h-10 w-10 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="22" height="12" rx="2" />
                    <path d="M6 18v2M18 18v2M1 12h22" />
                  </svg>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{trip.rv}</h3>
                      <p className="text-xs text-gray-500">{trip.type} &middot; {trip.location}</p>
                    </div>
                    <span className={cn('badge text-[10px] shrink-0', statusColors[trip.status])}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
                    {trip.dates}
                  </div>

                  {/* Countdown */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-semibold">{trip.daysUntil} days to go!</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-[10px] font-semibold">
                        {trip.hostInitials}
                      </div>
                      <span className="text-xs text-gray-500">Hosted by {trip.host}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href="/dashboard/messages" className="btn-ghost !py-1 !px-2 !text-[10px]">Message</Link>
                      <Link href={`/dashboard/guest/trips`} className="btn-ghost !py-1 !px-2 !text-[10px] text-brand-600">Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Trips + Messages Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Past Trips */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Past Trips</h2>
            <Link href="/dashboard/guest/trips?tab=past" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pastTrips.map((trip) => (
              <div key={trip.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-forest-100 to-brand-100 flex items-center justify-center shrink-0">
                  <svg className="h-6 w-6 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="22" height="12" rx="2" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{trip.rv}</p>
                  <p className="text-xs text-gray-500">{trip.dates} &middot; {trip.location}</p>
                </div>
                <div className="shrink-0 text-right">
                  {trip.hasReview ? (
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-sunset-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                      <span className="text-sm font-medium text-gray-700">{trip.rating}</span>
                    </div>
                  ) : (
                    <button className="btn-ghost !py-1 !px-2.5 !text-xs text-brand-600 bg-brand-50 hover:bg-brand-100">
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Messages</h2>
            <Link href="/dashboard/messages" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMessages.map((msg, i) => (
              <div key={i} className={cn('p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors', msg.unread && 'bg-brand-50/30')}>
                <div className="h-10 w-10 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-medium truncate', msg.unread ? 'text-gray-900' : 'text-gray-700')}>
                      {msg.from}
                    </p>
                    {msg.unread && <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <Link href="/dashboard/messages" className="btn-secondary w-full !text-sm">
              View All Messages
            </Link>
          </div>
        </div>
      </div>

      {/* Saved RVs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Saved RVs</h2>
          <Link href="/search" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {savedRVs.map((rv) => (
            <div key={rv.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-[16/10] bg-gradient-to-br from-forest-100 to-brand-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-10 w-10 text-forest-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="22" height="12" rx="2" /><path d="M6 18v2M18 18v2M1 12h22" /></svg>
                </div>
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" /></svg>
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{rv.title}</h3>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <svg className="h-3.5 w-3.5 text-sunset-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
                    <span className="text-xs font-medium text-gray-700">{rv.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{rv.type} &middot; {rv.location}</p>
                <p className="text-sm font-bold text-gray-900 mt-2">${rv.price}<span className="text-xs font-normal text-gray-500">/night</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Insurance Link */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75zm4.196 5.954a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Trip Insurance</p>
            <p className="text-xs text-gray-500">View and manage your insurance coverage for all trips</p>
          </div>
        </div>
        <Link href="/policies/insurance" className="btn-ghost text-brand-600 !text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}

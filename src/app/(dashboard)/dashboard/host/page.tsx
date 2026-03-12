'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: 'Total Earnings',
    value: '$24,850',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: (
      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" /><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.214.14.462.245.737.332V10.7a5.048 5.048 0 01-1.959-.696C4.726 9.49 4.222 8.733 4.222 7.874c0-.86.504-1.617 1.29-2.13A5.048 5.048 0 017.47 5.051v-.3A.75.75 0 018.22 4h.03z" clipRule="evenodd" /></svg>
    ),
  },
  {
    label: 'Active Bookings',
    value: '8',
    change: '+3',
    changeType: 'positive' as const,
    icon: (
      <svg className="h-6 w-6 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
    ),
  },
  {
    label: 'Average Rating',
    value: '4.92',
    change: '+0.03',
    changeType: 'positive' as const,
    icon: (
      <svg className="h-6 w-6 text-sunset-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
    ),
  },
  {
    label: 'Response Rate',
    value: '98%',
    change: '+2%',
    changeType: 'positive' as const,
    icon: (
      <svg className="h-6 w-6 text-forest-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
    ),
  },
];

const earningsData = [
  { month: 'Sep', amount: 2400 },
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 2800 },
  { month: 'Dec', amount: 1800 },
  { month: 'Jan', amount: 3600 },
  { month: 'Feb', amount: 4100 },
  { month: 'Mar', amount: 3850 },
];
const maxEarning = Math.max(...earningsData.map((d) => d.amount));

const upcomingBookings = [
  {
    id: 'BK-2401',
    guest: { name: 'Sarah M.', initials: 'SM', avatar: null },
    rv: '2024 Thor Chateau 31W',
    dates: 'Mar 22 - Mar 29',
    total: '$1,589.00',
    status: 'confirmed',
  },
  {
    id: 'BK-2402',
    guest: { name: 'David L.', initials: 'DL', avatar: null },
    rv: '2023 Winnebago View 24D',
    dates: 'Apr 2 - Apr 9',
    total: '$2,135.00',
    status: 'confirmed',
  },
  {
    id: 'BK-2403',
    guest: { name: 'Emily R.', initials: 'ER', avatar: null },
    rv: '2024 Thor Chateau 31W',
    dates: 'Apr 15 - Apr 18',
    total: '$795.00',
    status: 'pending',
  },
  {
    id: 'BK-2404',
    guest: { name: 'James K.', initials: 'JK', avatar: null },
    rv: '2022 Airstream Interstate 24GL',
    dates: 'Apr 22 - Apr 30',
    total: '$3,240.00',
    status: 'confirmed',
  },
];

const recentMessages = [
  {
    from: 'Sarah M.',
    initials: 'SM',
    message: 'Hi! Quick question about the generator - does it run on propane or gas?',
    time: '2h ago',
    unread: true,
  },
  {
    from: 'David L.',
    initials: 'DL',
    message: 'Thanks for confirming! We are really looking forward to the trip.',
    time: '5h ago',
    unread: false,
  },
  {
    from: 'Emily R.',
    initials: 'ER',
    message: 'Is it possible to pick up a day early? Happy to pay the extra night.',
    time: '1d ago',
    unread: true,
  },
];

const statusColors: Record<string, string> = {
  confirmed: 'bg-brand-100 text-brand-700',
  pending: 'bg-sunset-100 text-sunset-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function HostDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, John! Here&apos;s your hosting overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/host/listings" className="btn-secondary !py-2 !px-4 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
            Add Listing
          </Link>
          <Link href="/dashboard/host/earnings" className="btn-ghost !py-2 gap-2">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.016H4.48c-.075.01-.152.016-.23.016h-1.5A1.75 1.75 0 011 15.265V4.75z" clipRule="evenodd" /></svg>
            Manage Payouts
          </Link>
        </div>
      </div>

      {/* Fee comparison callout */}
      <div className="bg-gradient-to-r from-brand-600 to-forest-700 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="font-semibold">Your host fee: just 5%</p>
              <p className="text-sm text-white/80">You&apos;ve saved <span className="font-bold text-white">$4,970</span> compared to Outdoorsy&apos;s 25% fee this year</p>
            </div>
          </div>
          <span className="badge bg-white/20 text-white border border-white/20">5% vs 25%</span>
        </div>
      </div>

      {/* Host Tier */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sunset-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-sunset-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Gold Host</p>
              <p className="text-xs text-gray-500">47 completed trips &middot; 4.92 avg rating</p>
            </div>
          </div>
          <span className="badge bg-sunset-100 text-sunset-700 text-xs">Gold</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Progress to Platinum</span>
            <span className="font-medium text-gray-700">47/75 trips</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sunset-400 to-sunset-500 rounded-full" style={{ width: '63%' }} />
          </div>
          <p className="text-xs text-gray-400">28 more trips to reach Platinum tier</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  stat.changeType === 'positive' ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-700'
                )}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Earnings Chart + Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Earnings Overview</h2>
            <Link href="/dashboard/host/earnings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View All
            </Link>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between gap-2 h-48">
              {earningsData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">${(d.amount / 1000).toFixed(1)}k</span>
                  <div className="w-full flex justify-center">
                    <div
                      className="w-8 sm:w-10 rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all hover:from-brand-700 hover:to-brand-500"
                      style={{ height: `${(d.amount / maxEarning) * 140}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming Bookings</h2>
            <span className="badge bg-sky-100 text-sky-700">{upcomingBookings.length} upcoming</span>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {booking.guest.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{booking.guest.name}</p>
                    <span className={cn('badge text-[10px] py-0.5', statusColors[booking.status])}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{booking.rv} &middot; {booking.dates}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 shrink-0">{booking.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Messages</h2>
          <Link href="/dashboard/messages" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View All
          </Link>
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/host/listings" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
            <svg className="h-6 w-6 text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Add Listing</p>
            <p className="text-xs text-gray-500">List a new RV for rent</p>
          </div>
        </Link>
        <Link href="/dashboard/host/listings" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
            <svg className="h-6 w-6 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">View Calendar</p>
            <p className="text-xs text-gray-500">Manage availability</p>
          </div>
        </Link>
        <Link href="/dashboard/host/earnings" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
          <div className="h-12 w-12 rounded-xl bg-forest-50 flex items-center justify-center shrink-0 group-hover:bg-forest-100 transition-colors">
            <svg className="h-6 w-6 text-forest-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.016H4.48c-.075.01-.152.016-.23.016h-1.5A1.75 1.75 0 011 15.265V4.75z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Manage Payouts</p>
            <p className="text-xs text-gray-500">View earnings & payouts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

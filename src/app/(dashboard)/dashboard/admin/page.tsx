'use client';

import { useState } from 'react';

// Admin analytics dashboard — platform-wide metrics for the site owner
// PostHog provides the detailed user journey / funnel / session replay analytics
// This dashboard shows business metrics at a glance

const MOCK_STATS = {
  totalUsers: 2847,
  totalHosts: 312,
  totalListings: 489,
  activeListings: 421,
  totalBookings: 1893,
  activeBookings: 47,
  totalRevenue: 284750000, // cents
  platformRevenue: 14237500, // 5% of total
  monthlyRevenue: 3240000,
  avgBookingValue: 150400,
  conversionRate: 3.8,
  avgRating: 4.72,
  repeatBookingRate: 34,
};

const MONTHLY_DATA = [
  { month: 'Sep', bookings: 142, revenue: 2135000, users: 198 },
  { month: 'Oct', bookings: 168, revenue: 2520000, users: 234 },
  { month: 'Nov', bookings: 121, revenue: 1815000, users: 189 },
  { month: 'Dec', bookings: 195, revenue: 2925000, users: 312 },
  { month: 'Jan', bookings: 156, revenue: 2340000, users: 267 },
  { month: 'Feb', bookings: 183, revenue: 2745000, users: 298 },
  { month: 'Mar', bookings: 216, revenue: 3240000, users: 349 },
];

const TOP_LISTINGS = [
  { title: 'Luxury Class A Motorhome', host: 'Sarah Johnson', bookings: 52, revenue: 983400, rating: 4.9 },
  { title: 'Vintage Airstream', host: 'Mike Chen', bookings: 38, revenue: 475000, rating: 4.8 },
  { title: 'Cozy Campervan', host: 'Jessica Martinez', bookings: 25, revenue: 237500, rating: 5.0 },
  { title: 'Family Class C', host: 'Jessica Martinez', bookings: 22, revenue: 349800, rating: 4.7 },
  { title: 'Beach Travel Trailer', host: 'Sarah Johnson', bookings: 41, revenue: 348500, rating: 4.9 },
];

const TOP_DESTINATIONS = [
  { city: 'Denver, CO', bookings: 89, revenue: 1335000 },
  { city: 'Austin, TX', bookings: 76, revenue: 950000 },
  { city: 'San Diego, CA', bookings: 71, revenue: 603500 },
  { city: 'Portland, OR', bookings: 64, revenue: 608000 },
  { city: 'Nashville, TN', bookings: 58, revenue: 841000 },
];

const FUNNEL_DATA = [
  { step: 'Homepage Visit', count: 48920, rate: 100 },
  { step: 'Search Performed', count: 18450, rate: 37.7 },
  { step: 'Listing Viewed', count: 12340, rate: 25.2 },
  { step: 'Booking Started', count: 3102, rate: 6.3 },
  { step: 'Insurance Selected', count: 2680, rate: 5.5 },
  { step: 'Checkout Started', count: 2190, rate: 4.5 },
  { step: 'Payment Completed', count: 1893, rate: 3.9 },
];

function StatCard({ label, value, subtext, trend }: {
  label: string; value: string; subtext?: string; trend?: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-brand-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-sm text-gray-500">{subtext}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Admin dashboard &middot; Real-time platform metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                period === p ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {p}
            </button>
          ))}
          <a href={process.env.NEXT_PUBLIC_POSTHOG_HOST || '#'}
            target="_blank" rel="noopener noreferrer"
            className="ml-2 btn-secondary text-sm py-1.5 px-3">
            Open PostHog
          </a>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`$${(MOCK_STATS.totalRevenue / 100).toLocaleString()}`}
          subtext="All-time GMV" trend={18} />
        <StatCard label="Platform Revenue" value={`$${(MOCK_STATS.platformRevenue / 100).toLocaleString()}`}
          subtext="5% platform fees" trend={22} />
        <StatCard label="Total Bookings" value={MOCK_STATS.totalBookings.toLocaleString()} trend={15} />
        <StatCard label="Avg. Booking Value" value={`$${(MOCK_STATS.avgBookingValue / 100).toLocaleString()}`} trend={4} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={MOCK_STATS.totalUsers.toLocaleString()} trend={12} />
        <StatCard label="Active Hosts" value={MOCK_STATS.totalHosts.toLocaleString()} trend={8} />
        <StatCard label="Active Listings" value={MOCK_STATS.activeListings.toLocaleString()} trend={6} />
        <StatCard label="Conversion Rate" value={`${MOCK_STATS.conversionRate}%`} trend={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="space-y-3">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="w-10 text-sm text-gray-500 font-medium">{d.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-brand-400 h-full rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}>
                    <span className="text-xs font-medium text-white">
                      ${(d.revenue / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="w-16 text-sm text-gray-500 text-right">{d.bookings} trips</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Funnel */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Booking Funnel</h2>
          <p className="text-sm text-gray-500 mb-4">Last 30 days &middot; Detailed funnels in PostHog</p>
          <div className="space-y-3">
            {FUNNEL_DATA.map((step, i) => (
              <div key={step.step}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{step.step}</span>
                  <span className="text-gray-500">{step.count.toLocaleString()} ({step.rate}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      i === FUNNEL_DATA.length - 1
                        ? 'bg-gradient-to-r from-brand-500 to-brand-400'
                        : 'bg-gradient-to-r from-sky-400 to-sky-300'
                    }`}
                    style={{ width: `${step.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Listings */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Listing</th>
                  <th className="pb-2 font-medium text-right">Trips</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                  <th className="pb-2 font-medium text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TOP_LISTINGS.map((l) => (
                  <tr key={l.title}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{l.title}</p>
                      <p className="text-gray-500 text-xs">{l.host}</p>
                    </td>
                    <td className="py-3 text-right text-gray-700">{l.bookings}</td>
                    <td className="py-3 text-right text-gray-700">${(l.revenue / 100).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="text-brand-600 font-medium">{l.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Destinations</h2>
          <div className="space-y-4">
            {TOP_DESTINATIONS.map((d, i) => (
              <div key={d.city} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{d.city}</p>
                  <p className="text-xs text-gray-500">{d.bookings} bookings</p>
                </div>
                <p className="text-sm font-medium text-gray-700">${(d.revenue / 100).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Health */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <p className="text-sm text-gray-500">Avg. Rating</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.avgRating}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Repeat Rate</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.repeatBookingRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.activeBookings}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold text-brand-600">${(MOCK_STATS.monthlyRevenue / 100).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.activeListings}</p>
          </div>
        </div>
      </div>

      {/* PostHog Integration Note */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-purple-900">Detailed Analytics via PostHog</h3>
            <p className="text-sm text-purple-700 mt-1">
              For user journeys, session replays, A/B tests, feature flags, and AI-powered insights,
              visit the PostHog dashboard. Self-hosted and open-source — your data stays on your servers.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {['User Journeys', 'Session Replay', 'Funnels', 'Cohorts', 'A/B Testing', 'Feature Flags', 'SQL Queries'].map((f) => (
                <span key={f} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

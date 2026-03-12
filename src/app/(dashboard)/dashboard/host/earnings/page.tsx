'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type PayoutStatus = 'completed' | 'pending' | 'processing';
type TimePeriod = 'all' | 'month' | 'quarter' | 'year';

interface Transaction {
  id: string;
  date: string;
  bookingRef: string;
  guest: string;
  guestInitials: string;
  amount: number;
  fee: number;
  payout: number;
  status: PayoutStatus;
}

const mockTransactions: Transaction[] = [
  { id: 'txn-001', date: 'Mar 10, 2026', bookingRef: 'BK-2398', guest: 'Lisa W.', guestInitials: 'LW', amount: 1295.00, fee: 64.75, payout: 1230.25, status: 'completed' },
  { id: 'txn-002', date: 'Mar 8, 2026', bookingRef: 'BK-2395', guest: 'Robert P.', guestInitials: 'RP', amount: 2100.00, fee: 105.00, payout: 1995.00, status: 'completed' },
  { id: 'txn-003', date: 'Mar 5, 2026', bookingRef: 'BK-2390', guest: 'Amanda T.', guestInitials: 'AT', amount: 875.00, fee: 43.75, payout: 831.25, status: 'processing' },
  { id: 'txn-004', date: 'Mar 1, 2026', bookingRef: 'BK-2387', guest: 'Kevin S.', guestInitials: 'KS', amount: 1680.00, fee: 84.00, payout: 1596.00, status: 'completed' },
  { id: 'txn-005', date: 'Feb 25, 2026', bookingRef: 'BK-2380', guest: 'Maria G.', guestInitials: 'MG', amount: 3150.00, fee: 157.50, payout: 2992.50, status: 'completed' },
  { id: 'txn-006', date: 'Feb 20, 2026', bookingRef: 'BK-2375', guest: 'Chris B.', guestInitials: 'CB', amount: 945.00, fee: 47.25, payout: 897.75, status: 'completed' },
  { id: 'txn-007', date: 'Feb 14, 2026', bookingRef: 'BK-2370', guest: 'Jennifer H.', guestInitials: 'JH', amount: 2450.00, fee: 122.50, payout: 2327.50, status: 'completed' },
  { id: 'txn-008', date: 'Feb 8, 2026', bookingRef: 'BK-2365', guest: 'Daniel F.', guestInitials: 'DF', amount: 1100.00, fee: 55.00, payout: 1045.00, status: 'completed' },
  { id: 'txn-009', date: 'Jan 30, 2026', bookingRef: 'BK-2355', guest: 'Olivia M.', guestInitials: 'OM', amount: 1850.00, fee: 92.50, payout: 1757.50, status: 'completed' },
  { id: 'txn-010', date: 'Jan 22, 2026', bookingRef: 'BK-2348', guest: 'Jason R.', guestInitials: 'JR', amount: 2700.00, fee: 135.00, payout: 2565.00, status: 'completed' },
];

const monthlyBreakdown = [
  { month: 'March 2026', bookings: 3, gross: 4270, fees: 213.50, net: 4056.50 },
  { month: 'February 2026', bookings: 4, gross: 7645, fees: 382.25, net: 7262.75 },
  { month: 'January 2026', bookings: 3, gross: 6400, fees: 320.00, net: 6080.00 },
  { month: 'December 2025', bookings: 2, gross: 3200, fees: 160.00, net: 3040.00 },
  { month: 'November 2025', bookings: 3, gross: 4850, fees: 242.50, net: 4607.50 },
];

const statusColors: Record<PayoutStatus, string> = {
  completed: 'bg-brand-100 text-brand-700',
  pending: 'bg-sunset-100 text-sunset-700',
  processing: 'bg-sky-100 text-sky-700',
};

export default function HostEarningsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  const totalEarnings = mockTransactions.reduce((sum, t) => sum + t.payout, 0);
  const thisMonthEarnings = mockTransactions
    .filter((t) => t.date.includes('Mar'))
    .reduce((sum, t) => sum + t.payout, 0);
  const pendingPayouts = mockTransactions
    .filter((t) => t.status === 'processing' || t.status === 'pending')
    .reduce((sum, t) => sum + t.payout, 0);
  const totalFees = mockTransactions.reduce((sum, t) => sum + t.fee, 0);
  const outdoorsyFees = mockTransactions.reduce((sum, t) => sum + t.amount * 0.25, 0);
  const feesSaved = outdoorsyFees - totalFees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Track your income and manage payouts</p>
        </div>
        <button className="btn-secondary gap-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
          Export CSV
        </button>
      </div>

      {/* Savings Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-forest-700 rounded-2xl p-5 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="font-semibold">You saved ${feesSaved.toFixed(0)} vs Outdoorsy&apos;s 25% fee</p>
              <p className="text-sm text-white/80">Your total fees: ${totalFees.toFixed(2)} (5%) vs ${outdoorsyFees.toFixed(0)} at Outdoorsy (25%)</p>
            </div>
          </div>
          <span className="badge bg-white/20 text-white border border-white/20 text-sm">5% host fee</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">After 5% platform fee</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${thisMonthEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-brand-600 mt-1 font-medium">+18% vs last month</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-sm text-gray-500">Pending Payouts</p>
          <p className="text-3xl font-bold text-sunset-600 mt-1">${pendingPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">Processing in 1-2 business days</p>
        </div>
      </div>

      {/* Payout Method */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.016H4.48c-.075.01-.152.016-.23.016h-1.5A1.75 1.75 0 011 15.265V4.75zm1.5.75v9.012l4.146-4.146a.75.75 0 01.83-.142l.268.134a.25.25 0 00.336-.098l2.726-4.088a.75.75 0 011.248 0l2.698 4.047a.25.25 0 00.335.098l.268-.133a.75.75 0 01.83.141l4.139 4.138c.007-.02.011-.04.013-.061V5.5a.25.25 0 00-.25-.25H2.75a.25.25 0 00-.25.25z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Stripe Connect</p>
              <p className="text-xs text-gray-500">Connected &middot; Bank account ending in 4821</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-brand-100 text-brand-700">Connected</span>
            <button className="btn-ghost !py-1.5 !px-3 !text-xs">Manage</button>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fees (5%)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Net Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyBreakdown.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{row.month}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 text-right">{row.bookings}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 text-right">${row.gross.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-red-500 text-right">-${row.fees.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">${row.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
          <div className="flex items-center gap-2">
            {(['all', 'month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  timePeriod === period
                    ? 'bg-forest-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {period === 'all' ? 'All' : period === 'month' ? 'This Month' : period === 'quarter' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fee (5%)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payout</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-600">{txn.date}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-mono text-brand-600">{txn.bookingRef}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {txn.guestInitials}
                      </div>
                      <span className="text-sm text-gray-900">{txn.guest}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-900 text-right">${txn.amount.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-red-500 text-right">-${txn.fee.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">${txn.payout.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn('badge text-[10px]', statusColors[txn.status])}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-center">
          <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Load more transactions
          </button>
        </div>
      </div>
    </div>
  );
}

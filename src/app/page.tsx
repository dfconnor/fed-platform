import Link from 'next/link';
import { formatCents } from '@/types';
import SearchBar from '@/components/SearchBar';
import RVCard from '@/components/RVCard';

/* ------------------------------------------------------------------ */
/*  Mock data for featured listings (prices in cents)                  */
/* ------------------------------------------------------------------ */
const FEATURED_LISTINGS = [
  {
    id: '1',
    title: '2022 Thor Palazzo Class A Motorhome',
    slug: '2022-thor-palazzo-class-a-denver',
    rvType: 'CLASS_A' as const,
    nightlyRate: 18900,
    location: 'Denver, CO',
    city: 'Denver',
    state: 'CO',
    rating: 4.9,
    reviewCount: 47,
    sleeps: 6,
    year: 2022,
    length: 38,
    amenities: ['kitchen', 'ac', 'generator', 'shower', 'toilet', 'tv', 'awning'],
    features: ['pet_friendly'],
    instantBook: true,
    superhost: true,
    images: ['https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop'],
  },
  {
    id: '2',
    title: '2021 Airstream Globetrotter 27FB',
    slug: '2021-airstream-globetrotter-austin',
    rvType: 'AIRSTREAM' as const,
    nightlyRate: 12500,
    location: 'Austin, TX',
    city: 'Austin',
    state: 'TX',
    rating: 4.8,
    reviewCount: 32,
    sleeps: 4,
    year: 2021,
    length: 27,
    amenities: ['kitchen', 'ac', 'shower', 'toilet', 'solar', 'awning'],
    features: [],
    instantBook: true,
    superhost: false,
    images: ['https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?w=800&h=600&fit=crop'],
  },
  {
    id: '3',
    title: '2023 Storyteller Overland Mode 4x4 Van',
    slug: '2023-storyteller-overland-portland',
    rvType: 'CAMPERVAN' as const,
    nightlyRate: 9500,
    location: 'Portland, OR',
    city: 'Portland',
    state: 'OR',
    rating: 5.0,
    reviewCount: 18,
    sleeps: 2,
    year: 2023,
    length: 19,
    amenities: ['kitchen', 'solar', 'heating', 'wifi'],
    features: ['off_grid', 'festival_ready'],
    instantBook: false,
    superhost: true,
    images: ['https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=800&h=600&fit=crop'],
  },
  {
    id: '4',
    title: '2020 Jayco Greyhawk Class C Motorhome',
    slug: '2020-jayco-greyhawk-orlando',
    rvType: 'CLASS_C' as const,
    nightlyRate: 15900,
    location: 'Orlando, FL',
    city: 'Orlando',
    state: 'FL',
    rating: 4.7,
    reviewCount: 63,
    sleeps: 8,
    year: 2020,
    length: 31,
    amenities: ['kitchen', 'ac', 'generator', 'shower', 'toilet', 'tv', 'backup_camera'],
    features: ['child_seats'],
    instantBook: true,
    superhost: false,
    images: ['https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=800&h=600&fit=crop'],
  },
  {
    id: '5',
    title: '2022 Coachmen Catalina Legacy Travel Trailer',
    slug: '2022-coachmen-catalina-san-diego',
    rvType: 'TRAVEL_TRAILER' as const,
    nightlyRate: 8500,
    location: 'San Diego, CA',
    city: 'San Diego',
    state: 'CA',
    rating: 4.9,
    reviewCount: 29,
    sleeps: 5,
    year: 2022,
    length: 26,
    amenities: ['kitchen', 'ac', 'shower', 'toilet', 'awning', 'outdoor_kitchen'],
    features: ['pet_friendly'],
    instantBook: true,
    superhost: true,
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&h=600&fit=crop'],
  },
  {
    id: '6',
    title: '2021 Keystone Montana Fifth Wheel',
    slug: '2021-keystone-montana-nashville',
    rvType: 'FIFTH_WHEEL' as const,
    nightlyRate: 14500,
    location: 'Nashville, TN',
    city: 'Nashville',
    state: 'TN',
    rating: 4.6,
    reviewCount: 21,
    sleeps: 6,
    year: 2021,
    length: 35,
    amenities: ['kitchen', 'ac', 'fireplace', 'washer_dryer', 'shower', 'toilet', 'tv'],
    features: [],
    instantBook: false,
    superhost: false,
    images: ['https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&h=600&fit=crop'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'RV Owner in Colorado',
    quote:
      'I switched from Outdoorsy and immediately earned $2,400 more per season. The 5% fee is a game changer for hosts.',
    rating: 5,
  },
  {
    name: 'James & Lisa T.',
    role: 'Family of 4 from Chicago',
    quote:
      'We saved over $600 on our 2-week trip compared to what we would have paid on RVshare. The booking process was seamless.',
    rating: 5,
  },
  {
    name: 'Mike R.',
    role: 'Full-time RVer & Host',
    quote:
      'The 48-hour payouts are incredible. Other platforms hold your money for weeks. Rival RV respects the people who make the marketplace work.',
    rating: 5,
  },
];

const DESTINATIONS = [
  { name: 'Yellowstone', state: 'Wyoming', gradient: 'from-amber-600 to-orange-800' },
  { name: 'Grand Canyon', state: 'Arizona', gradient: 'from-red-700 to-amber-600' },
  { name: 'Great Smoky Mountains', state: 'Tennessee', gradient: 'from-emerald-700 to-teal-600' },
  { name: 'Zion', state: 'Utah', gradient: 'from-rose-600 to-orange-500' },
  { name: 'Glacier', state: 'Montana', gradient: 'from-sky-700 to-blue-500' },
  { name: 'Joshua Tree', state: 'California', gradient: 'from-yellow-600 to-amber-800' },
  { name: 'Acadia', state: 'Maine', gradient: 'from-indigo-600 to-purple-700' },
  { name: 'Olympic', state: 'Washington', gradient: 'from-green-700 to-emerald-500' },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <>
      {/* =========== HERO =========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-forest-400 rounded-full blur-3xl" />
        </div>

        <div className="relative container-wide py-20 sm:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
              The marketplace that&apos;s fair to everyone
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Adventure Awaits.{' '}
              <span className="text-brand-400">Fees Don&apos;t Have To.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Why pay 25% in fees when you can pay just 5%? Rival RV is the fair
              marketplace where travelers save and RV owners earn more.
            </p>

            {/* Search bar */}
            <div className="mt-10 max-w-3xl mx-auto">
              <SearchBar />
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-forest-500 border-2 border-forest-800 flex items-center justify-center text-xs font-medium text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>2,400+ happy travelers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">{'★'.repeat(5)}</span>
                <span>4.9/5 average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== TRUST BAR =========== */}
      <section className="bg-brand-600 text-white py-4">
        <div className="container-wide">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base font-medium">
            {[
              { icon: '💰', text: 'Only 5% Fees' },
              { icon: '🛡️', text: '$1M Insurance' },
              { icon: '⚡', text: '48hr Payouts' },
              { icon: '✅', text: 'Verified RVs' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== HOW IT WORKS =========== */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">How Rival RV Works</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              From finding your perfect RV to hitting the open road, we make it
              simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Search',
                description:
                  'Browse hundreds of verified RVs near your destination. Filter by type, price, amenities, and more.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Book',
                description:
                  'Reserve instantly or send a request. Pay securely with our $1M insurance included on every trip.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Adventure',
                description:
                  'Pick up your RV (or get it delivered!) and hit the road. 24/7 roadside assistance included.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative text-center p-8 rounded-2xl bg-gray-50 hover:bg-brand-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 group-hover:bg-brand-200 transition-colors mb-5">
                  {item.icon}
                </div>
                <div className="absolute top-4 right-4 text-5xl font-bold text-gray-100 group-hover:text-brand-100 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== FEATURED LISTINGS =========== */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-heading">Featured RVs</h2>
              <p className="mt-2 text-gray-500">
                Hand-picked adventures ready to book
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex btn-secondary text-sm"
            >
              View all RVs
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_LISTINGS.map((listing) => (
              <RVCard key={listing.id} {...listing} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/search" className="btn-primary">
              View all RVs
            </Link>
          </div>
        </div>
      </section>

      {/* =========== FEE COMPARISON =========== */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">
              Stop Overpaying for Your Adventure
            </h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              See how much you save when you book with Rival RV instead of the
              big guys.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500">
                    Fee Comparison
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-brand-600 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">Rival RV</span>
                      <span className="text-xs font-normal text-brand-500">
                        Recommended
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-center">
                    Outdoorsy
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-center">
                    RVshare
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    label: 'Guest Service Fee',
                    rival: '5%',
                    outdoorsy: 'Up to 15%',
                    rvshare: 'Up to 10%',
                  },
                  {
                    label: 'Host Service Fee',
                    rival: '5%',
                    outdoorsy: '20%',
                    rvshare: '15%',
                  },
                  {
                    label: 'Total Platform Take',
                    rival: '10%',
                    outdoorsy: 'Up to 35%',
                    rvshare: 'Up to 25%',
                    highlight: true,
                  },
                  {
                    label: 'Insurance Included',
                    rival: '$1M Coverage',
                    outdoorsy: '$1M Coverage',
                    rvshare: '$1M Coverage',
                  },
                  {
                    label: 'Host Payout Speed',
                    rival: '48 Hours',
                    outdoorsy: '5-7 Days',
                    rvshare: '3-5 Days',
                  },
                  {
                    label: 'Cost on a $200/night, 7-night trip',
                    rival: '$70',
                    outdoorsy: 'Up to $210',
                    rvshare: 'Up to $140',
                    highlight: true,
                  },
                ].map((row) => (
                  <tr
                    key={row.label}
                    className={row.highlight ? 'bg-brand-50/50' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={`font-semibold ${
                          row.highlight ? 'text-brand-700 text-base' : 'text-brand-600'
                        }`}
                      >
                        {row.rival}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {row.outdoorsy}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {row.rvshare}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Competitor fee data based on publicly available information as of
            2024. Actual fees may vary.
          </p>
        </div>
      </section>

      {/* =========== OWNER CTA =========== */}
      <section className="py-20 bg-gradient-to-br from-forest-800 to-brand-900 text-white">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30 mb-4">
                For RV Owners
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Earn More. Keep More.{' '}
                <span className="text-brand-400">List Your RV.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-300 leading-relaxed">
                Other platforms take up to 25% of your earnings. We take just
                5%. That means on a $10,000 season, you keep{' '}
                <span className="text-brand-400 font-semibold">$9,500</span>{' '}
                instead of $7,500. That&apos;s an extra $2,000 in your pocket.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Only 5% host fee (vs 15-25% elsewhere)',
                  '48-hour payouts after trip starts',
                  '$1M insurance on every booking',
                  'Free professional listing support',
                  'No hidden fees or upcharges',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register?host=true"
                  className="btn-primary bg-brand-500 hover:bg-brand-600"
                >
                  List Your RV Free
                </Link>
                <Link
                  href="/how-it-works#hosts"
                  className="btn-ghost text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Earnings preview card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
              <h3 className="text-xl font-semibold mb-6">
                Estimated Earnings Calculator
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-300">Nightly Rate</label>
                  <div className="mt-1 text-3xl font-bold text-brand-400">
                    $150
                    <span className="text-base font-normal text-gray-400">
                      /night
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-300">
                    Nights Booked Per Month
                  </label>
                  <div className="mt-1 text-3xl font-bold text-brand-400">
                    15
                    <span className="text-base font-normal text-gray-400">
                      {' '}nights
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-300">Monthly Revenue</span>
                    <span className="text-lg font-semibold">$2,250</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-gray-300">Rival RV Fee (5%)</span>
                    <span className="text-lg font-semibold text-red-300">
                      -$112.50
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-white/10">
                    <span className="text-lg font-semibold">You Keep</span>
                    <span className="text-2xl font-bold text-brand-400">
                      $2,137.50
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-400">
                    On Outdoorsy you&apos;d keep ~$1,800. That&apos;s{' '}
                    <span className="text-brand-400 font-medium">
                      $337.50 more per month
                    </span>{' '}
                    with Rival RV.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== TESTIMONIALS =========== */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">Loved by Hosts & Guests</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              Real people sharing real experiences on Rival RV.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-8">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {'★'.repeat(t.rating)}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-forest-500 flex items-center justify-center text-white text-sm font-semibold">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== POPULAR DESTINATIONS =========== */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">Popular Destinations</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              Find RVs near America&apos;s most iconic outdoor destinations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href={`/search?location=${encodeURIComponent(dest.name + ', ' + dest.state)}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-white/70 text-sm">{dest.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========== FINAL CTA =========== */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready for Your Next Adventure?
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">
            Join thousands of travelers and hosts who chose the fair
            marketplace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/search" className="btn-primary bg-white text-brand-700 hover:bg-gray-100">
              Browse RVs
            </Link>
            <Link
              href="/register?host=true"
              className="btn-secondary border-white/30 text-white hover:bg-white/10 ring-0"
            >
              List Your RV
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

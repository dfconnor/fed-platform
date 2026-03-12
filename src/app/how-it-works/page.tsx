'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS = [
  {
    q: 'How does insurance work on Rival RV?',
    a: 'Every trip booked through Rival RV includes up to $1,000,000 in liability coverage. Guests can choose from three insurance tiers (Basic, Essential, Premium) during checkout, each with different deductible levels and coverage options including collision, comprehensive, interior protection, and roadside assistance.',
  },
  {
    q: 'What are the fees for guests?',
    a: 'Guests pay a flat 5% service fee on the booking subtotal. That is it. No hidden charges, no inflated cleaning fees from us. On a $1,400 booking (e.g., $200/night for 7 nights), you would pay just $70 in platform fees compared to up to $210 on competing platforms.',
  },
  {
    q: 'What are the fees for hosts?',
    a: 'Hosts pay a flat 5% service fee on their earnings. This is significantly lower than the 15-25% charged by other platforms. On $10,000 in annual bookings, you keep $9,500 instead of $7,500-$8,500.',
  },
  {
    q: 'How fast do hosts get paid?',
    a: 'Hosts receive their payout within 48 hours of the trip start date via direct bank transfer. Other platforms typically hold funds for 3-7 business days after the trip ends. We believe you should get paid when you deliver your RV, not weeks later.',
  },
  {
    q: 'Can I get my RV delivered?',
    a: 'Many hosts offer delivery and setup at your campsite or destination for an additional fee. Look for the "Delivery Available" badge on listings. Delivery fees are set by the host and typically range from $1-3 per mile.',
  },
  {
    q: 'What happens if something goes wrong during my trip?',
    a: 'We provide 24/7 roadside assistance on every booking. If there is a mechanical issue, our support team will coordinate towing, repairs, or a replacement RV. Our insurance coverage handles damage claims, and our resolution center handles any disputes between guests and hosts.',
  },
  {
    q: 'How are RVs verified?',
    a: 'Every RV on our platform goes through a verification process. Hosts must provide registration documents, photos, and maintenance records. We verify vehicle history and insurance eligibility. Listings also earn trust through guest reviews and ratings.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Hosts can choose from three cancellation policies: Flexible (full refund up to 24 hours before trip), Moderate (full refund up to 7 days before), or Strict (50% refund up to 14 days before). The policy is clearly displayed on each listing before you book.',
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ Accordion item                                                 */
/* ------------------------------------------------------------------ */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-gray-900 pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function HowItWorksPage() {
  return (
    <>
      {/* =========== HERO =========== */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white py-20 sm:py-28">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            How Rival RV Works
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            A fairer marketplace for everyone. Lower fees, faster payouts,
            and the same great insurance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#guests" className="btn-primary bg-brand-500 hover:bg-brand-600">
              I&apos;m a Guest
            </a>
            <a href="#hosts" className="btn-secondary border-white/30 text-white hover:bg-white/10 ring-0">
              I&apos;m a Host
            </a>
          </div>
        </div>
      </section>

      {/* =========== FOR GUESTS =========== */}
      <section id="guests" className="py-20 bg-white scroll-mt-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-sky-100 text-sky-700 rounded-full mb-4">
              For Guests
            </span>
            <h2 className="section-heading">Your Adventure in 4 Simple Steps</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

              {[
                {
                  step: 1,
                  title: 'Search & Discover',
                  description:
                    'Browse RVs by location, dates, type, and amenities. Use our map view to find the perfect RV near your destination. Filter by price, instant booking, delivery, and more.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  ),
                },
                {
                  step: 2,
                  title: 'Book with Confidence',
                  description:
                    'Reserve your RV with instant booking or send a request. Choose your insurance tier, add extras like camping chairs or GPS, and pay securely. Only 5% guest fee means you save hundreds.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ),
                },
                {
                  step: 3,
                  title: 'Hit the Road',
                  description:
                    'Pick up your RV from the host or get it delivered to your location. The host will walk you through everything you need to know. 24/7 roadside assistance is just a call away.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                  ),
                },
                {
                  step: 4,
                  title: 'Return & Review',
                  description:
                    'Return the RV at the agreed time and location. Leave a review to help future travelers. Your security deposit is released within 3 days if there are no issues.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="relative flex gap-6 mb-12 last:mb-0">
                  <div className="hidden md:flex shrink-0 w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 items-center justify-center z-10">
                    {item.icon}
                  </div>
                  <div className="flex-1 p-6 rounded-2xl bg-gray-50 hover:bg-sky-50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex md:hidden w-8 h-8 rounded-lg bg-sky-100 text-sky-600 items-center justify-center text-sm font-bold">
                        {item.step}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========== FOR HOSTS =========== */}
      <section id="hosts" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-brand-100 text-brand-700 rounded-full mb-4">
              For Hosts
            </span>
            <h2 className="section-heading">
              List, Earn, and Keep More of Your Money
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: 'List Your RV',
                  description:
                    'Create your listing in minutes. Add photos, set your price, choose your availability, and select your cancellation policy. Our team can help with professional photos and listing optimization.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  ),
                },
                {
                  step: 2,
                  title: 'Earn on Your Terms',
                  description:
                    'Accept bookings instantly or review each request. Set your own nightly rate, cleaning fee, and delivery options. Offer weekly and monthly discounts to attract longer stays.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                },
                {
                  step: 3,
                  title: 'Get Paid Fast',
                  description:
                    'Receive your payout within 48 hours of the trip start, directly to your bank account. Track all your earnings, bookings, and reviews from your host dashboard.',
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
                >
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/register?host=true" className="btn-primary">
                Start Listing Your RV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========== INSURANCE =========== */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">Insurance That Has You Covered</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              Every trip includes comprehensive insurance. Choose the tier that
              fits your needs.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Basic',
                price: 'Included',
                color: 'gray',
                features: [
                  'Up to $1M liability coverage',
                  '$2,500 deductible',
                  'Collision coverage',
                  'Comprehensive coverage',
                  '24/7 roadside assistance',
                ],
                missing: ['Interior protection', 'Trip cancellation'],
              },
              {
                name: 'Essential',
                price: '$29/day',
                color: 'brand',
                popular: true,
                features: [
                  'Up to $1M liability coverage',
                  '$1,000 deductible',
                  'Collision coverage',
                  'Comprehensive coverage',
                  '24/7 roadside assistance',
                  'Interior protection',
                ],
                missing: ['Trip cancellation'],
              },
              {
                name: 'Premium',
                price: '$49/day',
                color: 'forest',
                features: [
                  'Up to $1M liability coverage',
                  '$500 deductible',
                  'Collision coverage',
                  'Comprehensive coverage',
                  '24/7 roadside assistance',
                  'Interior protection',
                  'Trip cancellation coverage',
                ],
                missing: [],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 ${
                  tier.popular
                    ? 'border-brand-300 bg-brand-50/50 shadow-md ring-1 ring-brand-200'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {tier.price}
                </div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                  {tier.missing.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== FEE COMPARISON =========== */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">The Fee Difference</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              We keep our fees low so you keep more money, whether you are
              renting or listing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Guest comparison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Guest Fees (You Pay)
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Rival RV', fee: '5%', amount: '$70', highlight: true },
                  { name: 'RVshare', fee: 'Up to 10%', amount: '$140', highlight: false },
                  { name: 'Outdoorsy', fee: 'Up to 15%', amount: '$210', highlight: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      item.highlight
                        ? 'bg-brand-50 border border-brand-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <span
                        className={`font-semibold ${
                          item.highlight ? 'text-brand-700' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({item.fee})
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        item.highlight ? 'text-brand-600' : 'text-gray-400'
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-2">
                  Based on a $200/night, 7-night booking ($1,400 subtotal)
                </p>
              </div>
            </div>

            {/* Host comparison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Host Fees (You Keep)
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Rival RV', fee: '5%', amount: '$9,500', highlight: true },
                  { name: 'RVshare', fee: '15%', amount: '$8,500', highlight: false },
                  { name: 'Outdoorsy', fee: '20%', amount: '$8,000', highlight: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      item.highlight
                        ? 'bg-brand-50 border border-brand-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div>
                      <span
                        className={`font-semibold ${
                          item.highlight ? 'text-brand-700' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({item.fee} fee)
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        item.highlight ? 'text-brand-600' : 'text-gray-400'
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-2">
                  Annual host earnings from $10,000 in bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========== FAQ =========== */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-14">
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to know about renting and listing on Rival RV.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 px-6">
            {FAQ_ITEMS.map((item) => (
              <FAQItem
                key={item.q}
                question={item.q}
                answer={item.a}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Still have questions?{' '}
              <Link
                href="/contact"
                className="text-brand-600 font-medium hover:text-brand-700"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* =========== CTA =========== */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">
            Whether you want to hit the road or earn from your RV, Rival RV
            makes it fair for everyone.
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

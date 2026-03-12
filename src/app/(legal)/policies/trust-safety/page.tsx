import Link from 'next/link';

const stats = [
  { value: '50,000+', label: 'Verified Users' },
  { value: '$1M+', label: 'Insurance on Every Trip' },
  { value: '24/7', label: 'Support Available' },
];

const comparisonFeatures = [
  { feature: 'Identity Verification (Gov ID + Selfie)', rival: true, outdoorsy: true, rvshare: false },
  { feature: 'Facial Biometric Matching', rival: true, outdoorsy: false, rvshare: false },
  { feature: 'Driving Record Check', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Background Screening for Hosts', rival: true, outdoorsy: false, rvshare: false },
  { feature: 'Pre/Post-Trip Condition Reports', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Digital Rental Agreement (E-Signature)', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Up to $1M Liability Coverage', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Multiple Insurance Tier Options', rival: true, outdoorsy: true, rvshare: true },
  { feature: '24/7 Roadside Assistance', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Trip Cancellation Insurance', rival: true, outdoorsy: false, rvshare: false },
  { feature: 'Tokenized Payments (PCI DSS Level 1)', rival: true, outdoorsy: true, rvshare: true },
  { feature: '48-Hour Host Payouts', rival: true, outdoorsy: false, rvshare: false },
  { feature: 'Structured Damage Claims Process', rival: true, outdoorsy: true, rvshare: true },
  { feature: 'Platform-Mediated Dispute Resolution', rival: true, outdoorsy: true, rvshare: false },
  { feature: '5% Guest Fee (Lowest in Industry)', rival: true, outdoorsy: false, rvshare: false },
  { feature: '5% Host Fee (Lowest in Industry)', rival: true, outdoorsy: false, rvshare: false },
];

function CheckBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100">
      <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </span>
  );
}

function XBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export default function TrustSafetyPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-12 sm:-mt-16 lg:-mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight">
            Your Safety Is Our Priority
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Every booking on Rival RV is protected by identity verification, comprehensive insurance, digital contracts, and 24/7 support.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Verification */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Identity Verification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For Guests */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">For Guests</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Government ID Verification</span>
                    <p className="text-xs text-gray-500 mt-0.5">Driver&rsquo;s license, passport, or state ID scanned and verified via Persona</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Facial Biometric Matching</span>
                    <p className="text-xs text-gray-500 mt-0.5">Live selfie compared against ID photo to confirm identity</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Driving Record Check</span>
                    <p className="text-xs text-gray-500 mt-0.5">Motor vehicle report reviewed for violations and suspensions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Background Screening</span>
                    <p className="text-xs text-gray-500 mt-0.5">Criminal background check for safety of all community members</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Hosts */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">For Hosts</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">All Guest Requirements, Plus:</span>
                    <p className="text-xs text-gray-500 mt-0.5">Hosts complete the same ID, biometric, and background checks as guests</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Property Verification</span>
                    <p className="text-xs text-gray-500 mt-0.5">Vehicle registration and insurance documentation verified</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Response Rate Monitoring</span>
                    <p className="text-xs text-gray-500 mt-0.5">Hosts must maintain responsive communication with guests</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">Review History</span>
                    <p className="text-xs text-gray-500 mt-0.5">Ongoing monitoring of guest reviews and satisfaction ratings</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Verification badges */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Verification Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">ID Verified</p>
                  <p className="text-xs text-gray-500">Government ID confirmed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Background Checked</p>
                  <p className="text-xs text-gray-500">Criminal background clear</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-sunset-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sunset-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Fully Verified</p>
                  <p className="text-xs text-gray-500">All checks completed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Security */}
        <section className="mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Security</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { title: 'Stripe PCI DSS Level 1', desc: 'The highest level of payment security certification' },
                { title: 'Tokenized Payments', desc: 'Card numbers are replaced with secure tokens' },
                { title: 'No Stored Card Numbers', desc: 'We never store your full card details on our servers' },
                { title: '256-Bit Encryption', desc: 'All data transmitted with bank-grade TLS encryption' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Protection */}
        <section className="mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Insurance Protection</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Every trip booked on Rival RV includes insurance coverage. Choose from three tiers to match your needs, with up to $1M in liability protection and deductibles as low as $500.
            </p>
            <Link href="/policies/insurance" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View full insurance details &rarr;
            </Link>
          </div>
        </section>

        {/* Rental Agreements */}
        <section className="mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Digital Rental Agreements</h2>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>Every booking generates a legally binding digital contract with:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {[
                  'E-signatures from both parties',
                  'IP address and timestamp recording',
                  'Specific vehicle and trip details',
                  'Pricing and fee breakdown',
                  'Insurance coverage details',
                  'Compliance with E-SIGN Act and UETA',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <Link href="/legal/rental-agreement" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                View rental agreement template &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Condition Reports */}
        <section className="mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sunset-100 text-sunset-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Condition Reports</h2>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                Every trip includes structured pre-trip and post-trip condition reports to prevent disputes and protect both parties:
              </p>
              <ul className="space-y-1.5 mt-2">
                {[
                  'Guided photo documentation of all vehicle areas',
                  'Odometer and generator hour readings',
                  'Fuel level verification',
                  'Existing damage notation',
                  'Timestamped and linked to the booking record',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Community Standards */}
        <section className="mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Community Standards</h2>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Review System', desc: 'Honest, two-way reviews after every trip' },
                  { title: 'Host Response Requirements', desc: 'Hosts must respond to inquiries within 24 hours' },
                  { title: 'Zero Tolerance for Fraud', desc: 'Fake listings, stolen identities, and scams result in permanent bans' },
                  { title: 'Accurate Listings', desc: 'Vehicle photos and descriptions must be truthful and current' },
                  { title: 'Respectful Communication', desc: 'Harassment, discrimination, and abuse are not tolerated' },
                  { title: 'Fair Pricing', desc: 'No hidden fees or bait-and-switch pricing tactics' },
                ].map((item) => (
                  <li key={item.title} className="bg-gray-50 rounded-xl p-3">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 24/7 Support */}
        <section className="mb-16">
          <div className="rounded-2xl bg-forest-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">24/7 Support</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-forest-800 rounded-xl p-4">
                <p className="font-semibold text-white">Emergency Hotline</p>
                <p className="text-sm text-gray-300 mt-1">Available 24/7 for roadside emergencies, accidents, and urgent safety concerns.</p>
              </div>
              <div className="bg-forest-800 rounded-xl p-4">
                <p className="font-semibold text-white">In-App Messaging</p>
                <p className="text-sm text-gray-300 mt-1">Direct messaging with our support team. Average response time under 15 minutes.</p>
              </div>
              <div className="bg-forest-800 rounded-xl p-4">
                <p className="font-semibold text-white">Email Support</p>
                <p className="text-sm text-gray-300 mt-1">
                  <a href="mailto:support@rivalrv.com" className="text-brand-300 hover:text-brand-200">support@rivalrv.com</a> &mdash; Response within 4 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Compare */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Compare</h2>

          {/* Mobile comparison */}
          <div className="md:hidden space-y-3">
            {comparisonFeatures.map((row) => (
              <div key={row.feature} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">{row.feature}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="font-semibold text-brand-700">Rival RV</span> {row.rival ? <CheckBadge /> : <XBadge />}</span>
                  <span className="flex items-center gap-1"><span className="text-gray-500">Outdoorsy</span> {row.outdoorsy ? <CheckBadge /> : <XBadge />}</span>
                  <span className="flex items-center gap-1"><span className="text-gray-500">RVshare</span> {row.rvshare ? <CheckBadge /> : <XBadge />}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop comparison table */}
          <div className="hidden md:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center px-4 py-4 bg-brand-50">
                    <span className="font-bold text-brand-700">Rival RV</span>
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">Outdoorsy</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">RVshare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonFeatures.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-3 text-gray-700">{row.feature}</td>
                    <td className="text-center px-4 py-3 bg-brand-50/50"><span className="inline-flex justify-center">{row.rival ? <CheckBadge /> : <XBadge />}</span></td>
                    <td className="text-center px-4 py-3"><span className="inline-flex justify-center">{row.outdoorsy ? <CheckBadge /> : <XBadge />}</span></td>
                    <td className="text-center px-4 py-3"><span className="inline-flex justify-center">{row.rvshare ? <CheckBadge /> : <XBadge />}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom nav */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-6">
            <Link href="/policies/damage-claims" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              &larr; Damage Claims
            </Link>
            <Link href="/legal/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Terms of Service &rarr;
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Rival RV, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

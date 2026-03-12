import Link from 'next/link';

const timelineSteps = [
  {
    step: 1,
    title: 'Document Damage',
    description: 'Take photos and video of all damage within hours of vehicle return. Use the in-app condition report to compare pre-trip and post-trip vehicle state.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Host Files Claim',
    description: 'The host has 7 days from the trip end date to file a damage claim through their dashboard. Claims must include photo/video evidence, a description of the damage, and repair cost estimates.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Guest Responds',
    description: 'The guest has 3 business days to review the claim and respond. Guests may acknowledge the damage, provide counter-evidence, or dispute the claim with their own documentation.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    step: 4,
    title: 'Platform Review',
    description: 'Rival RV reviews all evidence from both parties. Our resolution team examines photos, condition reports, timestamps, and repair estimates. Maximum review period is 14 days.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    step: 5,
    title: 'Resolution',
    description: 'Based on the review, the security deposit is either released, partially captured, or fully captured. If the damage exceeds the deposit, additional charges may apply through insurance.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function DamageClaimsPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-12 sm:-mt-16 lg:-mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">
            Damage Claims Process
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            A fair, transparent process for resolving damage claims between hosts and guests.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Step-by-Step Timeline</h2>
          <div className="space-y-0">
            {timelineSteps.map((item, i) => (
              <div key={item.step} className="relative flex gap-4 sm:gap-6">
                {/* Vertical line */}
                {i < timelineSteps.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center z-10">
                  {item.icon}
                </div>
                {/* Content */}
                <div className="flex-1 pb-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">Step {item.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What qualifies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">What Qualifies</h2>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              {[
                'Exterior damage (dents, scratches, broken lights, awning damage)',
                'Interior damage (tears, stains, burns, broken fixtures)',
                'Mechanical damage caused by renter (engine, transmission, drivetrain)',
                'Cleaning beyond normal use (excessive mess, odor removal, biohazard)',
                'Missing equipment or accessories',
                'Tire or wheel damage',
                'Water system damage from improper use',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sunset-100 text-sunset-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">What Does NOT Qualify</h2>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              {[
                'Normal wear and tear (minor scuffs, road debris chips)',
                'Pre-existing damage documented in the pre-trip condition report',
                'Mechanical issues not caused by the renter (age-related failures)',
                'Cosmetic issues that were present before the trip',
                'Damage reported after the 7-day filing window',
                'Claims without photographic evidence',
                'Alleged damage contradicted by pre-trip photos',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-sunset-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Security deposit details */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Deposit Details</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Hold Amount</p>
                <p className="font-semibold text-gray-900">$500 &ndash; $1,500</p>
                <p className="text-xs text-gray-500 mt-1">Set by host per listing. Authorized at booking, not charged.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Release Timeline</p>
                <p className="font-semibold text-gray-900">3 business days</p>
                <p className="text-xs text-gray-500 mt-1">After trip ends, if no claim is filed by the host.</p>
              </div>
            </div>
            <p>
              If a damage claim is filed, the hold remains in place until the claim is resolved. Depending on the outcome:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><span className="font-medium text-gray-700">Claim rejected:</span> Full deposit hold is released within 3 business days of resolution.</li>
              <li><span className="font-medium text-gray-700">Partial capture:</span> Only the amount needed to cover documented damages is charged. The remainder is released.</li>
              <li><span className="font-medium text-gray-700">Full capture:</span> The entire deposit is charged to cover damages up to the deposit amount.</li>
              <li><span className="font-medium text-gray-700">Exceeds deposit:</span> If damages exceed the deposit, the insurance claim process is initiated for the remaining amount.</li>
            </ul>
          </div>
        </div>

        {/* Dispute escalation */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Escalation</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              If either party disagrees with the initial resolution, the following escalation process is available:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-brand-50 rounded-xl p-4 border border-brand-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-semibold text-brand-900">Mediation</h3>
                </div>
                <p className="text-xs text-brand-700">
                  Our resolution team conducts a thorough secondary review with additional evidence gathering. Both parties may submit supplemental documentation.
                </p>
              </div>
              <div className="hidden sm:flex items-center">
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <div className="flex-1 bg-forest-50 rounded-xl p-4 border border-forest-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-forest-200 text-forest-800 flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-semibold text-forest-900">Binding Arbitration</h3>
                </div>
                <p className="text-xs text-forest-700">
                  If mediation does not resolve the dispute, either party may request binding arbitration under AAA Consumer Arbitration Rules, as outlined in our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips for Hosts</h2>
            <ul className="text-sm text-gray-600 space-y-2.5">
              {[
                'Document your vehicle thoroughly before every trip with timestamped photos and video',
                'Use the in-app condition report for a standardized record',
                'Photograph all angles: exterior (all 4 sides, roof), interior (every room, surfaces, floors), mechanical (odometer, generator hours)',
                'Note pre-existing damage in the condition report so it cannot be attributed to the guest',
                'Inspect the vehicle within hours of return, not days later',
                'Keep repair receipts and estimates from certified mechanics',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips for Guests</h2>
            <ul className="text-sm text-gray-600 space-y-2.5">
              {[
                'Complete the pre-trip condition report before driving away',
                'Photograph any existing damage you notice during the walkthrough',
                'Take your own photos of the vehicle before and after your trip',
                'Communicate any issues to the host immediately via the in-app messaging',
                'Report accidents or mechanical failures as soon as they occur',
                'Keep records of your communications with the host throughout the trip',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-6">
            <Link href="/policies/insurance" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              &larr; Insurance Coverage
            </Link>
            <Link href="/policies/trust-safety" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Trust &amp; Safety &rarr;
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

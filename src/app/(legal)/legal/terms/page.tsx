'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'account', title: '2. Account Registration & Eligibility' },
  { id: 'platform-role', title: '3. Platform Role' },
  { id: 'payments', title: '4. Booking & Payments' },
  { id: 'cancellation', title: '5. Cancellation & Refunds' },
  { id: 'deposits', title: '6. Security Deposits' },
  { id: 'insurance', title: '7. Insurance & Protection' },
  { id: 'rental-agreements', title: '8. Rental Agreements' },
  { id: 'verification', title: '9. Identity Verification' },
  { id: 'damage-claims', title: '10. Damage Claims & Disputes' },
  { id: 'prohibited', title: '11. Prohibited Uses' },
  { id: 'liability', title: '12. Limitation of Liability' },
  { id: 'disputes', title: '13. Dispute Resolution' },
  { id: 'modifications', title: '14. Modifications to Terms' },
  { id: 'contact', title: '15. Contact Information' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('');

  function handlePrint() {
    window.print();
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: March 2026</p>
          </div>
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors print:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print
          </button>
        </div>
        <div className="h-px bg-gray-200" />
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        {/* Sticky Table of Contents — desktop only */}
        <aside className="hidden lg:block print:hidden">
          <nav className="sticky top-24">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Contents
            </h2>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'block py-1 text-xs leading-snug transition-colors',
                      activeSection === section.id
                        ? 'text-brand-600 font-medium'
                        : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="space-y-10">
          {/* 1 */}
          <section id="acceptance">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                By accessing or using the Rival RV platform, website, mobile application, or any related services (collectively, the &ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you may not access or use the Platform.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and Rival RV, Inc. (&ldquo;Rival RV,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a Delaware corporation. By creating an account, booking a vehicle, or listing a vehicle on the Platform, you acknowledge that you have read, understood, and agree to comply with these Terms.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section id="account">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Account Registration &amp; Eligibility</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                To use the Platform, you must be at least 18 years of age and possess a valid driver&rsquo;s license. To rent a recreational vehicle, you must be at least 25 years of age (or the minimum age required by the applicable insurance provider).
              </p>
              <p>
                When creating an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
              <p>
                We reserve the right to suspend or terminate accounts that contain inaccurate information, violate these Terms, or pose a risk to the safety of other users.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section id="platform-role">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Platform Role</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Rival RV operates as an online marketplace that connects recreational vehicle owners (&ldquo;Hosts&rdquo;) with individuals seeking to rent recreational vehicles (&ldquo;Guests&rdquo;). Rival RV is not a rental company, fleet operator, or dealer of recreational vehicles.
              </p>
              <p>
                We facilitate bookings, process payments, provide insurance options, and offer dispute resolution services. However, we do not own, maintain, inspect, or control any vehicle listed on the Platform. Hosts are solely responsible for the condition, legality, and safety of their vehicles.
              </p>
              <p>
                Rival RV does not guarantee the availability, quality, suitability, or legality of any listing. Any transaction between a Host and Guest is a direct contractual relationship between those parties, facilitated by the Platform.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section id="payments">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Booking &amp; Payments</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                All payments on the Platform are processed securely through Stripe. Guests pay the full booking amount at the time of reservation, including the nightly rate, any applicable fees, insurance costs, and a 5% guest service fee.
              </p>
              <p>
                Hosts are charged a 5% host service fee, deducted from their payout. Host payouts are initiated within 48 hours of the trip start date via direct bank transfer through Stripe Connect.
              </p>
              <p>
                All prices on the Platform are listed in US Dollars (USD). Guests are responsible for any currency conversion fees charged by their bank or payment provider. Rival RV does not add any hidden surcharges or conversion fees.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section id="cancellation">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Cancellation &amp; Refunds</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Hosts select one of three cancellation tiers for their listing: Flexible, Moderate, or Strict. The cancellation policy is clearly displayed on each listing before booking. Each tier defines a different refund schedule based on how far in advance the cancellation is made.
              </p>
              <p>
                All bookings include a 48-hour grace period after initial booking during which the Guest may cancel for a full refund, regardless of the cancellation tier selected.
              </p>
              <p>
                For full details on each cancellation tier and refund schedules, please see our{' '}
                <Link href="/policies/cancellation" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  Cancellation Policy
                </Link>.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section id="deposits">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Security Deposits</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Hosts may require a security deposit ranging from $500 to $1,500 for their vehicle. The security deposit is authorized as a hold on the Guest&rsquo;s payment method at the time of booking but is not charged unless a valid damage claim is filed.
              </p>
              <p>
                The security deposit hold is released within 3 business days after the trip ends, provided no damage claim has been filed by the Host. If a claim is filed, the deposit hold may be partially or fully captured to cover documented damages or policy violations.
              </p>
              <p>
                The specific deposit amount for each vehicle is displayed on the listing page and in the rental agreement prior to booking confirmation.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section id="insurance">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Insurance &amp; Protection</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Insurance coverage is required for all bookings made through the Platform. Guests may select from three insurance tiers: Basic, Essential, or Premium. Each tier provides different levels of liability, collision, and comprehensive coverage, as well as varying deductible amounts.
              </p>
              <p>
                Insurance is provided on a secondary or excess basis and does not replace the Guest&rsquo;s personal auto insurance. Claims are subject to the terms and conditions of the applicable insurance policy.
              </p>
              <p>
                For complete details on coverage levels, deductibles, and what is and is not covered, please see our{' '}
                <Link href="/policies/insurance" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  Insurance &amp; Coverage
                </Link>{' '}page.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section id="rental-agreements">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Rental Agreements</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                A digital rental agreement is generated for each booking made through the Platform. The agreement includes the specific terms for that trip, including vehicle details, rental period, pricing, mileage limits, policies, and responsibilities.
              </p>
              <p>
                Both the Host and Guest must sign the rental agreement electronically before the trip begins. Electronic signatures are legally binding under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Uniform Electronic Transactions Act (UETA).
              </p>
              <p>
                You may review our standard rental agreement template on the{' '}
                <Link href="/legal/rental-agreement" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  Rental Agreement
                </Link>{' '}page.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section id="verification">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Identity Verification</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                All users must complete identity verification before making or receiving bookings. Verification requires a government-issued photo ID (driver&rsquo;s license, passport, or state ID) and a live selfie for facial biometric matching.
              </p>
              <p>
                Guests who wish to rent vehicles must also pass a driving record check. Hosts must additionally pass a background screening and provide vehicle registration documentation.
              </p>
              <p>
                Identity verification is performed by our third-party provider, Persona. Verification data is stored encrypted and handled in accordance with our{' '}
                <Link href="/legal/privacy" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </section>

          {/* 10 */}
          <section id="damage-claims">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Damage Claims &amp; Disputes</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                If damage occurs during a rental period, the Host must file a damage claim within 7 days of the trip end date through the Host dashboard. Claims must include photographic or video documentation of the damage.
              </p>
              <p>
                The Guest has 3 business days to review the claim and respond with counter-evidence or acknowledgment. Rival RV will review evidence from both parties and render a decision within 14 days.
              </p>
              <p>
                For full details on the claims process, what qualifies as a claim, and dispute escalation procedures, see our{' '}
                <Link href="/policies/damage-claims" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  Damage Claims
                </Link>{' '}page.
              </p>
            </div>
          </section>

          {/* 11 */}
          <section id="prohibited">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Prohibited Uses</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                The following activities are strictly prohibited while using a vehicle rented through the Platform:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Subletting or transferring the vehicle to any third party</li>
                <li>Using the vehicle for any illegal purpose or activity</li>
                <li>Smoking in the vehicle unless the listing explicitly allows smoking in designated areas</li>
                <li>Towing any trailer or vehicle unless the listing explicitly authorizes towing</li>
                <li>Operating the vehicle under the influence of drugs or alcohol</li>
                <li>Allowing any unauthorized or unlicensed driver to operate the vehicle</li>
                <li>Taking the vehicle outside designated geographic restrictions set by the Host</li>
                <li>Using the vehicle for commercial purposes, racing, or off-road driving</li>
                <li>Exceeding the stated passenger capacity of the vehicle</li>
              </ul>
              <p>
                Violation of prohibited use policies may result in immediate termination of the rental, forfeiture of the security deposit, account suspension, and liability for all resulting damages.
              </p>
            </div>
          </section>

          {/* 12 */}
          <section id="liability">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Limitation of Liability</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Rival RV operates solely as a marketplace platform and is not responsible for the condition, safety, legality, or suitability of any vehicle listed on the Platform. We do not inspect, maintain, or control any vehicle.
              </p>
              <p>
                To the maximum extent permitted by applicable law, Rival RV&rsquo;s total aggregate liability to any user for any claims arising from or related to the use of the Platform shall not exceed the total amount of service fees paid by that user in the 12 months preceding the claim, or the total booking amount for the specific transaction giving rise to the claim, whichever is less.
              </p>
              <p>
                In no event shall Rival RV be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill.
              </p>
            </div>
          </section>

          {/* 13 */}
          <section id="disputes">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Dispute Resolution</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                In the event of a dispute between you and Rival RV, you agree to first attempt to resolve the dispute informally by contacting us at support@rivalrv.com. We will work with you in good faith to resolve the matter within 30 days.
              </p>
              <p>
                If the dispute cannot be resolved informally, you agree that it will be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. Arbitration will take place in the state of Delaware, or at a location mutually agreed upon by the parties.
              </p>
              <p>
                You agree that any dispute resolution proceedings will be conducted on an individual basis and not as a class action, class arbitration, or representative proceeding. You waive your right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </div>
          </section>

          {/* 14 */}
          <section id="modifications">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">14. Modifications to Terms</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Rival RV reserves the right to modify these Terms at any time. We will provide at least 30 days&rsquo; prior notice of any material changes by sending an email to the address associated with your account and by posting a notice on the Platform.
              </p>
              <p>
                Your continued use of the Platform after the effective date of any modification constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must discontinue use of the Platform and close your account before the effective date.
              </p>
            </div>
          </section>

          {/* 15 */}
          <section id="contact">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">15. Contact Information</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-1.5 not-prose">
                <p className="font-semibold text-gray-900">Rival RV, Inc.</p>
                <p>
                  Email:{' '}
                  <a href="mailto:support@rivalrv.com" className="text-brand-600 hover:text-brand-700 font-medium">
                    support@rivalrv.com
                  </a>
                </p>
                <p>Website: www.rivalrv.com</p>
              </div>
            </div>
          </section>

          {/* Bottom nav */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
            <Link href="/legal/privacy" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Privacy Policy &rarr;
            </Link>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Rival RV, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

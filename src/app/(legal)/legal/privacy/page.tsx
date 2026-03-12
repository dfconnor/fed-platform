'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'collect', title: '1. Information We Collect' },
  { id: 'use', title: '2. How We Use Your Information' },
  { id: 'identity', title: '3. Identity Verification Data' },
  { id: 'payment', title: '4. Payment Information' },
  { id: 'cookies', title: '5. Cookies & Tracking' },
  { id: 'third-party', title: '6. Third-Party Services' },
  { id: 'sharing', title: '7. Data Sharing' },
  { id: 'retention', title: '8. Data Retention' },
  { id: 'rights', title: '9. Your Rights' },
  { id: 'security', title: '10. Security Measures' },
  { id: 'children', title: "11. Children's Privacy" },
  { id: 'changes', title: '12. Changes to Policy' },
  { id: 'contact', title: '13. Contact' },
];

export default function PrivacyPage() {
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
              Privacy Policy
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
          <section id="collect">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We collect the following categories of information when you use the Rival RV platform:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><span className="font-medium text-gray-700">Account Information:</span> Name, email address, phone number, date of birth, profile photo, and mailing address.</li>
                <li><span className="font-medium text-gray-700">Identity Verification Data:</span> Government-issued photo ID images, selfie photographs for biometric matching, and driving record information.</li>
                <li><span className="font-medium text-gray-700">Payment Information:</span> Billing address and payment method details (processed and stored by Stripe; we do not store full card numbers).</li>
                <li><span className="font-medium text-gray-700">Usage Data:</span> Pages visited, search queries, booking history, messaging activity, and interactions with listings.</li>
                <li><span className="font-medium text-gray-700">Device Information:</span> IP address, browser type, operating system, device identifiers, and screen resolution.</li>
                <li><span className="font-medium text-gray-700">Location Data:</span> Approximate location based on IP address; precise location only when you grant explicit permission through your device settings.</li>
              </ul>
            </div>
          </section>

          {/* 2 */}
          <section id="use">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Processing bookings, payments, payouts, and refunds</li>
                <li>Verifying user identities to maintain platform safety and trust</li>
                <li>Processing payments securely through Stripe</li>
                <li>Communicating with you about bookings, account activity, policy updates, and customer support</li>
                <li>Improving the Platform, including personalizing your experience and developing new features</li>
                <li>Detecting and preventing fraud, unauthorized access, and other illegal activities</li>
                <li>Complying with legal obligations, including tax reporting and law enforcement requests</li>
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section id="identity">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Identity Verification Data</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Identity verification is performed by our third-party provider, Persona. When you submit identity documents and biometric data for verification, this information is:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Stored encrypted at rest using AES-256 encryption</li>
                <li>Shared with Persona solely for the purpose of identity verification</li>
                <li>Retained for the duration required for regulatory compliance</li>
                <li>Deleted within 90 days of account closure, plus a 7-year retention period for compliance with financial regulations</li>
              </ul>
              <p>
                Biometric facial matching data is used only for identity verification and is not used for surveillance, advertising, or any other purpose. You may request deletion of your biometric data at any time, subject to regulatory retention requirements.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section id="payment">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Payment Information</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                All payment processing is handled by Stripe, a PCI DSS Level 1 compliant payment processor. Rival RV does not store, process, or have access to your full credit card numbers or bank account details.
              </p>
              <p>
                We store only the information necessary to display your payment methods (such as the last four digits of your card number and expiration date) and to process refunds or disputes. All payment data is transmitted using TLS 1.3 encryption.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section id="cookies">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Cookies &amp; Tracking</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We use the following types of cookies and tracking technologies:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><span className="font-medium text-gray-700">Essential Cookies:</span> Required for the Platform to function properly. These cannot be disabled.</li>
                <li><span className="font-medium text-gray-700">Analytics:</span> We use PostHog, a privacy-focused analytics platform, to understand how users interact with the Platform and to identify areas for improvement.</li>
              </ul>
              <p>
                We do not use third-party advertising trackers. We do not sell your browsing data to advertisers. We do not participate in cross-site tracking or ad exchanges.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section id="third-party">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We use the following third-party services to operate the Platform:</p>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Provider</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Stripe</td><td className="px-4 py-2.5">Payment processing, payouts, and financial compliance</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Persona</td><td className="px-4 py-2.5">Identity verification, document scanning, and biometric matching</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Mapbox</td><td className="px-4 py-2.5">Map rendering, geocoding, and location search</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Resend</td><td className="px-4 py-2.5">Transactional email delivery (booking confirmations, notifications)</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">PostHog</td><td className="px-4 py-2.5">Product analytics and feature usage tracking (privacy-focused, no ad tracking)</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Each third-party provider operates under its own privacy policy. We only share the minimum information necessary for each provider to perform its function.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section id="sharing">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Data Sharing</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                <span className="font-semibold text-gray-900">We never sell your personal data.</span> We share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><span className="font-medium text-gray-700">Verification Providers:</span> Identity and driving record data shared with Persona for verification purposes</li>
                <li><span className="font-medium text-gray-700">Payment Processors:</span> Payment data shared with Stripe for transaction processing</li>
                <li><span className="font-medium text-gray-700">Insurance Providers:</span> Booking and driver information shared with insurance underwriters to process coverage and claims</li>
                <li><span className="font-medium text-gray-700">Law Enforcement:</span> Information disclosed when required by law, court order, subpoena, or to protect the safety of our users</li>
                <li><span className="font-medium text-gray-700">Booking Counterparties:</span> Limited profile information (name, photo, verified status) shared between Hosts and Guests for active bookings</li>
              </ul>
            </div>
          </section>

          {/* 8 */}
          <section id="retention">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Data Retention</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We retain your data for the following periods:</p>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Data Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-900">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Account data</td><td className="px-4 py-2.5">Lifetime of account + 7 years after closure</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Booking records</td><td className="px-4 py-2.5">7 years (financial compliance)</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Verification photos</td><td className="px-4 py-2.5">3 years</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Messages</td><td className="px-4 py-2.5">3 years</td></tr>
                    <tr><td className="px-4 py-2.5 font-medium text-gray-700">Usage &amp; analytics data</td><td className="px-4 py-2.5">2 years</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                After the retention period expires, data is permanently deleted or anonymized. You may request earlier deletion of your data, subject to regulatory retention requirements.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section id="rights">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Your Rights</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">CCPA Rights (California)</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Right to know what data is collected</li>
                    <li>Right to delete your data</li>
                    <li>Right to opt-out of data sales (we do not sell data)</li>
                    <li>Right to non-discrimination for exercising rights</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">GDPR Rights (EU/UK)</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Right of access to your data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                    <li>Right to data portability</li>
                    <li>Right to restrict processing</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
              </div>
              <p>
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:privacy@rivalrv.com" className="text-brand-600 hover:text-brand-700 font-medium">
                  privacy@rivalrv.com
                </a>
                . We will respond within 30 days (or sooner if required by applicable law).
              </p>
            </div>
          </section>

          {/* 10 */}
          <section id="security">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Security Measures</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>All data encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
                <li>SOC 2 Type II compliance is an active goal, with annual third-party security audits</li>
                <li>Regular penetration testing and vulnerability assessments</li>
                <li>Role-based access controls for internal systems</li>
                <li>Multi-factor authentication required for all employee accounts</li>
                <li>Incident response plan with 72-hour breach notification commitment</li>
              </ul>
            </div>
          </section>

          {/* 11 */}
          <section id="children">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Children&rsquo;s Privacy</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                The Rival RV Platform is not intended for use by anyone under the age of 18. We do not knowingly collect personal information from individuals under 18 years of age. If we become aware that a user is under 18, we will promptly delete their account and all associated data.
              </p>
              <p>
                If you believe that a minor has provided us with personal information, please contact us immediately at{' '}
                <a href="mailto:privacy@rivalrv.com" className="text-brand-600 hover:text-brand-700 font-medium">
                  privacy@rivalrv.com
                </a>.
              </p>
            </div>
          </section>

          {/* 12 */}
          <section id="changes">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Changes to Policy</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                We may update this Privacy Policy from time to time. We will provide at least 30 days&rsquo; notice of any material changes by email and by posting a prominent notice on the Platform. Your continued use of the Platform after the changes take effect constitutes your acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* 13 */}
          <section id="contact">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>For privacy-related inquiries, data access requests, or complaints:</p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-1.5">
                <p className="font-semibold text-gray-900">Rival RV, Inc. &mdash; Privacy Team</p>
                <p>
                  Email:{' '}
                  <a href="mailto:privacy@rivalrv.com" className="text-brand-600 hover:text-brand-700 font-medium">
                    privacy@rivalrv.com
                  </a>
                </p>
                <p>
                  Data Protection Officer:{' '}
                  <a href="mailto:dpo@rivalrv.com" className="text-brand-600 hover:text-brand-700 font-medium">
                    dpo@rivalrv.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Bottom nav */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
            <div className="flex gap-6">
              <Link href="/legal/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                &larr; Terms of Service
              </Link>
              <Link href="/legal/rental-agreement" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Rental Agreement &rarr;
              </Link>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Rival RV, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

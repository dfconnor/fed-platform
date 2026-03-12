import Link from 'next/link';

export default function RentalAgreementPage() {
  return (
    <div>
      {/* Notice banner */}
      <div className="mb-8 rounded-xl bg-brand-50 border border-brand-200 p-4">
        <div className="flex gap-3">
          <svg className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <div className="text-sm text-brand-800">
            <p className="font-semibold">This is the standard rental agreement template.</p>
            <p className="mt-1 text-brand-700">
              Each booking generates a personalized agreement with specific terms, pricing, and vehicle details. Placeholders shown in [brackets] are filled automatically for each booking.
            </p>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* Document header */}
        <div className="bg-forest-900 text-white px-8 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-forest-700">
              <svg className="h-5 w-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18h18M5 18V8l7-5 7 5v10M3 18l3-3M21 18l-3-3" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold">
              Rival<span className="text-brand-400">RV</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
            RECREATIONAL VEHICLE<br />RENTAL AGREEMENT
          </h1>
          <p className="mt-2 text-sm text-gray-300">Agreement #[BOOKING-ID]</p>
        </div>

        <div className="px-6 sm:px-8 py-8 space-y-8">
          {/* Parties */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              1. Parties
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                This Recreational Vehicle Rental Agreement (&ldquo;Agreement&rdquo;) is entered into between:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Renter (&ldquo;Guest&rdquo;)</p>
                  <p className="font-semibold text-gray-900">[Guest Full Name]</p>
                  <p className="text-gray-500">[Guest Address]</p>
                  <p className="text-gray-500">License: [DL Number] &mdash; [State]</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Owner (&ldquo;Host&rdquo;)</p>
                  <p className="font-semibold text-gray-900">[Host Full Name]</p>
                  <p className="text-gray-500">[Host Address]</p>
                </div>
              </div>
              <p>
                Facilitated by <span className="font-semibold text-gray-900">Rival RV, Inc.</span> (&ldquo;Platform&rdquo;), a Delaware corporation.
              </p>
            </div>
          </section>

          {/* Vehicle */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              2. Vehicle Description
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div><span className="text-gray-400">Year / Make / Model:</span> <span className="text-gray-900 font-medium">[Year] [Make] [Model]</span></div>
                <div><span className="text-gray-400">RV Type:</span> <span className="text-gray-900 font-medium">[RV Type]</span></div>
                <div><span className="text-gray-400">Length:</span> <span className="text-gray-900 font-medium">[X] ft</span></div>
                <div><span className="text-gray-400">Sleeps:</span> <span className="text-gray-900 font-medium">[X]</span></div>
                <div className="col-span-2"><span className="text-gray-400">VIN:</span> <span className="text-gray-900 font-medium font-mono">[VIN]</span></div>
              </div>
            </div>
          </section>

          {/* Rental Period */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              3. Rental Period
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div><span className="text-gray-400">Start Date:</span> <span className="text-gray-900 font-medium">[Start Date]</span></div>
                <div><span className="text-gray-400">End Date:</span> <span className="text-gray-900 font-medium">[End Date]</span></div>
                <div><span className="text-gray-400">Duration:</span> <span className="text-gray-900 font-medium">[X] nights</span></div>
                <div><span className="text-gray-400">Pickup Time:</span> <span className="text-gray-900 font-medium">[Time]</span></div>
                <div><span className="text-gray-400">Return Time:</span> <span className="text-gray-900 font-medium">[Time]</span></div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              4. Pricing
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Nightly Rate</span><span className="text-gray-900 font-medium">$[X] x [X] nights</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cleaning Fee</span><span className="text-gray-900 font-medium">$[X]</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Insurance ([Tier])</span><span className="text-gray-900 font-medium">$[X]</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Service Fee (5%)</span><span className="text-gray-900 font-medium">$[X]</span></div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between font-semibold text-gray-900"><span>Total</span><span>$[Total]</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-gray-500"><span>Security Deposit (authorized hold)</span><span className="text-gray-900 font-medium">$[X]</span></div>
              </div>
            </div>
          </section>

          {/* Mileage & Generator */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              5. Mileage &amp; Generator
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Mileage Allowance</p>
                  <p className="text-gray-900 font-medium">[X] miles included / Unlimited</p>
                  <p className="text-gray-500 text-xs mt-1">Overage rate: $[X] per additional mile</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Generator Hours</p>
                  <p className="text-gray-900 font-medium">[X] hours included</p>
                  <p className="text-gray-500 text-xs mt-1">Overage rate: $[X] per additional hour</p>
                </div>
              </div>
            </div>
          </section>

          {/* Geographic Restrictions */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              6. Geographic Restrictions
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                The vehicle may be operated within the following geographic area: <span className="font-medium text-gray-900">[Allowed states/regions or &ldquo;No restrictions&rdquo;]</span>
              </p>
              <p className="mt-2">
                Operating the vehicle outside the permitted area constitutes a violation of this Agreement and may void insurance coverage.
              </p>
            </div>
          </section>

          {/* Vehicle Policies */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              7. Vehicle Policies
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <svg className="h-6 w-6 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Smoking</p>
                  <p className="text-gray-900 font-medium">No smoking / Allowed in designated areas</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <svg className="h-6 w-6 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Pets</p>
                  <p className="text-gray-900 font-medium">[Not allowed / Allowed with $[X] deposit]</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <svg className="h-6 w-6 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h17.25" />
                  </svg>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Towing</p>
                  <p className="text-gray-900 font-medium">Not permitted unless authorized</p>
                </div>
              </div>
            </div>
          </section>

          {/* Renter Responsibilities */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              8. Renter Responsibilities
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>The Renter agrees to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Possess a valid driver&rsquo;s license and be a minimum of 25 years of age</li>
                <li>Return the vehicle in the same condition as received, normal wear excepted</li>
                <li>Empty all waste tanks (black water, gray water) prior to return</li>
                <li>Return the vehicle with the same fuel level as at pickup</li>
                <li>Report any damage, mechanical issues, or accidents to the Owner and Platform immediately</li>
                <li>Comply with all traffic laws and regulations</li>
                <li>Not allow any unauthorized persons to operate the vehicle</li>
                <li>Complete the pre-trip and post-trip condition reports</li>
              </ul>
            </div>
          </section>

          {/* Insurance Coverage */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              9. Insurance Coverage
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div><span className="text-gray-400">Plan:</span> <span className="text-gray-900 font-medium">[Tier] Plan</span></div>
                <div><span className="text-gray-400">Provider:</span> <span className="text-gray-900 font-medium">[Provider]</span></div>
                <div><span className="text-gray-400">Liability Coverage:</span> <span className="text-gray-900 font-medium">$[X]</span></div>
                <div><span className="text-gray-400">Collision Coverage:</span> <span className="text-gray-900 font-medium">$[X]</span></div>
                <div><span className="text-gray-400">Deductible:</span> <span className="text-gray-900 font-medium">$[X]</span></div>
              </div>
            </div>
          </section>

          {/* Security Deposit */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              10. Security Deposit
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                A security deposit of <span className="font-semibold text-gray-900">$[X]</span> will be authorized as a hold on the Renter&rsquo;s payment method. The hold will be released <span className="font-semibold text-gray-900">[X] days</span> after the vehicle is returned, provided no damage claim is filed.
              </p>
              <p>
                If a damage claim is filed, the deposit may be partially or fully captured to cover documented damages, cleaning costs, or policy violations.
              </p>
            </div>
          </section>

          {/* Damage Liability */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              11. Damage Liability
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>
                The Renter is responsible for all damage to the vehicle that occurs during the rental period, including damage caused by weather, road conditions, animals, or third parties. The Owner has 7 days after the trip end date to file a damage claim through the Platform.
              </p>
              <p>
                Disputes regarding damage claims are mediated by the Platform. Both parties agree to cooperate fully with the investigation and abide by the Platform&rsquo;s resolution.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              12. Indemnification
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                The Renter agrees to indemnify, defend, and hold harmless the Owner and the Platform, including their officers, directors, employees, and agents, from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney&rsquo;s fees) arising from or related to the Renter&rsquo;s use of the vehicle, breach of this Agreement, or violation of any applicable law.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              13. Governing Law
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of <span className="font-semibold text-gray-900">[Host&rsquo;s State]</span>, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          {/* Signatures */}
          <section>
            <h2 className="text-base font-bold text-forest-800 uppercase tracking-wide border-b-2 border-forest-200 pb-2 mb-4">
              14. Signatures
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="mb-6">
                By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms of this Agreement. Electronic signatures are legally binding under the E-SIGN Act and UETA.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Guest (Renter)</p>
                  <div className="h-16 border-b-2 border-gray-300 mb-2" />
                  <p className="text-gray-900 font-medium">[Guest Full Name]</p>
                  <p className="text-gray-400 text-xs">Date: [Date] &bull; IP: [IP Address]</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Host (Owner)</p>
                  <div className="h-16 border-b-2 border-gray-300 mb-2" />
                  <p className="text-gray-900 font-medium">[Host Full Name]</p>
                  <p className="text-gray-400 text-xs">Date: [Date] &bull; IP: [IP Address]</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-6">
          <Link href="/legal/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            &larr; Terms of Service
          </Link>
          <Link href="/policies/cancellation" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Cancellation Policy &rarr;
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Rival RV, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}

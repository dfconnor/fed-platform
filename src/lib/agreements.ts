/**
 * Rental Agreement Business Logic
 *
 * Generates, renders, signs, and manages rental agreements for RV bookings.
 * Agreements are legally binding documents between hosts and guests.
 */
import { prisma } from '@/lib/prisma';
import { AGREEMENT_VERSION, formatCentsDecimal } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────

interface SignatureData {
  signature: string; // data URL or typed name
  signatureType: 'drawn' | 'typed';
  ipAddress: string;
  userAgent: string;
}

// ─── Agreement Generation ─────────────────────────────────────────────────

/**
 * Generate a rental agreement for a booking.
 * Fetches the booking with listing, guest, and host details, determines
 * terms from listing rules/features, generates full legal agreement HTML,
 * and creates a RentalAgreement record with status PENDING_GUEST.
 */
export async function generateAgreement(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: {
        include: {
          host: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      guest: {
        select: { id: true, name: true, email: true, phone: true },
      },
      host: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Check if agreement already exists
  const existing = await prisma.rentalAgreement.findUnique({
    where: { bookingId },
  });

  if (existing) {
    return existing;
  }

  const listing = booking.listing;
  const features = listing.features || [];

  // Determine terms from listing features and rules
  const petPolicy = features.includes('pet_friendly')
    ? 'allowed'
    : 'not_allowed';
  const smokingPolicy = features.includes('smoking_allowed')
    ? 'allowed_outdoors'
    : 'no_smoking';
  const towingAllowed = features.includes('tow_hitch');

  // Default mileage/generator limits
  const mileageLimit = 100; // miles per day
  const generatorHoursLimit = features.includes('off_grid') ? null : 4; // hours per day

  // Geographic restrictions based on listing location
  const geographicRestrictions =
    'Continental United States only. No cross-border travel to Mexico or Canada without prior written consent from the Owner.';

  // Generate the full terms HTML
  const termsContent = renderAgreementHtml(
    {
      version: AGREEMENT_VERSION,
      mileageLimit: mileageLimit * booking.nights,
      generatorHoursLimit: generatorHoursLimit
        ? generatorHoursLimit * booking.nights
        : null,
      geographicRestrictions,
      petPolicy,
      smokingPolicy,
      towingAllowed,
    },
    booking,
    listing,
    booking.guest,
    booking.host
  );

  // Create the agreement record
  const agreement = await prisma.rentalAgreement.create({
    data: {
      bookingId,
      version: AGREEMENT_VERSION,
      termsContent,
      mileageLimit: mileageLimit * booking.nights,
      generatorHoursLimit: generatorHoursLimit
        ? generatorHoursLimit * booking.nights
        : null,
      geographicRestrictions,
      petPolicy,
      smokingPolicy,
      towingAllowed,
      status: 'PENDING_GUEST',
    },
  });

  return agreement;
}

// ─── Agreement Rendering ──────────────────────────────────────────────────

/**
 * Render the full agreement HTML document with all booking data filled in.
 */
export function renderAgreementHtml(
  terms: {
    version: string;
    mileageLimit: number | null;
    generatorHoursLimit: number | null;
    geographicRestrictions: string | null;
    petPolicy: string;
    smokingPolicy: string;
    towingAllowed: boolean;
  },
  booking: any,
  listing: any,
  guest: any,
  host: any
): string {
  const startDate = new Date(booking.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const effectiveDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const vehicleDescription = `${listing.year} ${listing.make} ${listing.model}`;
  const vehicleType = listing.rvType.replace(/_/g, ' ');
  const vehicleLength = listing.length ? `${listing.length} ft` : 'N/A';
  const sleeps = listing.sleeps || 'N/A';

  const petPolicyText =
    terms.petPolicy === 'allowed'
      ? 'Pets are permitted inside the Vehicle. Renter is responsible for any pet-related damage, including but not limited to stains, odors, scratches, and hair. An additional cleaning surcharge may apply.'
      : terms.petPolicy === 'allowed_with_deposit'
        ? 'Pets are permitted with a non-refundable pet deposit. Renter is fully responsible for all pet-related damage.'
        : 'No pets are permitted inside or around the Vehicle at any time. Violation of this policy will result in forfeiture of the security deposit and potential additional charges.';

  const smokingPolicyText =
    terms.smokingPolicy === 'no_smoking'
      ? 'Smoking (including e-cigarettes, vaporizers, and cannabis) is strictly prohibited inside the Vehicle. Violation will result in a minimum $250 cleaning fee deducted from the security deposit.'
      : 'Smoking is permitted in designated outdoor areas only (e.g., awning area). Smoking inside the Vehicle is strictly prohibited and will result in a minimum $250 cleaning fee.';

  const towingText = terms.towingAllowed
    ? 'Towing is permitted provided the total towed weight does not exceed the Vehicle manufacturer\'s rated towing capacity. Renter is responsible for all towing-related equipment and any damage caused by towing.'
    : 'Towing of any kind is strictly prohibited. Renter shall not attach any trailer, boat, or other towable equipment to the Vehicle.';

  const mileageText = terms.mileageLimit
    ? `${terms.mileageLimit.toLocaleString()} total miles for the rental period. Excess mileage will be charged at $0.35 per mile.`
    : 'Unlimited mileage for the duration of the rental period.';

  const generatorText = terms.generatorHoursLimit
    ? `${terms.generatorHoursLimit} total generator hours for the rental period. Excess usage will be charged at $5.00 per hour.`
    : 'Unlimited generator usage for the duration of the rental period.';

  const cancellationText =
    booking.cancellationPolicy === 'FLEXIBLE'
      ? 'Full refund if cancelled at least 24 hours before the rental start date. No refund for cancellations made less than 24 hours before the start date.'
      : booking.cancellationPolicy === 'MODERATE'
        ? 'Full refund if cancelled at least 7 days before the rental start date. 50% refund for cancellations made 3-7 days before. No refund for cancellations within 3 days of the start date.'
        : 'Full refund if cancelled at least 30 days before the rental start date. 50% refund for cancellations made 14-30 days before. No refund for cancellations within 14 days of the start date.';

  const insuranceTierLabel =
    booking.insuranceTier === 'BASIC'
      ? 'Basic Protection'
      : booking.insuranceTier === 'ESSENTIAL'
        ? 'Essential Protection'
        : 'Premium Protection';

  return `
<div class="agreement-document">
  <div class="agreement-header">
    <h1>RECREATIONAL VEHICLE RENTAL AGREEMENT</h1>
    <p class="agreement-meta">Agreement Version ${terms.version} | Rival RV Marketplace</p>
    <p class="agreement-meta">Agreement ID: Will be assigned upon execution</p>
    <p class="agreement-meta">Effective Date: ${effectiveDate}</p>
  </div>

  <section class="agreement-section">
    <h2>1. PARTIES</h2>
    <p>This Recreational Vehicle Rental Agreement ("Agreement") is entered into between:</p>
    <div class="agreement-parties">
      <div class="party">
        <p><strong>Owner/Host ("Owner"):</strong></p>
        <p>Name: ${host.name || 'N/A'}</p>
        <p>Email: ${host.email || 'N/A'}</p>
      </div>
      <div class="party">
        <p><strong>Renter/Guest ("Renter"):</strong></p>
        <p>Name: ${guest.name || 'N/A'}</p>
        <p>Email: ${guest.email || 'N/A'}</p>
      </div>
    </div>
    <p>Both parties agree to be bound by the terms and conditions set forth in this Agreement, facilitated through the Rival RV platform ("Platform").</p>
  </section>

  <section class="agreement-section">
    <h2>2. VEHICLE DESCRIPTION</h2>
    <table class="agreement-table">
      <tr><td><strong>Vehicle:</strong></td><td>${vehicleDescription}</td></tr>
      <tr><td><strong>Type:</strong></td><td>${vehicleType}</td></tr>
      <tr><td><strong>Length:</strong></td><td>${vehicleLength}</td></tr>
      <tr><td><strong>Sleeps:</strong></td><td>${sleeps}</td></tr>
      <tr><td><strong>Listing:</strong></td><td>${listing.title}</td></tr>
    </table>
  </section>

  <section class="agreement-section">
    <h2>3. RENTAL PERIOD</h2>
    <table class="agreement-table">
      <tr><td><strong>Pickup Date:</strong></td><td>${startDate}</td></tr>
      <tr><td><strong>Return Date:</strong></td><td>${endDate}</td></tr>
      <tr><td><strong>Duration:</strong></td><td>${booking.nights} night${booking.nights !== 1 ? 's' : ''}</td></tr>
      <tr><td><strong>Guests:</strong></td><td>${booking.guestCount}</td></tr>
    </table>
    <p>The Vehicle must be returned by 11:00 AM on the return date unless otherwise agreed in writing. Late returns will incur a fee of $50 per hour for the first 4 hours. Returns more than 4 hours late will be charged an additional full night's rate.</p>
  </section>

  <section class="agreement-section">
    <h2>4. RENTAL FEES AND PAYMENT</h2>
    <table class="agreement-table">
      <tr><td><strong>Nightly Rate:</strong></td><td>${formatCentsDecimal(booking.nightlyTotal / booking.nights)} x ${booking.nights} nights</td></tr>
      <tr><td><strong>Nightly Total:</strong></td><td>${formatCentsDecimal(booking.nightlyTotal)}</td></tr>
      ${booking.cleaningFee > 0 ? `<tr><td><strong>Cleaning Fee:</strong></td><td>${formatCentsDecimal(booking.cleaningFee)}</td></tr>` : ''}
      ${booking.deliveryFee > 0 ? `<tr><td><strong>Delivery Fee:</strong></td><td>${formatCentsDecimal(booking.deliveryFee)}</td></tr>` : ''}
      ${booking.addOnsTotal > 0 ? `<tr><td><strong>Add-Ons:</strong></td><td>${formatCentsDecimal(booking.addOnsTotal)}</td></tr>` : ''}
      ${booking.insuranceFee > 0 ? `<tr><td><strong>Insurance (${insuranceTierLabel}):</strong></td><td>${formatCentsDecimal(booking.insuranceFee)}</td></tr>` : ''}
      ${booking.platformFeeGuest > 0 ? `<tr><td><strong>Service Fee:</strong></td><td>${formatCentsDecimal(booking.platformFeeGuest)}</td></tr>` : ''}
      ${booking.discount > 0 ? `<tr><td><strong>Discount:</strong></td><td>-${formatCentsDecimal(booking.discount)}</td></tr>` : ''}
      <tr class="agreement-total"><td><strong>Total:</strong></td><td><strong>${formatCentsDecimal(booking.total)}</strong></td></tr>
    </table>
  </section>

  <section class="agreement-section">
    <h2>5. SECURITY DEPOSIT</h2>
    <p>A security deposit of <strong>${formatCentsDecimal(booking.securityDeposit)}</strong> will be authorized (held) on the Renter's payment method prior to the rental start date. This deposit serves as security against damage, excess cleaning, traffic violations, toll charges, fuel replacement, and any other charges arising from the Renter's use of the Vehicle.</p>
    <p>The security deposit hold will be released within 3 business days after the Vehicle is returned in satisfactory condition, as determined through the post-trip condition inspection. If a damage claim is filed, the deposit hold will be maintained until the claim is resolved.</p>
  </section>

  <section class="agreement-section">
    <h2>6. MILEAGE AND GENERATOR LIMITS</h2>
    <table class="agreement-table">
      <tr><td><strong>Mileage Allowance:</strong></td><td>${mileageText}</td></tr>
      <tr><td><strong>Generator Hours:</strong></td><td>${generatorText}</td></tr>
    </table>
    <p>Mileage and generator hours will be recorded at pickup and return via the condition report process.</p>
  </section>

  <section class="agreement-section">
    <h2>7. GEOGRAPHIC RESTRICTIONS</h2>
    <p>${terms.geographicRestrictions || 'No geographic restrictions apply.'}</p>
    <p>The Renter agrees not to operate the Vehicle on unpaved roads, beaches, or off-road terrain unless the Vehicle is specifically designated as off-road capable and prior written approval has been obtained from the Owner.</p>
  </section>

  <section class="agreement-section">
    <h2>8. PET POLICY</h2>
    <p>${petPolicyText}</p>
  </section>

  <section class="agreement-section">
    <h2>9. SMOKING POLICY</h2>
    <p>${smokingPolicyText}</p>
  </section>

  <section class="agreement-section">
    <h2>10. TOWING POLICY</h2>
    <p>${towingText}</p>
  </section>

  <section class="agreement-section">
    <h2>11. RENTER RESPONSIBILITIES</h2>
    <p>The Renter agrees to:</p>
    <ol type="a">
      <li>Operate the Vehicle in a safe and lawful manner at all times.</li>
      <li>Maintain a valid driver's license appropriate for the Vehicle class throughout the rental period.</li>
      <li>Not permit any unlicensed or unauthorized person to operate the Vehicle.</li>
      <li>Not use the Vehicle for any commercial purpose, racing, or illegal activity.</li>
      <li>Not sublease or transfer the Vehicle to any third party.</li>
      <li>Return the Vehicle with the same fuel level as at pickup, or pay a refueling fee of $5.00 per gallon below the pickup level.</li>
      <li>Properly dispose of waste water (gray and black tanks) before returning the Vehicle.</li>
      <li>Report any mechanical issues, accidents, or damage to both the Owner and the Platform immediately.</li>
      <li>Comply with all applicable traffic laws, campground rules, and local ordinances.</li>
      <li>Not exceed the Vehicle's rated passenger or sleeping capacity.</li>
      <li>Secure all interior items before driving to prevent damage from shifting.</li>
    </ol>
  </section>

  <section class="agreement-section">
    <h2>12. INSURANCE COVERAGE</h2>
    <p>This rental includes <strong>${insuranceTierLabel}</strong> coverage provided through the Rival RV insurance program${booking.insuranceProvider ? ` (underwritten by ${booking.insuranceProvider})` : ''}.</p>
    <p>Coverage is subject to the terms, conditions, exclusions, and deductibles of the applicable insurance policy. The Renter acknowledges that insurance does not cover:</p>
    <ul>
      <li>Damage resulting from Renter negligence or intentional acts</li>
      <li>Damage occurring while the Vehicle is operated by an unauthorized driver</li>
      <li>Damage from off-road use unless expressly permitted</li>
      <li>Personal belongings of the Renter (unless covered by the selected tier)</li>
      <li>Damage resulting from a violation of this Agreement</li>
    </ul>
    <p>The Renter is responsible for any deductible amount applicable under the insurance policy.</p>
  </section>

  <section class="agreement-section">
    <h2>13. DAMAGE AND LIABILITY</h2>
    <p>The Renter is financially responsible for any damage to the Vehicle during the rental period, whether covered by insurance or not, including the applicable deductible. Damage includes but is not limited to:</p>
    <ul>
      <li>Exterior damage (dents, scratches, cracks, roof damage from clearance errors)</li>
      <li>Interior damage (stains, burns, tears, broken fixtures or appliances)</li>
      <li>Mechanical damage resulting from misuse or negligence</li>
      <li>Tire damage, including blowouts caused by overloading or improper inflation</li>
      <li>Water damage from improper winterization or leaving windows/vents open</li>
    </ul>
    <p>The Owner will document Vehicle condition through the Platform's condition report system at pickup and return. The Renter has the right to review and dispute the condition report within 24 hours of return.</p>
    <p>Damage claims must be filed within 7 days of the Vehicle's return date. The security deposit may be applied toward approved damage claims.</p>
  </section>

  <section class="agreement-section">
    <h2>14. CONDITION REPORTS</h2>
    <p>Both parties agree to participate in the Platform's condition report process:</p>
    <ol type="a">
      <li><strong>Departure Report:</strong> The Owner (or Renter, if self-pickup) will complete a departure condition report documenting the Vehicle's condition, mileage, and fuel level at the start of the rental.</li>
      <li><strong>Return Report:</strong> The Owner (or Renter, if self-return) will complete a return condition report documenting the Vehicle's condition upon return.</li>
    </ol>
    <p>Both reports include timestamped photographs and are stored on the Platform as an official record.</p>
  </section>

  <section class="agreement-section">
    <h2>15. CANCELLATION POLICY</h2>
    <p>This booking is subject to the <strong>${booking.cancellationPolicy.charAt(0) + booking.cancellationPolicy.slice(1).toLowerCase()}</strong> cancellation policy:</p>
    <p>${cancellationText}</p>
    <p>Cancellations are processed through the Platform. Refunds will be returned to the original payment method within 5-10 business days.</p>
  </section>

  <section class="agreement-section">
    <h2>16. RETURN CONDITIONS</h2>
    <p>The Renter agrees to return the Vehicle:</p>
    <ol type="a">
      <li>On or before the agreed return date and time.</li>
      <li>To the agreed pickup/return location.</li>
      <li>In the same condition as received, subject to normal wear and tear.</li>
      <li>With all keys, remotes, accessories, and equipment provided at pickup.</li>
      <li>With gray and black water tanks emptied and rinsed.</li>
      <li>With fuel at the same level as at pickup.</li>
      <li>In a reasonably clean condition (excessive cleaning will be charged against the deposit).</li>
    </ol>
  </section>

  <section class="agreement-section">
    <h2>17. BREAKDOWN AND EMERGENCY</h2>
    <p>In the event of a mechanical breakdown or emergency:</p>
    <ol type="a">
      <li>Contact the Owner immediately through the Platform's messaging system.</li>
      <li>If the ${insuranceTierLabel} plan includes roadside assistance, contact the insurance provider's 24/7 helpline.</li>
      <li>Do not authorize any repairs exceeding $100 without prior written approval from the Owner.</li>
      <li>In case of an accident, contact local law enforcement, exchange information with other parties, and document the scene with photographs.</li>
    </ol>
  </section>

  <section class="agreement-section">
    <h2>18. INDEMNIFICATION</h2>
    <p>The Renter agrees to indemnify, defend, and hold harmless the Owner and the Platform from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to:</p>
    <ol type="a">
      <li>The Renter's use or operation of the Vehicle.</li>
      <li>Any breach of this Agreement by the Renter.</li>
      <li>Any injury to persons or damage to property caused by the Renter's operation of the Vehicle.</li>
      <li>Any fines, penalties, or toll charges incurred during the rental period.</li>
    </ol>
  </section>

  <section class="agreement-section">
    <h2>19. DISPUTE RESOLUTION</h2>
    <p>In the event of a dispute arising under this Agreement, the parties agree to first attempt resolution through the Platform's dispute resolution process. If a resolution cannot be reached, the parties agree to submit to binding arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules. The arbitration shall be conducted in the state where the Vehicle is registered.</p>
    <p>Each party shall bear its own costs and attorneys' fees unless the arbitrator determines that a party's claims or defenses were frivolous, in which case the prevailing party may be awarded reasonable costs and fees.</p>
  </section>

  <section class="agreement-section">
    <h2>20. GOVERNING LAW</h2>
    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of ${listing.state || 'Colorado'}, without regard to its conflict of laws provisions. The parties consent to the exclusive jurisdiction of the courts located in ${listing.state || 'Colorado'} for any proceedings not subject to arbitration.</p>
  </section>

  <section class="agreement-section">
    <h2>21. ELECTRONIC SIGNATURE</h2>
    <p>Both parties acknowledge and agree that electronic signatures applied through the Rival RV Platform constitute valid, binding signatures under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Uniform Electronic Transactions Act (UETA). Each party agrees that their electronic signature has the same legal effect as a handwritten signature.</p>
  </section>

  <section class="agreement-section">
    <h2>22. ENTIRE AGREEMENT</h2>
    <p>This Agreement, together with the Platform's Terms of Service and Privacy Policy, constitutes the entire agreement between the parties with respect to the rental of the Vehicle. Any modifications to this Agreement must be made in writing through the Platform and agreed to by both parties.</p>
  </section>

  <section class="agreement-section">
    <h2>23. SEVERABILITY</h2>
    <p>If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
  </section>

  <div class="agreement-signature-block">
    <h2>SIGNATURES</h2>
    <p>By signing below, both parties acknowledge that they have read, understood, and agree to be bound by all terms and conditions of this Rental Agreement.</p>

    <div class="signature-lines">
      <div class="signature-line">
        <p class="signature-label">Owner/Host</p>
        <p class="signature-name">${host.name || 'N/A'}</p>
        <div class="signature-placeholder">____________________________</div>
        <p class="signature-date-label">Date: ____________________________</p>
      </div>
      <div class="signature-line">
        <p class="signature-label">Renter/Guest</p>
        <p class="signature-name">${guest.name || 'N/A'}</p>
        <div class="signature-placeholder">____________________________</div>
        <p class="signature-date-label">Date: ____________________________</p>
      </div>
    </div>
  </div>
</div>
`.trim();
}

// ─── Agreement Signing ────────────────────────────────────────────────────

/**
 * Sign the agreement as either guest or host.
 * Determines the user's role based on the associated booking,
 * records the signature, and updates agreement status accordingly.
 */
export async function signAgreement(
  agreementId: string,
  userId: string,
  data: SignatureData
) {
  const agreement = await prisma.rentalAgreement.findUnique({
    where: { id: agreementId },
    include: {
      booking: {
        select: { guestId: true, hostId: true },
      },
    },
  });

  if (!agreement) {
    throw new Error('Agreement not found');
  }

  if (agreement.status === 'VOIDED') {
    throw new Error('Agreement has been voided');
  }

  if (agreement.status === 'SIGNED') {
    throw new Error('Agreement is already fully signed');
  }

  const isGuest = agreement.booking.guestId === userId;
  const isHost = agreement.booking.hostId === userId;

  if (!isGuest && !isHost) {
    throw new Error('User is not a party to this agreement');
  }

  const now = new Date();
  const updateData: any = {};

  if (isGuest) {
    if (agreement.guestSignedAt) {
      throw new Error('Guest has already signed this agreement');
    }
    updateData.guestSignedAt = now;
    updateData.guestSignature = data.signature;
    updateData.guestSignatureType = data.signatureType;
    updateData.guestIpAddress = data.ipAddress;
    updateData.guestUserAgent = data.userAgent;

    // If host has already signed, mark as fully signed; otherwise pending host
    if (agreement.hostSignedAt) {
      updateData.status = 'SIGNED';
    } else {
      updateData.status = 'PENDING_HOST';
    }
  } else if (isHost) {
    if (agreement.hostSignedAt) {
      throw new Error('Host has already signed this agreement');
    }
    updateData.hostSignedAt = now;
    updateData.hostSignature = data.signature;
    updateData.hostSignatureType = data.signatureType;
    updateData.hostIpAddress = data.ipAddress;
    updateData.hostUserAgent = data.userAgent;

    // If guest has already signed, mark as fully signed; otherwise pending guest
    if (agreement.guestSignedAt) {
      updateData.status = 'SIGNED';
    } else {
      updateData.status = 'PENDING_GUEST';
    }
  }

  const updated = await prisma.rentalAgreement.update({
    where: { id: agreementId },
    data: updateData,
  });

  return updated;
}

// ─── Agreement Helpers ────────────────────────────────────────────────────

/**
 * Check if both parties have signed the agreement.
 */
export function isFullySigned(agreement: any): boolean {
  return (
    agreement.guestSignedAt !== null &&
    agreement.hostSignedAt !== null &&
    agreement.status === 'SIGNED'
  );
}

/**
 * Void an agreement (typically on booking cancellation).
 * Sets the status to VOIDED.
 */
export async function voidAgreement(
  agreementId: string,
  _reason: string
): Promise<void> {
  const agreement = await prisma.rentalAgreement.findUnique({
    where: { id: agreementId },
  });

  if (!agreement) {
    throw new Error('Agreement not found');
  }

  if (agreement.status === 'VOIDED') {
    return; // Already voided
  }

  await prisma.rentalAgreement.update({
    where: { id: agreementId },
    data: {
      status: 'VOIDED',
    },
  });
}

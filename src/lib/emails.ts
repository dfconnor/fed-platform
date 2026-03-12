/**
 * Email notification stubs using Resend.
 * In production, these send real emails via the Resend API
 * (already configured in auth.ts for magic link emails).
 */

const FROM_EMAIL = 'Rival RV <noreply@rivalrv.com>';
const SUPPORT_EMAIL = 'support@rivalrv.com';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// ---------------------------------------------------------------------------
// Send helper (stub - replace with Resend SDK in production)
// ---------------------------------------------------------------------------

async function sendEmail(options: EmailOptions): Promise<{ success: boolean }> {
  // In production:
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: FROM_EMAIL, ...options });

  console.log(`[Email Stub] To: ${options.to} | Subject: ${options.subject}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Verification Emails
// ---------------------------------------------------------------------------

export async function sendVerificationComplete(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Your identity has been verified — Rival RV',
    html: `
      <h2>You're verified, ${name}!</h2>
      <p>Your identity verification is complete. You now have a verified badge on your profile.</p>
      <p>You can now book RVs instantly and enjoy the full Rival RV experience.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/guest">Go to Dashboard</a>
    `,
  });
}

export async function sendVerificationFailed(email: string, name: string, reason: string) {
  return sendEmail({
    to: email,
    subject: 'Verification update — Rival RV',
    html: `
      <h2>Verification update</h2>
      <p>Hi ${name}, we weren't able to complete your identity verification.</p>
      <p>Reason: ${reason}</p>
      <p>You can try again or contact our support team for help.</p>
      <a href="${process.env.NEXTAUTH_URL}/verify">Try Again</a>
    `,
  });
}

// ---------------------------------------------------------------------------
// Agreement Emails
// ---------------------------------------------------------------------------

export async function sendAgreementReady(email: string, name: string, bookingRef: string, agreementUrl: string) {
  return sendEmail({
    to: email,
    subject: `Rental agreement ready to sign — ${bookingRef}`,
    html: `
      <h2>Your rental agreement is ready</h2>
      <p>Hi ${name}, the rental agreement for booking ${bookingRef} is ready for your signature.</p>
      <p>Please review and sign the agreement to complete your booking.</p>
      <a href="${agreementUrl}">Review & Sign Agreement</a>
    `,
  });
}

export async function sendAgreementFullySigned(email: string, name: string, bookingRef: string) {
  return sendEmail({
    to: email,
    subject: `Rental agreement signed — ${bookingRef}`,
    html: `
      <h2>Agreement complete!</h2>
      <p>Hi ${name}, both parties have signed the rental agreement for booking ${bookingRef}.</p>
      <p>Your trip is confirmed. You can view and download the agreement from your dashboard.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/guest">View Dashboard</a>
    `,
  });
}

// ---------------------------------------------------------------------------
// Condition Report Emails
// ---------------------------------------------------------------------------

export async function sendConditionReportReminder(email: string, name: string, bookingRef: string, type: 'departure' | 'return') {
  const action = type === 'departure' ? 'pre-trip' : 'post-trip';
  return sendEmail({
    to: email,
    subject: `Complete your ${action} condition report — ${bookingRef}`,
    html: `
      <h2>Time for your ${action} report</h2>
      <p>Hi ${name}, please complete the ${action} condition report for booking ${bookingRef}.</p>
      <p>This protects both you and the ${type === 'departure' ? 'host' : 'renter'} by documenting the vehicle's condition.</p>
      <a href="${process.env.NEXTAUTH_URL}/booking/${bookingRef}/condition-report">Complete Report</a>
    `,
  });
}

// ---------------------------------------------------------------------------
// Damage Claim Emails
// ---------------------------------------------------------------------------

export async function sendClaimFiled(email: string, guestName: string, bookingRef: string, amount: string) {
  return sendEmail({
    to: email,
    subject: `Damage claim filed — ${bookingRef}`,
    html: `
      <h2>A damage claim has been filed</h2>
      <p>Hi ${guestName}, the host has filed a damage claim of ${amount} for booking ${bookingRef}.</p>
      <p>You have 3 days to review the claim and submit your response.</p>
      <a href="${process.env.NEXTAUTH_URL}/booking/${bookingRef}/damage-claim">Review Claim</a>
    `,
  });
}

export async function sendClaimResolved(email: string, name: string, bookingRef: string, outcome: string) {
  return sendEmail({
    to: email,
    subject: `Damage claim resolved — ${bookingRef}`,
    html: `
      <h2>Claim resolved</h2>
      <p>Hi ${name}, the damage claim for booking ${bookingRef} has been resolved.</p>
      <p>Outcome: ${outcome}</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/guest">View Dashboard</a>
    `,
  });
}

// ---------------------------------------------------------------------------
// Deposit Emails
// ---------------------------------------------------------------------------

export async function sendDepositReleased(email: string, name: string, bookingRef: string, amount: string) {
  return sendEmail({
    to: email,
    subject: `Security deposit released — ${bookingRef}`,
    html: `
      <h2>Deposit released</h2>
      <p>Hi ${name}, the security deposit of ${amount} for booking ${bookingRef} has been released back to your payment method.</p>
      <p>It may take 5-10 business days to appear on your statement.</p>
    `,
  });
}

export async function sendDepositCaptured(email: string, name: string, bookingRef: string, amount: string, reason: string) {
  return sendEmail({
    to: email,
    subject: `Security deposit captured — ${bookingRef}`,
    html: `
      <h2>Deposit captured</h2>
      <p>Hi ${name}, ${amount} of your security deposit for booking ${bookingRef} has been captured.</p>
      <p>Reason: ${reason}</p>
      <p>If you have questions, please contact our support team.</p>
      <a href="mailto:${SUPPORT_EMAIL}">Contact Support</a>
    `,
  });
}

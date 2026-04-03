import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "Fed <noreply@getfed.com>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend in production, or log to console in development.
 * Returns true if the email was sent (or logged) successfully.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!resend) {
    console.info(`[email] (dev) To: ${to} | Subject: ${subject}`);
    console.info(`[email] (dev) Body:\n${html}\n`);
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}

// ============================================
// Email templates
// ============================================

/**
 * Password reset email template.
 */
export function passwordResetEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your Fed password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h2 style="margin: 0 0 16px;">Reset your password</h2>
        <p style="color: #555; line-height: 1.6;">
          We received a request to reset your Fed account password. Click the button below to choose a new password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #E63946; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Reset password
        </a>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };
}

/**
 * Order confirmation email template.
 */
export function orderConfirmationEmail(orderNumber: string, total: string): { subject: string; html: string } {
  return {
    subject: `Order ${orderNumber} confirmed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h2 style="margin: 0 0 16px;">Order confirmed!</h2>
        <p style="color: #555; line-height: 1.6;">
          Your order <strong>${orderNumber}</strong> has been placed successfully.
        </p>
        <p style="color: #555; line-height: 1.6;">
          Total: <strong>${total}</strong>
        </p>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          You'll receive updates as your order is prepared. Thank you for ordering with Fed!
        </p>
      </div>
    `,
  };
}

/**
 * Support ticket acknowledgment email template.
 */
export function supportAcknowledgmentEmail(name: string, subject: string): { subject: string; html: string } {
  return {
    subject: `Re: ${subject} — We've received your message`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h2 style="margin: 0 0 16px;">We got your message, ${name}</h2>
        <p style="color: #555; line-height: 1.6;">
          Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
        </p>
        <p style="color: #555; line-height: 1.6;">
          <strong>Subject:</strong> ${subject}
        </p>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          If you need immediate help, reply to this email or contact us at support@getfed.com.
        </p>
      </div>
    `,
  };
}

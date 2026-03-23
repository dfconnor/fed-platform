import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Fed collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 17, 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-0 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <section>
            <h2>What we collect</h2>
            <p>
              We collect only what we need to process your orders and run the
              platform:
            </p>
            <ul>
              <li>
                <strong>Account info:</strong> name, email address, and hashed
                password when you create an account.
              </li>
              <li>
                <strong>Order info:</strong> items ordered, restaurant, order
                type, payment method, and contact details you provide at
                checkout.
              </li>
              <li>
                <strong>Restaurant info:</strong> business name, menu, pricing,
                and settings provided by restaurant owners.
              </li>
              <li>
                <strong>Usage data:</strong> basic analytics (page views, feature
                usage) to improve the platform. No tracking cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2>What we don't collect</h2>
            <ul>
              <li>
                We never see or store your payment card details — all payments
                are processed securely by Stripe.
              </li>
              <li>We don't sell your data to anyone. Period.</li>
              <li>
                We don't use third-party ad trackers or share data with
                advertising networks.
              </li>
            </ul>
          </section>

          <section>
            <h2>How we use your data</h2>
            <ul>
              <li>To process and fulfill your orders.</li>
              <li>To let restaurants manage their menus and view order history.</li>
              <li>To send order confirmations and status updates.</li>
              <li>To improve platform features and fix bugs.</li>
              <li>To respond to support requests.</li>
            </ul>
          </section>

          <section>
            <h2>Who sees your data</h2>
            <p>
              When you place an order, the restaurant receives your name, email,
              phone (if provided), and order details. This is necessary to
              prepare and communicate about your order.
            </p>
            <p className="mt-2">
              We use Stripe for payment processing. Stripe handles your payment
              information under their own{" "}
              <a
                href="https://stripe.com/privacy"
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Data retention</h2>
            <p>
              We keep your account and order data as long as your account is
              active. If you delete your account, we remove your personal data
              within 30 days. Anonymized analytics data may be retained.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>You can:</p>
            <ul>
              <li>Access, update, or delete your account data at any time.</li>
              <li>
                Request a copy of all data we hold about you by emailing{" "}
                <a
                  href="mailto:privacy@getfed.com"
                  className="text-primary underline underline-offset-2"
                >
                  privacy@getfed.com
                </a>
                .
              </li>
              <li>Opt out of non-essential emails.</li>
            </ul>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy? Email{" "}
              <a
                href="mailto:privacy@getfed.com"
                className="text-primary underline underline-offset-2"
              >
                privacy@getfed.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

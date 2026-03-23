import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Fed restaurant ordering platform.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 17, 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-0 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <section>
            <h2>What Fed is</h2>
            <p>
              Fed is an online ordering platform that connects customers with
              local restaurants. We provide the technology — restaurants provide
              the food. We are not a delivery service and do not employ drivers.
            </p>
          </section>

          <section>
            <h2>For customers</h2>
            <ul>
              <li>
                You can place orders as a guest or with an account. By placing
                an order, you agree to pay the total shown at checkout.
              </li>
              <li>
                Orders are fulfilled by the restaurant, not by Fed. Questions
                about food quality, preparation time, or dietary concerns should
                be directed to the restaurant.
              </li>
              <li>
                Cancellations and refunds are handled by the restaurant. Contact
                them directly using the phone number on your order confirmation.
              </li>
              <li>
                Prices shown include the restaurant's listed prices. Tax, tips,
                and service fees (if any) are itemized at checkout.
              </li>
            </ul>
          </section>

          <section>
            <h2>For restaurant owners</h2>
            <ul>
              <li>
                You are responsible for the accuracy of your menu, pricing, and
                availability. Fed displays what you enter — we don't modify or
                verify menu content.
              </li>
              <li>
                Fed charges zero commission on orders. Payment processing fees
                (Stripe: 2.9% + $0.30 per transaction) are deducted by Stripe
                before payout.
              </li>
              <li>
                Pro plan subscriptions ($29/month) are billed monthly and can be
                cancelled at any time. There are no long-term contracts.
              </li>
              <li>
                You own your customer data (names, emails, order history). Fed
                does not sell restaurant customer data or use it for marketing to
                competing restaurants.
              </li>
              <li>
                You are responsible for food safety, allergen information, and
                compliance with local health regulations.
              </li>
            </ul>
          </section>

          <section>
            <h2>Payments</h2>
            <p>
              All payments are processed securely by Stripe. Fed does not store
              credit card details. By making a payment, you agree to Stripe's{" "}
              <a
                href="https://stripe.com/legal"
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms of service
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Accounts</h2>
            <ul>
              <li>
                Keep your login credentials secure. You're responsible for
                activity on your account.
              </li>
              <li>
                We may suspend or terminate accounts that violate these terms or
                engage in fraudulent activity.
              </li>
              <li>
                You can delete your account at any time by contacting{" "}
                <a
                  href="mailto:support@getfed.com"
                  className="text-primary underline underline-offset-2"
                >
                  support@getfed.com
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2>Limitation of liability</h2>
            <p>
              Fed provides the platform "as is." We do our best to keep things
              running smoothly, but we can't guarantee uninterrupted service. We
              are not liable for food quality, order accuracy, or issues between
              customers and restaurants.
            </p>
          </section>

          <section>
            <h2>Changes to these terms</h2>
            <p>
              We may update these terms from time to time. We'll notify users of
              significant changes via email or a notice on the platform. Continued
              use of Fed after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href="mailto:legal@getfed.com"
                className="text-primary underline underline-offset-2"
              >
                legal@getfed.com
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

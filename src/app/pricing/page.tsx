"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Palette,
  QrCode,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/* ---------- Competitor comparison data ---------- */

const competitors = [
  {
    name: "DoorDash",
    commission: "15–30%",
    monthlyFee: "$0–$69/mo",
    perOrder: "$6+ customer fees",
    hidden: "Marketing fees, tablet rental, premium placement",
  },
  {
    name: "Grubhub",
    commission: "15–30%",
    monthlyFee: "$0",
    perOrder: "$5+ customer fees",
    hidden: "15% marketing fee, sponsored listings, phone order fees",
  },
  {
    name: "Uber Eats",
    commission: "15–30%",
    monthlyFee: "$0",
    perOrder: "$5+ customer fees",
    hidden: "Marketing fees, upcharges, Uber One subsidies",
  },
  {
    name: "Toast",
    commission: "0%",
    monthlyFee: "$69–$165/mo",
    perOrder: "2.49–3.69% + $0.15",
    hidden: "Hardware costs ($799+), add-on fees, POS lock-in",
  },
  {
    name: "Square",
    commission: "0%",
    monthlyFee: "$0–$60/mo",
    perOrder: "2.6–2.9% + $0.10–$0.30",
    hidden: "Premium features extra, limited restaurant tools",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Everything you need to start taking orders online",
    highlight: false,
    features: [
      "Online ordering page with your branding",
      "QR code menu & ordering",
      "Unlimited menu items & categories",
      "Guest checkout (no customer accounts needed)",
      "Apple Pay, Google Pay, card payments",
      "Real-time order notifications",
      "Basic order analytics",
      "Email support",
    ],
    cta: "Get Started Free",
    note: "Only pay 2.9% + $0.30 per transaction (Stripe processing — no markup)",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Advanced tools for growing restaurants",
    highlight: true,
    features: [
      "Everything in Free, plus:",
      "Advanced analytics & revenue reports",
      "Promotion & discount management",
      "Customer insights & repeat order data",
      "Priority email & chat support",
      "Custom domain support",
      "Multi-location management",
      "API access for integrations",
    ],
    cta: "Start Free Trial",
    note: "Same low payment processing — no commission ever",
  },
];

const fedAdvantages = [
  {
    icon: Shield,
    title: "Zero Commission",
    description:
      "We never take a cut of your sales. You keep 100% of your food revenue. Period.",
  },
  {
    icon: Zap,
    title: "5-Minute Setup",
    description:
      "Upload your menu, set your brand colors, get a link. No contracts, no setup fees, cancel anytime.",
  },
  {
    icon: Globe,
    title: "No App Download",
    description:
      "Customers order from their browser. No app install needed. Works on any device.",
  },
  {
    icon: Palette,
    title: "You Own Your Data",
    description:
      "Customer emails, phone numbers, order history — it's all yours. Not locked in our platform.",
  },
  {
    icon: QrCode,
    title: "QR Code Ordering",
    description:
      "Print QR codes for tables. Customers scan, browse, and order — no waiter needed.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description:
      "Get instant alerts when orders come in. Never miss a customer.",
  },
];

/* ---------- Component ---------- */

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80&fit=crop"
            alt="Busy restaurant kitchen"
            fill
            className="object-cover brightness-[0.2]"
          />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge variant="secondary" className="mb-6 gap-1.5 bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-sm border-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            Zero commission. Seriously.
          </Badge>
          <h1 className="font-display text-4xl text-white sm:text-5xl lg:text-6xl">
            Keep your money.
            <br />
            Ditch the middleman.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Other platforms take 15–30% of every order. That&apos;s $4.50–$9.00 on a $30 meal
            — money that should be yours. Fed charges{" "}
            <strong className="text-white">zero commission</strong>. You only pay
            Stripe&apos;s standard processing fee.
          </p>
        </div>
      </section>

      {/* ---- The Math ---- */}
      <section className="bg-warm-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl sm:text-3xl">
            The math on a $30 order
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            See how much more you keep with Fed
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {/* DoorDash */}
            <div className="rounded-2xl border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">With DoorDash</p>
              <p className="mt-2 text-3xl font-bold text-destructive">-$7.50</p>
              <p className="mt-1 text-sm text-muted-foreground">
                25% commission on $30
              </p>
              <p className="mt-3 text-sm font-medium">
                You keep: <span className="text-foreground">$22.50</span>
              </p>
            </div>

            {/* Toast */}
            <div className="rounded-2xl border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">With Toast</p>
              <p className="mt-2 text-3xl font-bold text-amber-500">-$1.12</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3.59% + $0.15 processing
              </p>
              <p className="mt-3 text-sm font-medium">
                You keep: <span className="text-foreground">$28.88</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">+ $69–$165/mo subscription</p>
            </div>

            {/* Fed */}
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
              <p className="text-sm font-medium text-primary">With Fed</p>
              <p className="mt-2 text-3xl font-bold text-primary">-$1.17</p>
              <p className="mt-1 text-sm text-muted-foreground">
                2.9% + $0.30 (Stripe only)
              </p>
              <p className="mt-3 text-sm font-bold">
                You keep: <span className="text-primary">$28.83</span>
              </p>
              <p className="mt-1 text-xs font-medium text-primary">No monthly fee on Free plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Plans ---- */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl">Simple, honest pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">
            No contracts. No hidden fees. Cancel anytime.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-8",
                  plan.highlight
                    ? "border-primary bg-primary/[0.02] shadow-lg shadow-primary/10"
                    : "bg-card"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <h3 className="font-display text-2xl">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-6 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  {plan.note}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register" className="mt-8 block">
                  <Button
                    className="w-full gap-2 rounded-xl"
                    variant={plan.highlight ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Why Fed ---- */}
      <section className="border-t bg-warm-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-center text-3xl">Why restaurants choose Fed</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Built by people who think restaurants deserve better
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fedAdvantages.map((adv) => (
              <div key={adv.title} className="rounded-2xl border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <adv.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{adv.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Competitor Comparison Table ---- */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl">
            How Fed compares
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Transparent comparison with the biggest platforms
          </p>

          <div className="mt-10 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold">Platform</th>
                  <th className="px-4 py-3 text-left font-semibold">Commission</th>
                  <th className="px-4 py-3 text-left font-semibold">Monthly Fee</th>
                  <th className="px-4 py-3 text-left font-semibold">Per-Order Cost</th>
                  <th className="px-4 py-3 text-left font-semibold">Hidden Costs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-primary/5">
                  <td className="px-4 py-3 font-bold text-primary">Fed</td>
                  <td className="px-4 py-3 font-bold text-primary">0%</td>
                  <td className="px-4 py-3 font-bold text-primary">$0 (Free) / $29 (Pro)</td>
                  <td className="px-4 py-3">2.9% + $0.30</td>
                  <td className="px-4 py-3 font-medium text-primary">None</td>
                </tr>
                {competitors.map((c) => (
                  <tr key={c.name} className="border-b">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.commission}</td>
                    <td className="px-4 py-3">{c.monthlyFee}</td>
                    <td className="px-4 py-3">{c.perOrder}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.hidden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="relative overflow-hidden border-t">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80&fit=crop"
            alt="People enjoying food together"
            fill
            className="object-cover brightness-[0.2]"
          />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Stop giving away your profits
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Set up Fed in 5 minutes. No contracts, no commission, no BS.
            Just a simple ordering link for your customers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 rounded-xl bg-white px-8 text-foreground hover:bg-white/90">
                Start for Free <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="rounded-xl border-white/30 px-8 text-white hover:bg-white/10">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Palette,
  QrCode,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ---------- Competitor comparison data ---------- */

const competitors = [
  {
    name: "DoorDash",
    commission: "15–30%",
    monthlyFee: "$0–$69/mo",
    perOrder: "$6+ customer fees",
    hidden: "Marketing fees, tablet rental, premium placement",
    example: "On a $30 order: restaurant pays $4.50–$9.00",
  },
  {
    name: "Grubhub",
    commission: "15–30%",
    monthlyFee: "$0",
    perOrder: "$5+ customer fees",
    hidden: "15% marketing fee, sponsored listings, phone order fees",
    example: "On a $30 order: restaurant pays $4.50–$9.00",
  },
  {
    name: "Uber Eats",
    commission: "15–30%",
    monthlyFee: "$0",
    perOrder: "$5+ customer fees",
    hidden: "Marketing fees, upcharges, Uber One subsidies",
    example: "On a $30 order: restaurant pays $4.50–$9.00",
  },
  {
    name: "Toast",
    commission: "0%",
    monthlyFee: "$69–$165/mo",
    perOrder: "2.49–3.69% + $0.15",
    hidden: "Hardware costs ($799+), add-on fees, POS lock-in",
    example: "On a $30 order: restaurant pays $0.90–$1.26",
  },
  {
    name: "Square",
    commission: "0%",
    monthlyFee: "$0–$60/mo",
    perOrder: "2.6–2.9% + $0.10–$0.30",
    hidden: "Premium features extra, limited restaurant tools",
    example: "On a $30 order: restaurant pays $0.88–$1.17",
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
      "Upload your menu, set your brand colors, get a link. Start taking orders today.",
  },
  {
    icon: Globe,
    title: "No App Download",
    description:
      "Customers order from their browser. No app install needed. Works on any device.",
  },
  {
    icon: Palette,
    title: "Your Brand, Not Ours",
    description:
      "Your colors, your logo, your menu. Fed stays in the background.",
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
      {/* ---- Navbar ---- */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Fed</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Zero commission. Seriously.
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Keep your money.
            <br />
            <span className="text-primary">Ditch the middleman.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Other platforms take 15–30% of every order. That&apos;s $4.50–$9.00 on a $30 meal
            — money that should be yours. Fed charges{" "}
            <strong className="text-foreground">zero commission</strong>. You only pay
            Stripe&apos;s standard processing fee.
          </p>
        </div>
      </section>

      {/* ---- The Math ---- */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold">The Math on a $30 Order</h2>
          <p className="mt-2 text-center text-muted-foreground">
            See how much more you keep with Fed
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {/* DoorDash */}
            <div className="rounded-xl border bg-card p-6">
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
            <div className="rounded-xl border bg-card p-6">
              <p className="text-sm font-medium text-muted-foreground">With Toast</p>
              <p className="mt-2 text-3xl font-bold text-amber-500">-$1.12</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3.59% + $0.15 processing
              </p>
              <p className="mt-3 text-sm font-medium">
                You keep: <span className="text-foreground">$28.88</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">+ $69-$165/mo subscription</p>
            </div>

            {/* Fed */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
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
          <h2 className="text-center text-3xl font-bold">Simple, Honest Pricing</h2>
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

                <h3 className="text-2xl font-bold">{plan.name}</h3>
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
                    className={cn(
                      "w-full gap-2 rounded-xl",
                      plan.highlight ? "" : "variant-outline"
                    )}
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
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Why Restaurants Choose Fed</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Built by people who think restaurants deserve better
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fedAdvantages.map((adv) => (
              <div key={adv.title} className="rounded-xl border bg-card p-6">
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
          <h2 className="text-center text-3xl font-bold">
            How Fed Compares
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Transparent comparison with the biggest platforms
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Platform</th>
                  <th className="py-3 text-left font-semibold">Commission</th>
                  <th className="py-3 text-left font-semibold">Monthly Fee</th>
                  <th className="py-3 text-left font-semibold">Per-Order Cost</th>
                  <th className="py-3 text-left font-semibold">Hidden Costs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-primary/5">
                  <td className="py-3 font-bold text-primary">Fed</td>
                  <td className="py-3 font-bold text-primary">0%</td>
                  <td className="py-3 font-bold text-primary">$0 (Free) / $29 (Pro)</td>
                  <td className="py-3">2.9% + $0.30</td>
                  <td className="py-3 font-medium text-primary">None</td>
                </tr>
                {competitors.map((c) => (
                  <tr key={c.name} className="border-b">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3">{c.commission}</td>
                    <td className="py-3">{c.monthlyFee}</td>
                    <td className="py-3">{c.perOrder}</td>
                    <td className="py-3 text-muted-foreground">{c.hidden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stop giving away your profits
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Set up Fed in 5 minutes. No contracts, no commission, no BS.
            Just a simple ordering link for your customers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 rounded-xl px-8">
                Start for Free <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="rounded-xl px-8">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Fed</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Fed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

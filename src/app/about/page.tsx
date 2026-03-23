import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Heart, Users, Store, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Fed exists so restaurants can sell directly to the people who love their food — without giving a third of the check to a tech company.",
};

const values = [
  {
    icon: Store,
    title: "Restaurants first",
    description:
      "We built Fed because we saw restaurants losing 15–30% of every online order to platforms that don't cook a single meal. That's not right. Your food, your customers, your money.",
  },
  {
    icon: Users,
    title: "Simple for everyone",
    description:
      "No app downloads, no mandatory accounts, no friction. Customers open a link, browse, order, and pay. Restaurant owners sign up and start taking orders in minutes.",
  },
  {
    icon: Heart,
    title: "Honest by default",
    description:
      "Zero commission. Transparent pricing. No hidden fees, no surge pricing, no games. We charge a flat monthly rate for Pro features, and Stripe's standard processing fee. That's it.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&fit=crop"
            alt="Restaurant ambiance"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:py-32">
          <h1 className="font-display text-4xl text-white sm:text-5xl lg:text-6xl">
            Food should be simple.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Fed exists so restaurants can sell directly to the people who love
            their food — without giving a third of the check to a tech company.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl">Why we built Fed</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Walk into any restaurant and ask the owner what they think of
              delivery apps. You'll hear the same story: the orders come in, the
              platform takes its cut, and what's left barely covers the cost of
              ingredients.
            </p>
            <p>
              We thought there had to be a better way. Restaurants already have
              great food and loyal customers. They just need a dead-simple way to
              let people order online — without paying a gatekeeper for the
              privilege.
            </p>
            <p>
              Fed is that way. We give every restaurant a branded online ordering
              page, QR code menus, real-time order management, and payment
              processing — all for zero commission. Customers don't need to
              download an app or create an account. They just order and eat.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-warm-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-center text-3xl">What we believe</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            Whether you're a customer looking for your next meal or a restaurant
            owner tired of commission fees — Fed is here for you.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 rounded-xl px-8">
                Create an account <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="rounded-xl px-8">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ---------- Types ---------- */

interface RestaurantCard {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  description: string | null;
  primaryColor: string;
  estimatedPrepTime: number;
  avgRating: number;
  reviewCount: number;
  itemCount: number;
}

const steps = [
  {
    icon: Search,
    title: "Browse",
    description: "Find a restaurant, scan a QR code, or follow a link. No app needed.",
  },
  {
    icon: UtensilsCrossed,
    title: "Order",
    description: "Add items, customize, and pay with Apple Pay, Google Pay, or card. No account required.",
  },
  {
    icon: ShoppingBag,
    title: "Enjoy",
    description: "Pick up your food or get it at your table. That's it — no fuss, no middleman.",
  },
];

/* ---------- Component ---------- */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data.restaurants ?? []);
        }
      } catch {
        // silently fail - empty state will show
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  const filtered = searchQuery
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.description ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : restaurants;

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
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                For Restaurants
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Now serving your area
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Get{" "}
              <span className="bg-gradient-to-r from-primary to-primary-foreground/60 bg-clip-text text-transparent">
                Fed.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Browse menus, order, and pay — no app download, no account needed.
              Just tap, order, and eat. It&apos;s that simple.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                No account required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Apple Pay &amp; Google Pay
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <Check className="h-4 w-4 text-primary" />
                Zero commission for restaurants
              </span>
            </div>

            {/* Search */}
            <div className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-lg transition-shadow focus-within:shadow-xl">
              <div className="flex flex-1 items-center gap-2 pl-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="rounded-xl px-6">
                Search
              </Button>
            </div>

            {/* Quick tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {["Pizza", "Sushi", "Burgers", "Tacos", "Thai", "Indian", "American", "Japanese"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Featured Restaurants ---- */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Restaurants
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked favorites from your neighborhood
              </p>
            </div>
            <Button variant="ghost" className="hidden gap-1 sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="mt-16 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((restaurant, i) => (
                <Link
                  key={restaurant.slug}
                  href={`/r/${restaurant.slug}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                >
                  <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    {/* Image placeholder */}
                    <div
                      className="relative h-44 w-full"
                      style={{
                        background: `linear-gradient(135deg, ${restaurant.primaryColor}22, ${restaurant.primaryColor}44)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UtensilsCrossed
                          className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: restaurant.primaryColor }}
                        />
                      </div>
                      {/* Tags */}
                      <div className="absolute left-3 top-3 flex gap-1.5">
                        {restaurant.avgRating >= 4.5 && (
                          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                            Popular
                          </span>
                        )}
                        {restaurant.itemCount > 10 && (
                          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                            Full Menu
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {restaurant.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {restaurant.cuisine}
                          </p>
                        </div>
                        {restaurant.reviewCount > 0 && (
                          <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            <span className="text-sm font-semibold text-primary">
                              {restaurant.avgRating}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {restaurant.estimatedPrepTime}-
                          {restaurant.estimatedPrepTime + 10} min
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {restaurant.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && searchQuery && (
            <div className="mt-10 text-center">
              <p className="text-lg text-muted-foreground">
                No restaurants match &ldquo;{searchQuery}&rdquo;. Try a
                different search.
              </p>
            </div>
          )}

          {!loading && restaurants.length === 0 && !searchQuery && (
            <div className="mt-10 text-center">
              <p className="text-lg text-muted-foreground">
                No restaurants available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---- How it Works ---- */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How it Works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three simple steps to your next great meal
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative text-center animate-fade-in"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-10 hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-border to-border/0 sm:block" />
                )}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Restaurant Owner CTA ---- */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Own a restaurant?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Stop giving 15-30% of every order to delivery apps.
            Fed charges zero commission — set up in 5 minutes, start
            taking orders today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/pricing">
              <Button size="lg" className="gap-2 rounded-xl px-8">
                See Pricing <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="rounded-xl px-8">
                Get Started Free
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
              <Link href="#" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                For Restaurants
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

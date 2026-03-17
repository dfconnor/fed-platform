"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  ChevronRight,
  Loader2,
  Check,
  QrCode,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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

/* ---------- Unsplash food images for restaurant cards ---------- */
const restaurantImages: Record<string, string> = {
  american:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
  japanese:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
  italian:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
  mexican:
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
  indian:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
  thai:
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&h=400&fit=crop",
  chinese:
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop",
  default:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
};

function getRestaurantImage(cuisine: string): string {
  const key = cuisine.toLowerCase();
  return restaurantImages[key] ?? restaurantImages.default;
}

const steps = [
  {
    icon: QrCode,
    title: "Scan or browse",
    description:
      "Scan a QR code at the table, tap a link, or search here. No app download needed.",
  },
  {
    icon: UtensilsCrossed,
    title: "Order your way",
    description:
      "Customize your meal, add notes for the kitchen, and choose pickup, dine-in, or delivery.",
  },
  {
    icon: CreditCard,
    title: "Pay and enjoy",
    description:
      "Apple Pay, Google Pay, or card. Guest checkout — no account required. That's it.",
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
        // silently fail — empty state will show
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
      <Navbar />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80&fit=crop"
            alt="Beautiful food spread"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 sm:pb-40 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-5xl text-white sm:text-6xl lg:text-7xl">
              Get Fed.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl">
              Order from local restaurants — no app, no account, no fuss.
              Just great food, straight from the kitchen to you.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white" />
                Guest checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white" />
                Apple Pay & Google Pay
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-white" />
                Zero commission
              </span>
            </div>

            {/* Search */}
            <div className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
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

            {/* Quick cuisine tags */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {["American", "Japanese", "Italian", "Mexican", "Thai", "Indian"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
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
      <section className="relative -mt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between pb-6">
            <div>
              <h2 className="font-display text-3xl">
                {searchQuery ? `Results for "${searchQuery}"` : "Restaurants near you"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? `${filtered.length} restaurant${filtered.length !== 1 ? "s" : ""} found`
                  : "Order for pickup, dine-in, or delivery"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((restaurant, i) => (
                <Link
                  key={restaurant.slug}
                  href={`/r/${restaurant.slug}`}
                  className="group animate-fade-in"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Restaurant image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={getRestaurantImage(restaurant.cuisine)}
                        alt={`${restaurant.name} — ${restaurant.cuisine} cuisine`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Tags overlay */}
                      <div className="absolute left-3 top-3 flex gap-1.5">
                        {restaurant.avgRating >= 4.5 && (
                          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur-sm">
                            Popular
                          </span>
                        )}
                      </div>

                      {/* Rating overlay */}
                      {restaurant.reviewCount > 0 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">
                            {restaurant.avgRating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({restaurant.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                        {restaurant.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {restaurant.cuisine}
                      </p>
                      {restaurant.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {restaurant.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {restaurant.estimatedPrepTime}–
                          {restaurant.estimatedPrepTime + 10} min
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {restaurant.itemCount} items
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && searchQuery && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No restaurants match &ldquo;{searchQuery}&rdquo;. Try a
                different search.
              </p>
            </div>
          )}

          {!loading && restaurants.length === 0 && !searchQuery && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No restaurants available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---- How it Works ---- */}
      <section id="how-it-works" className="border-t bg-warm-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              Three steps to your next meal
            </h2>
            <p className="mt-3 text-muted-foreground">
              No app download. No mandatory sign-up. Just food.
            </p>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group relative text-center animate-fade-in"
                style={{
                  animationDelay: `${i * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Step number */}
                <div className="mx-auto mb-5 relative">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
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

      {/* ---- Social proof / restaurant stats ---- */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <p className="font-display text-4xl text-primary">0%</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Commission on every order
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-primary">5 min</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Average setup time for restaurants
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-primary">$0</p>
              <p className="mt-1 text-sm text-muted-foreground">
                To get started — free forever plan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Restaurant Owner CTA ---- */}
      <section className="relative overflow-hidden border-t">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80&fit=crop"
            alt="Restaurant interior"
            fill
            className="object-cover brightness-[0.25]"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Own a restaurant?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Stop giving 15–30% of every order to delivery apps. Fed charges
            zero commission — set up in 5 minutes, start taking orders today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/pricing">
              <Button
                size="lg"
                className="gap-2 rounded-xl px-8 bg-white text-foreground hover:bg-white/90"
              >
                See Pricing <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 border-white/30 text-white hover:bg-white/10"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

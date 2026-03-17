"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Plus,
  Minus,
  ChevronLeft,
  Flame,
  Leaf,
  WheatOff,
  Sparkles,
  Search,
  X,
  Info,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

/* ================================================================
   TYPES (matching API response)
   ================================================================ */

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  calories: number | null;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface RestaurantData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cuisine: string;
  avgRating: number;
  reviewCount: number;
  phone: string | null;
  address: string | null;
  estimatedPrepTime: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  operatingHours: unknown;
  categories: MenuCategory[];
}

/* ================================================================
   CUISINE → UNSPLASH BANNER IMAGES
   ================================================================ */

const cuisineBanners: Record<string, string> = {
  american:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=500&fit=crop",
  japanese:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=500&fit=crop",
  italian:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=500&fit=crop",
  mexican:
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=500&fit=crop",
  indian:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=500&fit=crop",
  thai:
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=1200&h=500&fit=crop",
  default:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=500&fit=crop",
};

function getBannerImage(cuisine: string): string {
  return cuisineBanners[cuisine.toLowerCase()] ?? cuisineBanners.default;
}

/* ================================================================
   COMPONENT
   ================================================================ */

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartItems = useCartStore((s) => s.items);
  const addCartItem = useCartStore((s) => s.addItem);
  const removeCartItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore((s) => s.itemCount());
  const totalPrice = useCartStore((s) => s.subtotal());

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      addCartItem(
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl || undefined,
          modifiers: [],
        },
        slug,
        restaurant?.name || ""
      );
    },
    [addCartItem, slug, restaurant?.name]
  );

  const handleRemoveItem = useCallback(
    (menuItemId: string) => {
      const cartItem = cartItems.find((i) => i.menuItemId === menuItemId);
      if (!cartItem) return;
      if (cartItem.quantity <= 1) {
        removeCartItem(cartItem.id);
      } else {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    },
    [cartItems, removeCartItem, updateQuantity]
  );

  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Fetch restaurant data from API
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(`/api/restaurants/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Restaurant not found");
          } else {
            setError("Failed to load restaurant");
          }
          return;
        }
        const data = await res.json();
        const r = data.restaurant;
        setRestaurant(r);
        if (r.categories?.length > 0) {
          setActiveCategory(r.categories[0].id);
        }
      } catch {
        setError("Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [slug]);

  // Scroll spy: watch which category is in view
  useEffect(() => {
    if (!restaurant) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [restaurant]);

  function scrollToCategory(categoryId: string) {
    setActiveCategory(categoryId);
    const el = categoryRefs.current[categoryId];
    if (el) {
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function getCartQuantity(menuItemId: string) {
    return cartItems.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="text-lg font-semibold text-foreground">
            {error ?? "Restaurant not found"}
          </p>
          <p className="text-sm text-muted-foreground">
            This restaurant may not exist or is currently unavailable.
          </p>
          <Link
            href="/"
            className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Format operating hours
  const hoursDisplay =
    typeof restaurant.operatingHours === "object" && restaurant.operatingHours
      ? "See hours"
      : "11:00 AM - 9:00 PM";

  // Filter items by search
  const filteredCategories = searchQuery
    ? restaurant.categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.description ?? "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : restaurant.categories;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ---- Restaurant Banner / Header ---- */}
      <div ref={headerRef} className="relative">
        {/* Banner image */}
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <Image
            src={getBannerImage(restaurant.cuisine)}
            alt={`${restaurant.name} banner`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Link>

        {/* Restaurant info card */}
        <div className="relative mx-auto -mt-20 max-w-4xl px-4 sm:-mt-24 sm:px-6">
          <div className="rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              {/* Logo */}
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                {restaurant.name.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl">
                      {restaurant.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {restaurant.cuisine}
                    </p>
                  </div>
                  {/* Rating */}
                  {restaurant.reviewCount > 0 && (
                    <div
                      className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
                      style={{ backgroundColor: `${restaurant.primaryColor}15` }}
                    >
                      <Star
                        className="h-4 w-4 fill-current"
                        style={{ color: restaurant.primaryColor }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{ color: restaurant.primaryColor }}
                      >
                        {restaurant.avgRating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({restaurant.reviewCount})
                      </span>
                    </div>
                  )}
                </div>

                {restaurant.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {restaurant.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {restaurant.estimatedPrepTime}-
                    {restaurant.estimatedPrepTime + 10} min
                  </span>
                  {restaurant.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {restaurant.address}
                    </span>
                  )}
                  {restaurant.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {restaurant.phone}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-sm">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#22c55e" }}
                  />
                  <span className="text-muted-foreground">
                    Open now &middot; {hoursDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Sticky Category Nav ---- */}
      <div className="sticky top-0 z-40 mt-6 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              ref={navRef}
              className="scrollbar-hide flex flex-1 items-center gap-1 overflow-x-auto py-3"
            >
              {restaurant.categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    style={
                      isActive
                        ? { backgroundColor: restaurant.primaryColor }
                        : undefined
                    }
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
            {/* Search toggle */}
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery("");
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showSearch ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Search bar (expandable) */}
          {showSearch && (
            <div className="pb-3 animate-slide-down">
              <Input
                type="text"
                placeholder="Search the menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* ---- Menu Items ---- */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            id={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}
            className="mb-10"
          >
            <h2 className="mb-4 text-xl font-bold tracking-tight">
              {category.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => {
                const qty = getCartQuantity(item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    qty={qty}
                    primaryColor={restaurant.primaryColor}
                    onAdd={() => handleAddItem(item)}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && searchQuery && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No items found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {filteredCategories.length === 0 && !searchQuery && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No menu items available yet.
            </p>
          </div>
        )}
      </div>

      {/* ---- Floating Cart Bar ---- */}
      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-slide-up">
          <div className="mx-auto max-w-4xl">
            <Link href={`/r/${slug}/cart`}>
              <div
                className="flex items-center justify-between rounded-2xl px-6 py-4 text-white shadow-2xl transition-transform active:scale-[0.98]"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                    {totalItems}
                  </div>
                  <span className="font-semibold">View Cart</span>
                </div>
                <span className="text-lg font-bold">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MENU ITEM CARD
   ================================================================ */

function MenuItemCard({
  item,
  qty,
  primaryColor,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  qty: number;
  primaryColor: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const dietaryBadges = [
    item.isSpicy && {
      icon: Flame,
      label: "Spicy",
      color: "text-red-500 bg-red-50",
    },
    item.isVegetarian && {
      icon: Leaf,
      label: "Vegetarian",
      color: "text-green-600 bg-green-50",
    },
    item.isVegan && {
      icon: Leaf,
      label: "Vegan",
      color: "text-emerald-600 bg-emerald-50",
    },
    item.isGlutenFree && {
      icon: WheatOff,
      label: "GF",
      color: "text-amber-600 bg-amber-50",
    },
  ].filter(Boolean) as { icon: typeof Flame; label: string; color: string }[];

  return (
    <div className="group relative flex gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md">
      {/* Popular badge */}
      {item.isPopular && (
        <div className="absolute -top-2 left-3">
          <Badge
            className="gap-1 shadow-sm"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
              color: "white",
            }}
          >
            <Sparkles className="h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold leading-snug pr-2">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          {/* Dietary badges */}
          {dietaryBadges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dietaryBadges.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
                    b.color
                  )}
                >
                  <b.icon className="h-3 w-3" />
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">
              {formatCurrency(item.price)}
            </span>
            {item.calories && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                {item.calories} cal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image / Add button area */}
      <div className="flex flex-col items-center justify-between">
        {/* Item image */}
        {item.imageUrl ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl sm:h-28 sm:w-28"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}08)`,
            }}
          >
            <UtensilsCrossed className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}

        {/* Add / quantity controls */}
        <div className="-mt-5 relative z-10">
          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAdd();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 bg-card text-foreground shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ borderColor: primaryColor }}
            >
              <Plus className="h-4 w-4" style={{ color: primaryColor }} />
            </button>
          ) : (
            <div
              className="flex items-center gap-1 rounded-full px-1 py-0.5 shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-all hover:bg-white/20"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-bold text-white">
                {qty}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAdd();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-all hover:bg-white/20"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

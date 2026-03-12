"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Loader2,
  Tag,
  ShoppingBag,
  MapPin,
  UtensilsCrossed,
  Truck,
  X,
  Apple,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

/* ================================================================
   TYPES & HELPERS
   ================================================================ */

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

type OrderType = "pickup" | "dinein" | "delivery";
type PaymentMethod = "card" | "apple_pay" | "google_pay" | "paypal" | "venmo";

const TAX_RATE = 0.0875;
const SERVICE_FEE = 0.49; // Fed's ultra-low platform fee — competitors charge $1.99-$3.99

const orderTypes: { value: OrderType; label: string; icon: typeof MapPin }[] = [
  { value: "pickup", label: "Pickup", icon: ShoppingBag },
  { value: "dinein", label: "Dine-in", icon: UtensilsCrossed },
  { value: "delivery", label: "Delivery", icon: Truck },
];

const tipOptions = [
  { label: "15%", value: 0.15 },
  { label: "18%", value: 0.18 },
  { label: "20%", value: 0.2 },
  { label: "Custom", value: -1 },
];

const paymentMethods: {
  value: PaymentMethod;
  label: string;
  icon: typeof CreditCard;
}[] = [
  { value: "apple_pay", label: "Apple Pay", icon: Apple },
  { value: "google_pay", label: "Google Pay", icon: Wallet },
  { value: "card", label: "Credit Card", icon: CreditCard },
  { value: "paypal", label: "PayPal", icon: CreditCard },
  { value: "venmo", label: "Venmo", icon: Wallet },
];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const cartKey = `fed-cart-${slug}`;

  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [selectedTip, setSelectedTip] = useState(0.18);
  const [customTip, setCustomTip] = useState("");
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load cart from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(cartKey);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, [cartKey]);

  // Persist cart
  useEffect(() => {
    try {
      sessionStorage.setItem(cartKey, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [cartKey, items]);

  function updateQuantity(menuItemId: string, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(menuItemId: string) {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }

  function updateItemNotes(menuItemId: string, notes: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId ? { ...item, notes } : item
      )
    );
  }

  // Calculations
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const tipAmount = showCustomTip
    ? parseFloat(customTip) || 0
    : subtotal * selectedTip;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + tax + SERVICE_FEE + tipAmount - discount;

  async function handlePlaceOrder() {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    const orderId = `FED-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    sessionStorage.removeItem(cartKey);
    router.push(`/r/${slug}/order/${orderId}`);
  }

  function handleApplyPromo() {
    if (promoCode.toUpperCase() === "FED10") {
      setPromoApplied(true);
    }
  }

  const restaurantName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add some delicious items from the menu
          </p>
        </div>
        <Link href={`/r/${slug}`}>
          <Button size="lg" className="gap-2 rounded-xl">
            <ChevronLeft className="h-4 w-4" />
            Back to Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link
            href={`/r/${slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Your Order</h1>
            <p className="text-xs text-muted-foreground">{restaurantName}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column - Cart items & options */}
          <div className="space-y-6 lg:col-span-3">
            {/* Order type */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Order Type
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {orderTypes.map((t) => {
                  const active = orderType === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setOrderType(t.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <t.icon className="h-5 w-5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart items */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Items
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="rounded-xl border bg-card p-4 animate-fade-in"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 rounded-full border p-1">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Item notes */}
                    <Input
                      placeholder="Add a note (e.g., no onions)"
                      className="mt-3 text-sm"
                      value={item.notes ?? ""}
                      onChange={(e) =>
                        updateItemNotes(item.menuItemId, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <Link href={`/r/${slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 gap-1 text-primary"
                >
                  <Plus className="h-4 w-4" />
                  Add more items
                </Button>
              </Link>
            </div>

            {/* Customer info */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Your Details
              </h2>
              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cust-name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="cust-name"
                    placeholder="Your name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo((c) => ({ ...c, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cust-email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="cust-email"
                      type="email"
                      placeholder="you@example.com"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo((c) => ({
                          ...c,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cust-phone" className="text-xs">
                      Phone
                    </Label>
                    <Input
                      id="cust-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((c) => ({
                          ...c,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => {
                  const active = paymentMethod === pm.value;
                  return (
                    <button
                      key={pm.value}
                      onClick={() => setPaymentMethod(pm.value)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-sm font-medium transition-all",
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <pm.icon className="h-5 w-5" />
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border bg-card p-5">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                {/* Promo code */}
                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Promo code"
                      className="pl-9 text-sm"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoApplied(false);
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-sm">
                    <span className="font-medium text-success">
                      FED10 applied: 10% off
                    </span>
                    <button
                      onClick={() => {
                        setPromoApplied(false);
                        setPromoCode("");
                      }}
                    >
                      <X className="h-4 w-4 text-success" />
                    </button>
                  </div>
                )}

                {/* Tip */}
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium">Add a tip</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {tipOptions.map((opt) => {
                      const isCustom = opt.value === -1;
                      const active = isCustom
                        ? showCustomTip
                        : !showCustomTip && selectedTip === opt.value;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => {
                            if (isCustom) {
                              setShowCustomTip(true);
                            } else {
                              setShowCustomTip(false);
                              setSelectedTip(opt.value);
                            }
                          }}
                          className={cn(
                            "rounded-lg border py-2 text-sm font-medium transition-all",
                            active
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {showCustomTip && (
                    <Input
                      type="number"
                      min="0"
                      step="0.50"
                      placeholder="Enter tip amount"
                      className="mt-2 text-sm"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>{formatCurrency(SERVICE_FEE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tip</span>
                    <span>{formatCurrency(tipAmount)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Place order */}
                <Button
                  className="mt-5 w-full gap-2 rounded-xl"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order &middot; {formatCurrency(total)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

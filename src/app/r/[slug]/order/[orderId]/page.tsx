"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  ShoppingBag,
  Phone,
  MapPin,
  RotateCcw,
  Copy,
  Check,
  UtensilsCrossed,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

/* ================================================================
   STATUS TRACKER
   ================================================================ */

const statuses = [
  {
    key: "pending",
    label: "Order Received",
    icon: CheckCircle2,
    description: "Your order has been confirmed",
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
    description: "The kitchen is working on your order",
  },
  {
    key: "ready",
    label: "Ready",
    icon: PackageCheck,
    description: "Your order is ready for pickup",
  },
  {
    key: "completed",
    label: "Complete",
    icon: ShoppingBag,
    description: "Enjoy your meal!",
  },
] as const;

type StatusKey = (typeof statuses)[number]["key"];

/* ================================================================
   TYPES
   ================================================================ */

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string | null;
  menuItem: { name: string; imageUrl?: string | null };
  modifiers: Array<{ name: string; price: number }>;
};

type OrderData = {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  deliveryFee: number;
  tipAmount: number;
  discountAmount: number;
  total: number;
  estimatedReady: string | null;
  items: OrderItem[];
  restaurant: {
    name: string;
    slug: string;
    phone: string | null;
    primaryColor: string | null;
  };
};

/* ================================================================
   COMPONENT
   ================================================================ */

export default function OrderConfirmationPage() {
  const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch order data
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          setError("Order not found");
          return;
        }
        const data = await res.json();
        setOrder(data.order);
      } catch {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Live status updates: prefer SSE, fall back to 5s polling
  useEffect(() => {
    if (!order || order.status === "completed" || order.status === "delivered")
      return;

    const refetch = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch {
        // Silently retry on next tick
      }
    };

    // Polling fallback for environments without EventSource (or if SSE fails)
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (pollInterval) return;
      pollInterval = setInterval(refetch, 5000);
    };

    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      startPolling();
      return () => {
        if (pollInterval) clearInterval(pollInterval);
      };
    }

    const es = new EventSource(`/api/orders/${orderId}/stream`);
    es.addEventListener("status", () => {
      // Status changed on the server — refetch the full order for fresh data
      refetch();
    });
    es.addEventListener("done", () => {
      es.close();
    });
    es.onerror = () => {
      // Drop the SSE connection and fall back to polling
      es.close();
      startPolling();
    };

    return () => {
      es.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [orderId, order?.status]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold">{error || "Order not found"}</h1>
        <Link href={`/r/${slug}`}>
          <Button>Back to Restaurant</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = (order.status as StatusKey) || "pending";
  const currentStatusIndex = statuses.findIndex(
    (s) => s.key === currentStatus
  );

  const estimatedTime = order.estimatedReady
    ? new Date(order.estimatedReady).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  function handleCopyOrderId() {
    navigator.clipboard.writeText(order!.orderNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-success/10 via-success/5 to-background pb-8 pt-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-success/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-lg px-4 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-bounce-in">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for ordering from {order.restaurant.name}
          </p>

          {/* Order ID */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 shadow-sm">
            <span className="text-sm text-muted-foreground">Order #</span>
            <span className="font-mono text-lg font-bold tracking-wider">
              {order.orderNumber}
            </span>
            <button
              onClick={handleCopyOrderId}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Estimated time */}
          {estimatedTime && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Estimated ready by{" "}
              <span className="font-semibold text-foreground">
                {estimatedTime}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        {/* ---- Status Tracker ---- */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold">Order Status</h2>
          <div className="relative">
            {statuses.map((status, i) => {
              const isCompleted = i <= currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              const StatusIcon = status.icon;

              return (
                <div key={status.key} className="flex gap-4 pb-8 last:pb-0">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                        isCompleted
                          ? "border-success bg-success text-white"
                          : "border-border bg-card text-muted-foreground",
                        isCurrent && "ring-4 ring-success/20"
                      )}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    {i < statuses.length - 1 && (
                      <div
                        className={cn(
                          "mt-1 w-0.5 flex-1 transition-colors duration-500",
                          i < currentStatusIndex
                            ? "bg-success"
                            : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  <div className="pt-1.5">
                    <p
                      className={cn(
                        "font-semibold transition-colors",
                        isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {status.label}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {status.description}
                    </p>
                    {isCurrent && currentStatus !== "completed" && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success">
                        <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        In progress
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Order Details (real data) ---- */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <span>{item.menuItem.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
                {item.modifiers.length > 0 && (
                  <div className="ml-8 mt-1 text-xs text-muted-foreground">
                    {item.modifiers.map((m) => m.name).join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            {order.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>{formatCurrency(order.serviceFee)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            {order.tipAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tip</span>
                <span>{formatCurrency(order.tipAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ---- Restaurant Contact ---- */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Restaurant Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <UtensilsCrossed className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{order.restaurant.name}</p>
                <p className="text-muted-foreground capitalize">
                  {order.orderType.replace("_", " ")} order
                </p>
              </div>
            </div>
            {order.restaurant.phone && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground">
                  {order.restaurant.phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---- Actions ---- */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={`/r/${slug}`} className="flex-1">
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Order Again
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

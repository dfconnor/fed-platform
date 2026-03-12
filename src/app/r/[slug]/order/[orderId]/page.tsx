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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

/* ================================================================
   TYPES & MOCK DATA
   ================================================================ */

const statuses = [
  {
    key: "received",
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
    key: "picked_up",
    label: "Picked Up",
    icon: ShoppingBag,
    description: "Enjoy your meal!",
  },
] as const;

type StatusKey = (typeof statuses)[number]["key"];

/* ================================================================
   COMPONENT
   ================================================================ */

export default function OrderConfirmationPage() {
  const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
  const [currentStatus, setCurrentStatus] = useState<StatusKey>("received");
  const [copied, setCopied] = useState(false);

  const restaurantName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Simulated status progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentStatus("preparing"), 3000),
      setTimeout(() => setCurrentStatus("ready"), 8000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const currentStatusIndex = statuses.findIndex(
    (s) => s.key === currentStatus
  );

  const estimatedTime = new Date();
  estimatedTime.setMinutes(estimatedTime.getMinutes() + 25);
  const timeString = estimatedTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  function handleCopyOrderId() {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Mock order items
  const orderItems = [
    { name: "Tonkotsu Ramen", quantity: 1, price: 16.95 },
    { name: "Gyoza (6 pcs)", quantity: 2, price: 8.95 },
    { name: "Matcha Latte", quantity: 1, price: 5.5 },
  ];
  const subtotal = orderItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

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
            Thank you for ordering from {restaurantName}
          </p>

          {/* Order ID */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 shadow-sm">
            <span className="text-sm text-muted-foreground">Order #</span>
            <span className="font-mono text-lg font-bold tracking-wider">
              {orderId}
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
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Estimated ready by{" "}
            <span className="font-semibold text-foreground">{timeString}</span>
          </div>
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
                  {/* Vertical line + dot */}
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

                  {/* Text */}
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
                    {isCurrent && currentStatus !== "picked_up" && (
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

        {/* ---- Order Details ---- */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Order Details</h2>
          <div className="space-y-3">
            {orderItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                    {item.quantity}
                  </span>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-3">
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
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
                <p className="font-medium">{restaurantName}</p>
                <p className="text-muted-foreground">Pickup order</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">
                123 Cherry Blossom Ave, Suite 4
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">(555) 234-5678</span>
            </div>
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

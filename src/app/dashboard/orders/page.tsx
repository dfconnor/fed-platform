"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock data ---

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  modifiers?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  email: string;
  type: "pickup" | "delivery" | "dine_in";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  notes?: string;
  tableNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "FED-A1B2C3",
    customer: "Sarah Chen",
    phone: "(555) 123-4567",
    email: "sarah@email.com",
    type: "pickup",
    items: [
      { name: "Margherita Pizza", qty: 1, price: 17.0, modifiers: ["Extra Cheese"] },
      { name: "Caesar Salad", qty: 1, price: 12.0 },
      { name: "Sparkling Water", qty: 2, price: 4.0 },
    ],
    subtotal: 37.0,
    tax: 3.24,
    total: 40.24,
    status: "pending",
    createdAt: "2024-03-11T14:32:00Z",
  },
  {
    id: "2",
    orderNumber: "FED-D4E5F6",
    customer: "James Wilson",
    phone: "(555) 234-5678",
    email: "james@email.com",
    type: "dine_in",
    tableNumber: "T-7",
    items: [
      { name: "Spaghetti Carbonara", qty: 1, price: 18.0 },
      { name: "Tiramisu", qty: 1, price: 9.0 },
      { name: "Espresso", qty: 2, price: 3.5 },
    ],
    subtotal: 34.0,
    tax: 2.98,
    total: 36.98,
    status: "preparing",
    createdAt: "2024-03-11T14:25:00Z",
    notes: "Nut allergy - please be careful with the tiramisu",
  },
  {
    id: "3",
    orderNumber: "FED-G7H8I9",
    customer: "Emily Park",
    phone: "(555) 345-6789",
    email: "emily@email.com",
    type: "delivery",
    items: [
      { name: "Bruschetta", qty: 1, price: 11.0 },
      { name: "Penne Arrabbiata", qty: 1, price: 16.0, modifiers: ["Extra Spicy"] },
      { name: "Gelato (3 scoops)", qty: 1, price: 8.0 },
    ],
    subtotal: 35.0,
    tax: 3.06,
    total: 38.06,
    status: "ready",
    createdAt: "2024-03-11T14:18:00Z",
  },
  {
    id: "4",
    orderNumber: "FED-J1K2L3",
    customer: "Michael Torres",
    phone: "(555) 456-7890",
    email: "mike@email.com",
    type: "pickup",
    items: [
      { name: "Risotto ai Funghi", qty: 1, price: 22.0 },
    ],
    subtotal: 22.0,
    tax: 1.93,
    total: 23.93,
    status: "completed",
    createdAt: "2024-03-11T14:05:00Z",
  },
  {
    id: "5",
    orderNumber: "FED-M4N5O6",
    customer: "Lisa Rodriguez",
    phone: "(555) 567-8901",
    email: "lisa@email.com",
    type: "dine_in",
    tableNumber: "T-3",
    items: [
      { name: "Caprese Salad", qty: 1, price: 13.0 },
      { name: "Lasagna", qty: 1, price: 19.0 },
      { name: "House Red Wine", qty: 1, price: 12.0 },
    ],
    subtotal: 44.0,
    tax: 3.85,
    total: 47.85,
    status: "completed",
    createdAt: "2024-03-11T13:48:00Z",
  },
  {
    id: "6",
    orderNumber: "FED-P7Q8R9",
    customer: "David Kim",
    phone: "(555) 678-9012",
    email: "david@email.com",
    type: "pickup",
    items: [
      { name: "Pepperoni Pizza", qty: 2, price: 19.0 },
      { name: "Garlic Bread", qty: 1, price: 7.0 },
      { name: "Coke", qty: 3, price: 3.0 },
    ],
    subtotal: 54.0,
    tax: 4.73,
    total: 58.73,
    status: "pending",
    createdAt: "2024-03-11T14:35:00Z",
  },
  {
    id: "7",
    orderNumber: "FED-S1T2U3",
    customer: "Anna Müller",
    phone: "(555) 789-0123",
    email: "anna@email.com",
    type: "delivery",
    items: [
      { name: "Four Cheese Pizza", qty: 1, price: 20.0 },
      { name: "Minestrone Soup", qty: 1, price: 10.0 },
    ],
    subtotal: 30.0,
    tax: 2.63,
    total: 32.63,
    status: "preparing",
    createdAt: "2024-03-11T14:20:00Z",
    notes: "Buzzer code: 4521",
  },
];

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "warning" | "default" | "success" | "secondary";
    next?: string;
    nextLabel?: string;
  }
> = {
  pending: { label: "Pending", variant: "warning", next: "preparing", nextLabel: "Confirm" },
  preparing: { label: "Preparing", variant: "default", next: "ready", nextLabel: "Mark Ready" },
  ready: { label: "Ready", variant: "success", next: "completed", nextLabel: "Complete" },
  completed: { label: "Completed", variant: "secondary" },
};

const typeLabels: Record<string, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  dine_in: "Dine In",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      search === "" ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track incoming orders in real-time.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              All
              <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                {statusCounts.all}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              Pending
              <span className="rounded-full bg-yellow-100 text-yellow-800 px-1.5 text-[10px] font-semibold">
                {statusCounts.pending}
              </span>
            </TabsTrigger>
            <TabsTrigger value="preparing" className="gap-1.5 hidden sm:flex">
              Preparing
              <span className="rounded-full bg-blue-100 text-blue-800 px-1.5 text-[10px] font-semibold">
                {statusCounts.preparing}
              </span>
            </TabsTrigger>
            <TabsTrigger value="ready" className="gap-1.5 hidden sm:flex">
              Ready
              <span className="rounded-full bg-green-100 text-green-800 px-1.5 text-[10px] font-semibold">
                {statusCounts.ready}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1.5 hidden md:flex">
              Completed
              <span className="rounded-full bg-gray-100 text-gray-800 px-1.5 text-[10px] font-semibold">
                {statusCounts.completed}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {filteredOrders.map((order) => {
          const config = statusConfig[order.status];
          const isExpanded = expandedOrder === order.id;

          return (
            <Card
              key={order.id}
              className={`transition-all duration-200 ${
                order.status === "pending"
                  ? "border-yellow-200 bg-yellow-50/30"
                  : ""
              }`}
            >
              <CardContent className="p-0">
                {/* Order summary row */}
                <button
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold">
                        {order.orderNumber}
                      </span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabels[order.type]}
                        {order.tableNumber && ` - ${order.tableNumber}`}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {order.customer} &mdash;{" "}
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        ${order.total.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {timeAgo(order.createdAt)}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-4">
                    {/* Customer info */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Customer
                        </p>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {order.phone}
                        </div>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                      {order.type === "delivery" && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Delivery Address
                          </p>
                          <div className="flex items-start gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                            <span>123 Main St, Apt 4B, New York, NY 10001</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Items
                      </p>
                      <div className="space-y-2 rounded-lg border p-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">{item.qty}x</span>{" "}
                                {item.name}
                              </p>
                              {item.modifiers && (
                                <p className="text-xs text-muted-foreground ml-5">
                                  {item.modifiers.join(", ")}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              ${(item.qty * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                        <p className="text-xs font-medium text-yellow-800 uppercase tracking-wider mb-1">
                          Customer Notes
                        </p>
                        <p className="text-sm text-yellow-900">{order.notes}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {config.next && (
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => updateStatus(order.id, config.next!)}
                          className="flex-1 sm:flex-none"
                        >
                          {config.nextLabel}
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="destructive"
                            onClick={() => updateStatus(order.id, "cancelled")}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

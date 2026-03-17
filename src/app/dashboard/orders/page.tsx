"use client";

import React, { useState } from "react";
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
import { useOrders } from "@/lib/hooks/use-orders";
import { useDashboard } from "@/lib/demo-context";
import { ORDER_STATUS_CONFIG, ORDER_TYPE_LABELS } from "@/lib/constants";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function OrdersPage() {
  const { restaurantId } = useDashboard();
  const { orders, isLoading, updateStatus, mutate } = useOrders(restaurantId);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      search === "" ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await updateStatus(orderId, newStatus);
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start"
          onClick={() => mutate()}
        >
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
          const config = ORDER_STATUS_CONFIG[order.status] ?? {
            label: order.status,
            variant: "secondary" as const,
          };
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
                        {order.id.slice(0, 12).toUpperCase()}
                      </span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {order.customerName ?? "Guest"} &mdash;{" "}
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
                        <p className="text-sm font-medium">
                          {order.customerName ?? "Guest"}
                        </p>
                        {order.customerPhone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {order.customerPhone}
                          </div>
                        )}
                        {order.customerEmail && (
                          <p className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        )}
                      </div>
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
                                <span className="font-medium">{item.quantity}x</span>{" "}
                                {item.name}
                              </p>
                              {item.modifiers && (
                                <p className="text-xs text-muted-foreground ml-5">
                                  {item.modifiers}
                                </p>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
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
                    {order.specialInstructions && (
                      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                        <p className="text-xs font-medium text-yellow-800 uppercase tracking-wider mb-1">
                          Customer Notes
                        </p>
                        <p className="text-sm text-yellow-900">
                          {order.specialInstructions}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {config.next && (
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => handleUpdateStatus(order.id, config.next!)}
                          className="flex-1 sm:flex-none"
                        >
                          {config.nextLabel}
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleUpdateStatus(order.id, "cancelled")
                            }
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

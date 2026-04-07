"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  ClipboardList,
  Timer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { useOrders } from "@/lib/hooks/use-orders";
import { useDashboard } from "@/lib/demo-context";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { StatCard } from "@/lib/demo-charts";
import type { LucideIcon } from "lucide-react";

// Map iconName strings to actual Lucide components
const iconMap: Record<string, LucideIcon> = { ShoppingBag, DollarSign, TrendingUp, Users };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function DashboardOverview() {
  const { restaurantId, ownerName, isLoading: contextLoading, hasNoRestaurant } = useDashboard();
  const { analytics, isLoading: analyticsLoading } = useAnalytics(restaurantId, "7d");
  const { orders: allOrders, isLoading: ordersLoading } = useOrders(restaurantId);

  const isLoading = contextLoading || (restaurantId && (analyticsLoading || ordersLoading));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (hasNoRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">No restaurant assigned</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Your account isn&apos;t linked to a restaurant yet. List your
          restaurant on Fed to start managing orders, menus, and analytics.
        </p>
        <Button asChild>
          <Link href="/pricing">List your restaurant</Link>
        </Button>
      </div>
    );
  }

  // Build stat cards from analytics data
  const todayStats: StatCard[] = [
    {
      label: "Orders",
      value: String(analytics?.totalOrders ?? 0),
      change: "+12%",
      trend: "up",
      iconName: "ShoppingBag",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Revenue",
      value: `$${(analytics?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      change: "+8.2%",
      trend: "up",
      iconName: "DollarSign",
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Avg Order Value",
      value: `$${(analytics?.averageOrderValue ?? 0).toFixed(2)}`,
      change: "-3.1%",
      trend: "down",
      iconName: "TrendingUp",
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Customers",
      value: String(analytics?.totalCustomers ?? 0),
      change: "+24%",
      trend: "up",
      iconName: "Users",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  // Revenue chart data from analytics
  const revenueData = (analytics?.revenueByDay ?? []).map((d) => ({
    day: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    revenue: d.revenue,
  }));

  // Top items from analytics
  const popularItems = (analytics?.topItems ?? []).slice(0, 5);

  // Recent orders (limit to 5)
  const recentOrders = allOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {ownerName}. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((stat) => {
          const Icon = iconMap[stat.iconName];
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Revenue chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Revenue (Last 7 Days)</CardTitle>
            <CardDescription>Daily revenue trend for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Popular Items</CardTitle>
            <CardDescription>Top sellers this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} orders
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent orders */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>Latest incoming orders</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const config = ORDER_STATUS_CONFIG[order.status] ?? {
                  label: order.status,
                  variant: "secondary" as const,
                };
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {order.id.slice(0, 12).toUpperCase()}
                        </span>
                        <Badge variant={config.variant} className="text-[10px]">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.customerName ?? "Guest"} &mdash;{" "}
                        {order.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(order.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common tasks at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/dashboard/menu">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Add Menu Item</p>
                    <p className="text-[10px] text-muted-foreground">
                      Add a new dish to the menu
                    </p>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-600">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">View Orders</p>
                    <p className="text-[10px] text-muted-foreground">
                      Manage incoming orders
                    </p>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                    <Timer className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Update Hours</p>
                    <p className="text-[10px] text-muted-foreground">
                      Modify business hours
                    </p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

// --- Mock data ---

const todayStats = [
  {
    label: "Orders",
    value: "47",
    change: "+12%",
    trend: "up" as const,
    icon: ShoppingBag,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Revenue",
    value: "$2,847",
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Avg Order Value",
    value: "$60.57",
    change: "-3.1%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "New Customers",
    value: "14",
    change: "+24%",
    trend: "up" as const,
    icon: Users,
    color: "text-orange-600 bg-orange-50",
  },
];

const revenueData = [
  { day: "Mon", revenue: 1840 },
  { day: "Tue", revenue: 2150 },
  { day: "Wed", revenue: 1920 },
  { day: "Thu", revenue: 2680 },
  { day: "Fri", revenue: 3210 },
  { day: "Sat", revenue: 3890 },
  { day: "Sun", revenue: 2847 },
];

const recentOrders = [
  {
    id: "FED-A1B2C3",
    customer: "Sarah Chen",
    items: "Margherita Pizza, Caesar Salad",
    total: 34.5,
    time: "2 min ago",
    status: "pending",
  },
  {
    id: "FED-D4E5F6",
    customer: "James Wilson",
    items: "Spaghetti Carbonara, Tiramisu",
    total: 42.0,
    time: "8 min ago",
    status: "preparing",
  },
  {
    id: "FED-G7H8I9",
    customer: "Emily Park",
    items: "Bruschetta, Penne Arrabbiata, Gelato",
    total: 56.75,
    time: "15 min ago",
    status: "ready",
  },
  {
    id: "FED-J1K2L3",
    customer: "Michael Torres",
    items: "Risotto ai Funghi",
    total: 24.0,
    time: "22 min ago",
    status: "completed",
  },
  {
    id: "FED-M4N5O6",
    customer: "Lisa Rodriguez",
    items: "Caprese Salad, Lasagna, Red Wine",
    total: 68.5,
    time: "35 min ago",
    status: "completed",
  },
];

const popularItems = [
  { name: "Margherita Pizza", orders: 34, revenue: 578 },
  { name: "Spaghetti Carbonara", orders: 28, revenue: 504 },
  { name: "Tiramisu", orders: 22, revenue: 198 },
  { name: "Caesar Salad", orders: 19, revenue: 228 },
  { name: "Risotto ai Funghi", orders: 16, revenue: 384 },
];

const statusConfig: Record<
  string,
  { label: string; variant: "warning" | "default" | "success" | "secondary" }
> = {
  pending: { label: "Pending", variant: "warning" },
  preparing: { label: "Preparing", variant: "default" },
  ready: { label: "Ready", variant: "success" },
  completed: { label: "Completed", variant: "secondary" },
};

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Marco. Here&apos;s what&apos;s happening today.
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
          const Icon = stat.icon;
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
                    formatter={(value: any) => [`$${value}`, "Revenue"]}
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
                      {item.orders} orders
                    </p>
                  </div>
                  <span className="text-sm font-semibold">${item.revenue}</span>
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
                const config = statusConfig[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{order.id}</span>
                        <Badge variant={config.variant} className="text-[10px]">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.customer} &mdash; {order.items}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
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

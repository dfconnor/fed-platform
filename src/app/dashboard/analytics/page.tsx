"use client";

import React, { useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Star,
  Calendar,
  ArrowUpRight,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import { useDashboard } from "@/lib/demo-context";
import {
  analyticsRatingDistribution,
  analyticsAverageRating,
  analyticsTotalReviews,
} from "@/lib/demo-charts";
import type { StatCard } from "@/lib/demo-charts";

// Map iconName strings to actual Lucide components
const iconMap: Record<string, any> = { DollarSign, ShoppingBag, TrendingUp, Users };

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("14d");
  const { restaurantId } = useDashboard();
  const { analytics, isLoading } = useAnalytics(restaurantId, dateRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Build KPI cards from analytics
  const kpiCards: StatCard[] = [
    {
      label: "Total Revenue",
      value: `$${(analytics?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      change: "+18%",
      iconName: "DollarSign",
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Orders",
      value: String(analytics?.totalOrders ?? 0),
      change: "+12%",
      iconName: "ShoppingBag",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Avg Order Value",
      value: `$${(analytics?.averageOrderValue ?? 0).toFixed(2)}`,
      change: "+5.3%",
      iconName: "TrendingUp",
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Total Customers",
      value: String(analytics?.totalCustomers ?? 0),
      change: "+22%",
      iconName: "Users",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  // Revenue chart data
  const revenueData = (analytics?.revenueByDay ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: d.revenue,
  }));

  // Hourly orders data from analytics (if available)
  const hourlyOrders = (analytics as any)?.ordersByHour ?? [];

  // Top items from analytics
  const topItems = analytics?.topItems ?? [];
  const maxOrders = topItems.length > 0
    ? Math.max(...topItems.map((i) => i.quantity))
    : 1;

  // Order type breakdown from analytics (if available)
  const orderTypeData = (analytics as any)?.orderTypes ?? [];

  // Payment method breakdown from analytics (if available)
  const paymentMethodData = (analytics as any)?.paymentMethods ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your restaurant&apos;s performance and trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = iconMap[kpi.iconName];
          return (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>
            Daily revenue over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  formatter={(value: any, name: any) => [
                    name === "revenue" ? `$${value}` : value,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by hour */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Hour</CardTitle>
            <CardDescription>Average order volume throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              {hourlyOrders.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                      formatter={(value: any) => [value, "Orders"]}
                    />
                    <Bar dataKey="orders" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    Hourly data will appear as more orders come in
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top selling items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Selling Items</CardTitle>
            <CardDescription>Best performers by order count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems.length > 0 ? (
                topItems.map((item, i) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-4">
                          {i + 1}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.quantity} orders</span>
                        <span className="font-medium text-foreground">
                          ${item.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(item.quantity / maxOrders) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">
                    No item data available yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order type breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Types</CardTitle>
            <CardDescription>Breakdown by fulfillment method</CardDescription>
          </CardHeader>
          <CardContent>
            {orderTypeData.length > 0 ? (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {orderTypeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                        formatter={(value: any) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {orderTypeData.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-sm text-muted-foreground">
                  Order type data will appear as more orders come in
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>How customers pay</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                        formatter={(value: any) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {paymentMethodData.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[280px]">
                <p className="text-sm text-muted-foreground">
                  Payment data will appear as more orders come in
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Satisfaction</CardTitle>
            <CardDescription>Average rating from reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                <span className="text-5xl font-bold">{analyticsAverageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">out of 5.0</p>
              <div className="w-full space-y-2">
                {analyticsRatingDistribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="text-xs w-3 text-right text-muted-foreground">
                      {row.stars}
                    </span>
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Based on {analyticsTotalReviews} reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

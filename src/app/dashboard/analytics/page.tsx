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

// --- Mock data ---

const kpiCards = [
  { label: "Total Revenue", value: "$24,680", change: "+14.2%", icon: DollarSign, color: "text-green-600 bg-green-50" },
  { label: "Total Orders", value: "482", change: "+8.7%", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
  { label: "Avg Order Value", value: "$51.20", change: "+5.3%", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
  { label: "Return Rate", value: "68%", change: "+12.1%", icon: Users, color: "text-orange-600 bg-orange-50" },
];

const revenueData = [
  { date: "Mar 1", revenue: 2850, orders: 58 },
  { date: "Mar 2", revenue: 3200, orders: 65 },
  { date: "Mar 3", revenue: 2950, orders: 61 },
  { date: "Mar 4", revenue: 3800, orders: 74 },
  { date: "Mar 5", revenue: 4200, orders: 82 },
  { date: "Mar 6", revenue: 3600, orders: 70 },
  { date: "Mar 7", revenue: 3100, orders: 63 },
  { date: "Mar 8", revenue: 3400, orders: 68 },
  { date: "Mar 9", revenue: 4100, orders: 80 },
  { date: "Mar 10", revenue: 3750, orders: 73 },
  { date: "Mar 11", revenue: 4500, orders: 88 },
  { date: "Mar 12", revenue: 3900, orders: 76 },
  { date: "Mar 13", revenue: 3300, orders: 66 },
  { date: "Mar 14", revenue: 2980, orders: 59 },
];

const hourlyOrders = [
  { hour: "8am", orders: 4 },
  { hour: "9am", orders: 8 },
  { hour: "10am", orders: 12 },
  { hour: "11am", orders: 28 },
  { hour: "12pm", orders: 52 },
  { hour: "1pm", orders: 48 },
  { hour: "2pm", orders: 22 },
  { hour: "3pm", orders: 15 },
  { hour: "4pm", orders: 10 },
  { hour: "5pm", orders: 18 },
  { hour: "6pm", orders: 42 },
  { hour: "7pm", orders: 56 },
  { hour: "8pm", orders: 50 },
  { hour: "9pm", orders: 38 },
  { hour: "10pm", orders: 20 },
];

const topItems = [
  { name: "Margherita Pizza", orders: 142, revenue: 2414 },
  { name: "Spaghetti Carbonara", orders: 118, revenue: 2124 },
  { name: "Pepperoni Pizza", orders: 105, revenue: 1995 },
  { name: "Tiramisu", orders: 96, revenue: 864 },
  { name: "Risotto ai Funghi", orders: 82, revenue: 1804 },
  { name: "Bruschetta", orders: 78, revenue: 858 },
  { name: "Caesar Salad", orders: 71, revenue: 852 },
  { name: "Lasagna", orders: 64, revenue: 1216 },
];

const orderTypeData = [
  { name: "Pickup", value: 45, color: "#3B82F6" },
  { name: "Dine In", value: 35, color: "#8B5CF6" },
  { name: "Delivery", value: 20, color: "#F59E0B" },
];

const paymentMethodData = [
  { name: "Credit Card", value: 55, color: "#3B82F6" },
  { name: "Apple Pay", value: 22, color: "#111827" },
  { name: "Google Pay", value: 13, color: "#10B981" },
  { name: "Cash", value: 10, color: "#F59E0B" },
];

const maxOrders = Math.max(...topItems.map((i) => i.orders));

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("14d");

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
          const Icon = kpi.icon;
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
              {topItems.map((item, i) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-4">
                        {i + 1}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.orders} orders</span>
                      <span className="font-medium text-foreground">
                        ${item.revenue}
                      </span>
                    </div>
                  </div>
                  <div className="ml-6 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
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
                    {orderTypeData.map((entry, index) => (
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
              {orderTypeData.map((item) => (
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
          </CardContent>
        </Card>

        {/* Payment methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>How customers pay</CardDescription>
          </CardHeader>
          <CardContent>
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
                    {paymentMethodData.map((entry, index) => (
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
              {paymentMethodData.map((item) => (
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
                <span className="text-5xl font-bold">4.7</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">out of 5.0</p>
              <div className="w-full space-y-2">
                {[
                  { stars: 5, count: 186, percent: 62 },
                  { stars: 4, count: 72, percent: 24 },
                  { stars: 3, count: 24, percent: 8 },
                  { stars: 2, count: 12, percent: 4 },
                  { stars: 1, count: 6, percent: 2 },
                ].map((row) => (
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
              <p className="text-xs text-muted-foreground mt-3">Based on 300 reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

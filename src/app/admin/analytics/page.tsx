"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Store,
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
  LineChart,
  Line,
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

const platformRevenueData = [
  { month: "Sep", revenue: 420000, fees: 10500 },
  { month: "Oct", revenue: 480000, fees: 12000 },
  { month: "Nov", revenue: 510000, fees: 12750 },
  { month: "Dec", revenue: 620000, fees: 15500 },
  { month: "Jan", revenue: 550000, fees: 13750 },
  { month: "Feb", revenue: 590000, fees: 14750 },
  { month: "Mar", revenue: 684000, fees: 17100 },
];

const ordersPerRestaurant = [
  { name: "Pizza Palace", orders: 4150 },
  { name: "Taco Fiesta", orders: 3210 },
  { name: "Bella Cucina", orders: 2847 },
  { name: "Sushi Master", orders: 1923 },
  { name: "Le Petit Bistro", orders: 1580 },
  { name: "Wok Express", orders: 890 },
];

const growthData = [
  { week: "W1", newUsers: 42, newRestaurants: 1 },
  { week: "W2", newUsers: 58, newRestaurants: 0 },
  { week: "W3", newUsers: 67, newRestaurants: 2 },
  { week: "W4", newUsers: 53, newRestaurants: 1 },
  { week: "W5", newUsers: 84, newRestaurants: 3 },
  { week: "W6", newUsers: 71, newRestaurants: 0 },
  { week: "W7", newUsers: 92, newRestaurants: 2 },
  { week: "W8", newUsers: 78, newRestaurants: 1 },
  { week: "W9", newUsers: 105, newRestaurants: 2 },
  { week: "W10", newUsers: 88, newRestaurants: 1 },
  { week: "W11", newUsers: 112, newRestaurants: 3 },
  { week: "W12", newUsers: 96, newRestaurants: 2 },
];

const topRestaurants = [
  { name: "Pizza Palace", revenue: 201000, orders: 4150, rating: 4.3, growth: "+15%" },
  { name: "Bella Cucina", revenue: 148230, orders: 2847, rating: 4.7, growth: "+22%" },
  { name: "Le Petit Bistro", revenue: 134200, orders: 1580, rating: 4.9, growth: "+31%" },
  { name: "Sushi Master", revenue: 112450, orders: 1923, rating: 4.8, growth: "+18%" },
  { name: "Taco Fiesta", revenue: 95800, orders: 3210, rating: 4.5, growth: "+12%" },
];

const revenueByRestaurant = [
  { name: "Pizza Palace", value: 201000, color: "#a855f7" },
  { name: "Bella Cucina", value: 148230, color: "#3b82f6" },
  { name: "Le Petit Bistro", value: 134200, color: "#10b981" },
  { name: "Sushi Master", value: 112450, color: "#f59e0b" },
  { name: "Taco Fiesta", value: 95800, color: "#ef4444" },
  { name: "Others", value: 42100, color: "#6b7280" },
];

const feeRevenueData = [
  { month: "Sep", platformFees: 10500, net: 4200 },
  { month: "Oct", platformFees: 12000, net: 4800 },
  { month: "Nov", platformFees: 12750, net: 5100 },
  { month: "Dec", platformFees: 15500, net: 6200 },
  { month: "Jan", platformFees: 13750, net: 5500 },
  { month: "Feb", platformFees: 14750, net: 5900 },
  { month: "Mar", platformFees: 17100, net: 6840 },
];

const maxRevenue = Math.max(...topRestaurants.map((r) => r.revenue));

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("7m");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Platform Analytics
          </h1>
          <p className="text-slate-400">
            Comprehensive platform performance insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] border-slate-700 bg-slate-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="7m">Last 7 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total GMV", value: "$3.86M", change: "+22%", icon: DollarSign, color: "text-green-400 bg-green-500/20" },
          { label: "Platform Fees", value: "$96.4K", change: "+22%", icon: TrendingUp, color: "text-purple-400 bg-purple-500/20" },
          { label: "New Users (12w)", value: "946", change: "+34%", icon: Users, color: "text-blue-400 bg-blue-500/20" },
          { label: "New Restaurants (12w)", value: "18", change: "+50%", icon: Store, color: "text-amber-400 bg-amber-500/20" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-slate-800 bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-slate-400">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform revenue chart */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">Platform Revenue</CardTitle>
          <CardDescription className="text-slate-400">
            Gross Merchandise Value and platform fees collected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformRevenueData}>
                <defs>
                  <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminFeesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value: any, name: any) => [
                    `$${String(value)}`,
                    name === "revenue" ? "Total GMV" : "Platform Fees",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "revenue" ? "Total GMV" : "Platform Fees"
                  }
                  wrapperStyle={{ color: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#adminRevenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="fees"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#adminFeesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders per restaurant */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Orders per Restaurant
            </CardTitle>
            <CardDescription className="text-slate-400">
              Total orders by restaurant (all time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ordersPerRestaurant}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#e2e8f0",
                    }}
                    formatter={(value: any) => [
                      value.toLocaleString(),
                      "Orders",
                    ]}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#a855f7"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Growth metrics */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Growth Metrics
            </CardTitle>
            <CardDescription className="text-slate-400">
              New users and restaurants per week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8" }} />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newRestaurants"
                    name="New Restaurants"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Top performing restaurants */}
        <Card className="lg:col-span-3 border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Top Performing Restaurants
            </CardTitle>
            <CardDescription className="text-slate-400">
              Ranked by total revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRestaurants.map((restaurant, i) => (
                <div key={restaurant.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {restaurant.name}
                      </span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                        {restaurant.growth}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{restaurant.orders.toLocaleString()} orders</span>
                      <span className="font-medium text-white">
                        ${(restaurant.revenue / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                  <div className="ml-9 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{
                        width: `${(restaurant.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue breakdown pie */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Revenue Breakdown
            </CardTitle>
            <CardDescription className="text-slate-400">
              Revenue share by restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByRestaurant}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueByRestaurant.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#e2e8f0",
                    }}
                    formatter={(value: any) => [
                      `$${(value / 1000).toFixed(1)}k`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {revenueByRestaurant.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform fee revenue breakdown */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">
            Platform Fee Revenue
          </CardTitle>
          <CardDescription className="text-slate-400">
            Platform fees collected vs net revenue after processing costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                  }}
                  formatter={(value: any, name: any) => [
                    `$${String(value)}`,
                    name === "platformFees"
                      ? "Platform Fees (2.5%)"
                      : "Net Revenue",
                  ]}
                />
                <Legend
                  formatter={(value) =>
                    value === "platformFees"
                      ? "Platform Fees"
                      : "Net Revenue"
                  }
                  wrapperStyle={{ color: "#94a3b8" }}
                />
                <Bar
                  dataKey="platformFees"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="net"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Store,
  Calendar,
  ArrowUpRight,
  type LucideIcon,
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
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import {
  usePlatformAnalytics,
  useSignupAnalytics,
  useFeeAnalytics,
} from "@/lib/hooks/use-analytics";

// --- Icon map: resolve iconName strings from mock-data to Lucide components ---
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  TrendingUp,
  Users,
  Store,
};

// Map UI period strings to the time-series API period strings.
// Platform analytics uses days (7d/30d/90d) but signups + fees use weeks
// for the broader historical view.
const PERIOD_TO_WEEKS: Record<string, string> = {
  "4w": "4w",
  "12w": "12w",
  "26w": "26w",
  "52w": "52w",
};

// Map historical period to a roughly-equivalent platform period (days).
const PERIOD_TO_DAYS: Record<string, string> = {
  "4w": "30d",
  "12w": "90d",
  "26w": "90d",
  "52w": "90d",
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("12w");
  const platformPeriod = PERIOD_TO_DAYS[period] ?? "30d";
  const seriesPeriod = PERIOD_TO_WEEKS[period] ?? "12w";

  const { analytics, isLoading } = usePlatformAnalytics(platformPeriod);
  const { data: signupRows, isLoading: signupsLoading } =
    useSignupAnalytics(seriesPeriod);
  const { data: feeRows, isLoading: feesLoading } = useFeeAnalytics(seriesPeriod);

  // Format weekly signup rows for the line chart (label = "MMM d")
  const growthData = (signupRows ?? []).map((row) => {
    const d = new Date(row.weekStart);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      week: label,
      newUsers: row.newUsers,
      newRestaurants: row.newRestaurants,
    };
  });

  // Format monthly fee rows for the bar chart (label = "MMM")
  const feeRevenueData = (feeRows ?? []).map((row) => {
    const d = new Date(row.monthStart);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      platformFees: row.platformFees,
      net: row.net,
    };
  });

  // Real data from API (with empty fallbacks for first paint)
  const topRestaurants = analytics?.topRestaurants ?? [];
  const ordersPerRestaurant = analytics?.ordersPerRestaurant ?? [];
  const revenueByRestaurant = analytics?.revenueByRestaurant ?? [];
  const platformRevenueData = (analytics?.revenueByDay ?? []).map((d) => ({
    month: d.date,
    revenue: d.revenue,
    fees: Math.round(d.revenue * ((analytics?.feePercent ?? 2.5) / 100) * 100) / 100,
  }));
  const maxRevenue = topRestaurants.length
    ? Math.max(...topRestaurants.map((r) => r.revenue))
    : 1;

  // Live KPI cards from real API data
  const kpiCards = [
    {
      label: "Total GMV",
      value: `$${(analytics?.totalRevenue ?? 0).toLocaleString()}`,
      change: "",
      iconName: "DollarSign",
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      label: "Total Orders",
      value: (analytics?.totalOrders ?? 0).toLocaleString(),
      change: "",
      iconName: "TrendingUp",
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Total Users",
      value: (analytics?.totalUsers ?? 0).toLocaleString(),
      change: "",
      iconName: "Users",
      color: "text-green-400 bg-green-500/10",
    },
    {
      label: "Restaurants",
      value: (analytics?.totalRestaurants ?? 0).toLocaleString(),
      change: "",
      iconName: "Store",
      color: "text-orange-400 bg-orange-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

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
              <SelectItem value="4w">Last 4 weeks</SelectItem>
              <SelectItem value="12w">Last 12 weeks</SelectItem>
              <SelectItem value="26w">Last 26 weeks</SelectItem>
              <SelectItem value="52w">Last 52 weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = iconMap[kpi.iconName] ?? DollarSign;
          return (
            <Card key={kpi.label} className="border-slate-800 bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {kpi.change && (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {kpi.change}
                    </div>
                  )}
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
                  formatter={(value: ValueType | undefined, name: NameType | undefined) => [
                    `$${String(value ?? 0)}`,
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
                    formatter={(value: ValueType | undefined) => [
                      Number(value ?? 0).toLocaleString(),
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
              {signupsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-full w-full animate-pulse rounded-md bg-slate-800/40" />
                </div>
              ) : (
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
              )}
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
            {topRestaurants.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-slate-500">
                  No restaurant data for this period
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topRestaurants.map((restaurant, i) => (
                  <div key={restaurant.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {restaurant.name}
                        </span>
                        {restaurant.growth !== "—" && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                            {restaurant.growth}
                          </Badge>
                        )}
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
            )}
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
                    formatter={(value: ValueType | undefined) => [
                      `$${(Number(value ?? 0) / 1000).toFixed(1)}k`,
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
            {feesLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-800/40" />
              </div>
            ) : (
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
                    formatter={(value: ValueType | undefined, name: NameType | undefined) => [
                      `$${String(value ?? 0)}`,
                      name === "platformFees"
                        ? "Platform Fees"
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import {
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Mock data ---

const platformStats = [
  {
    label: "Total Restaurants",
    value: "38",
    change: "+3",
    period: "this month",
    icon: Store,
    color: "text-purple-400 bg-purple-500/20",
  },
  {
    label: "Total Orders",
    value: "12,847",
    change: "+18.4%",
    period: "vs last month",
    icon: ShoppingBag,
    color: "text-blue-400 bg-blue-500/20",
  },
  {
    label: "Total Revenue",
    value: "$684,230",
    change: "+22.1%",
    period: "vs last month",
    icon: DollarSign,
    color: "text-green-400 bg-green-500/20",
  },
  {
    label: "Platform Fees",
    value: "$17,106",
    change: "+22.1%",
    period: "2.5% of revenue",
    icon: TrendingUp,
    color: "text-amber-400 bg-amber-500/20",
  },
];

const signupData = [
  { week: "W1", restaurants: 2, users: 145 },
  { week: "W2", restaurants: 1, users: 178 },
  { week: "W3", restaurants: 3, users: 210 },
  { week: "W4", restaurants: 2, users: 192 },
  { week: "W5", restaurants: 4, users: 268 },
  { week: "W6", restaurants: 1, users: 234 },
  { week: "W7", restaurants: 3, users: 310 },
  { week: "W8", restaurants: 2, users: 287 },
];

const feeRevenueData = [
  { month: "Oct", fees: 11200 },
  { month: "Nov", fees: 12800 },
  { month: "Dec", fees: 14500 },
  { month: "Jan", fees: 13200 },
  { month: "Feb", fees: 15100 },
  { month: "Mar", fees: 17106 },
];

const recentActivity = [
  {
    id: 1,
    type: "restaurant_signup",
    message: "New restaurant registered: Sushi Master",
    time: "12 min ago",
    icon: Store,
    iconColor: "text-purple-400",
  },
  {
    id: 2,
    type: "order",
    message: "Order FED-X9Y8Z7 completed at Bella Cucina ($67.50)",
    time: "18 min ago",
    icon: CheckCircle,
    iconColor: "text-green-400",
  },
  {
    id: 3,
    type: "user_signup",
    message: "New user registered: alex.johnson@email.com",
    time: "25 min ago",
    icon: Users,
    iconColor: "text-blue-400",
  },
  {
    id: 4,
    type: "order_cancelled",
    message: "Order FED-A2B3C4 cancelled at Pizza Palace",
    time: "32 min ago",
    icon: XCircle,
    iconColor: "text-red-400",
  },
  {
    id: 5,
    type: "restaurant_approval",
    message: "Thai Delight pending approval - submitted 2 hours ago",
    time: "2 hr ago",
    icon: AlertCircle,
    iconColor: "text-amber-400",
  },
  {
    id: 6,
    type: "order",
    message: "Order FED-D5E6F7 completed at Taco Fiesta ($34.20)",
    time: "3 hr ago",
    icon: CheckCircle,
    iconColor: "text-green-400",
  },
  {
    id: 7,
    type: "restaurant_signup",
    message: "New restaurant registered: The Burger Joint",
    time: "5 hr ago",
    icon: Store,
    iconColor: "text-purple-400",
  },
  {
    id: 8,
    type: "user_signup",
    message: "New user registered: maria.garcia@email.com",
    time: "6 hr ago",
    icon: Users,
    iconColor: "text-blue-400",
  },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Platform Overview
          </h1>
          <p className="text-slate-400">
            Monitor your platform&apos;s health and growth metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
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
        {platformStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-slate-800 bg-slate-900 text-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.period}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* New signups chart */}
        <Card className="lg:col-span-3 border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              New Signups (Last 8 Weeks)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Weekly new restaurant and user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="restaurants"
                    name="Restaurants"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="users"
                    name="Users"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest platform events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 ${activity.iconColor}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 leading-snug">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform fee revenue */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-white">
            Platform Fee Revenue
          </CardTitle>
          <CardDescription className="text-slate-400">
            Monthly platform fees collected (2.5% of all transactions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeRevenueData}>
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
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Platform Fees"]}
                />
                <Line
                  type="monotone"
                  dataKey="fees"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

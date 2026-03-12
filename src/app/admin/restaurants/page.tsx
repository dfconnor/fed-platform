"use client";

import React, { useState } from "react";
import {
  Search,
  Store,
  Eye,
  Check,
  X,
  MoreHorizontal,
  MapPin,
  ShoppingBag,
  DollarSign,
  Star,
  Filter,
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock data ---

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner: string;
  ownerEmail: string;
  city: string;
  state: string;
  status: "active" | "pending" | "inactive";
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  joinedAt: string;
  isActive: boolean;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "r-1", name: "Bella Cucina", slug: "bella-cucina", owner: "Marco Rossi", ownerEmail: "marco@bellacucina.com",
    city: "New York", state: "NY", status: "active", totalOrders: 2847, totalRevenue: 148230, rating: 4.7,
    reviewCount: 300, joinedAt: "2023-06-15", isActive: true,
  },
  {
    id: "r-2", name: "Sushi Master", slug: "sushi-master", owner: "Yuki Tanaka", ownerEmail: "yuki@sushimaster.com",
    city: "Los Angeles", state: "CA", status: "active", totalOrders: 1923, totalRevenue: 112450, rating: 4.8,
    reviewCount: 215, joinedAt: "2023-08-22", isActive: true,
  },
  {
    id: "r-3", name: "Taco Fiesta", slug: "taco-fiesta", owner: "Carlos Mendez", ownerEmail: "carlos@tacofiesta.com",
    city: "Austin", state: "TX", status: "active", totalOrders: 3210, totalRevenue: 95800, rating: 4.5,
    reviewCount: 428, joinedAt: "2023-04-10", isActive: true,
  },
  {
    id: "r-4", name: "Pizza Palace", slug: "pizza-palace", owner: "Tony Romano", ownerEmail: "tony@pizzapalace.com",
    city: "Chicago", state: "IL", status: "active", totalOrders: 4150, totalRevenue: 201000, rating: 4.3,
    reviewCount: 520, joinedAt: "2023-01-08", isActive: true,
  },
  {
    id: "r-5", name: "Thai Delight", slug: "thai-delight", owner: "Narin Patel", ownerEmail: "narin@thaidelight.com",
    city: "San Francisco", state: "CA", status: "pending", totalOrders: 0, totalRevenue: 0, rating: 0,
    reviewCount: 0, joinedAt: "2024-03-10", isActive: false,
  },
  {
    id: "r-6", name: "The Burger Joint", slug: "burger-joint", owner: "Dave Miller", ownerEmail: "dave@burgerjoint.com",
    city: "Portland", state: "OR", status: "pending", totalOrders: 0, totalRevenue: 0, rating: 0,
    reviewCount: 0, joinedAt: "2024-03-11", isActive: false,
  },
  {
    id: "r-7", name: "Le Petit Bistro", slug: "le-petit-bistro", owner: "Sophie Dubois", ownerEmail: "sophie@lepetitbistro.com",
    city: "New York", state: "NY", status: "active", totalOrders: 1580, totalRevenue: 134200, rating: 4.9,
    reviewCount: 180, joinedAt: "2023-09-01", isActive: true,
  },
  {
    id: "r-8", name: "Wok Express", slug: "wok-express", owner: "Li Wei", ownerEmail: "li@wokexpress.com",
    city: "Seattle", state: "WA", status: "inactive", totalOrders: 890, totalRevenue: 42100, rating: 3.8,
    reviewCount: 95, joinedAt: "2023-07-20", isActive: false,
  },
];

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleActive = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isActive: !r.isActive,
              status: !r.isActive ? "active" : "inactive",
            }
          : r
      )
    );
  };

  const approveRestaurant = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "active", isActive: true } : r
      )
    );
  };

  const rejectRestaurant = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  const statusCounts = {
    all: restaurants.length,
    active: restaurants.filter((r) => r.status === "active").length,
    pending: restaurants.filter((r) => r.status === "pending").length,
    inactive: restaurants.filter((r) => r.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Restaurants
        </h1>
        <p className="text-slate-400">
          Manage all restaurants on the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: statusCounts.all, color: "text-white" },
          { label: "Active", value: statusCounts.active, color: "text-green-400" },
          { label: "Pending", value: statusCounts.pending, color: "text-amber-400" },
          { label: "Inactive", value: statusCounts.inactive, color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800 bg-slate-900">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search restaurants or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] border-slate-700 bg-slate-900 text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Restaurant list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">
                No restaurants found
              </p>
              <p className="text-xs text-slate-500">
                Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}

        {filtered.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`border-slate-800 bg-slate-900 transition-colors hover:bg-slate-800/50 ${
              restaurant.status === "pending"
                ? "border-amber-500/30"
                : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Restaurant info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-purple-400 shrink-0">
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {restaurant.name}
                      </h3>
                      {restaurant.status === "active" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      )}
                      {restaurant.status === "pending" && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Pending
                        </Badge>
                      )}
                      {restaurant.status === "inactive" && (
                        <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {restaurant.owner} &middot; {restaurant.ownerEmail}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {restaurant.city}, {restaurant.state}
                      </span>
                      <span>Joined {restaurant.joinedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 shrink-0">
                  {restaurant.status !== "pending" && (
                    <>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3 text-slate-500" />
                          <span className="text-sm font-bold text-white">
                            {restaurant.totalOrders.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Orders</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-slate-500" />
                          <span className="text-sm font-bold text-white">
                            ${(restaurant.totalRevenue / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Revenue</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold text-white">
                            {restaurant.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          ({restaurant.reviewCount})
                        </p>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  {restaurant.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1"
                        onClick={() => approveRestaurant(restaurant.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => rejectRestaurant(restaurant.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={restaurant.isActive}
                        onCheckedChange={() => toggleActive(restaurant.id)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700 text-slate-200"
                        >
                          <DropdownMenuItem className="focus:bg-slate-700 focus:text-white">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem className="text-red-400 focus:bg-slate-700 focus:text-red-300">
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
import { useAdminRestaurants, type AdminRestaurant } from "@/lib/hooks/use-admin";

export default function AdminRestaurantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    restaurants,
    isLoading,
    updateAdminRestaurant,
    deleteAdminRestaurant,
  } = useAdminRestaurants(search, statusFilter);

  // Derive a status for each restaurant from isActive
  const getStatus = (r: AdminRestaurant): "active" | "pending" | "inactive" => {
    if (r.isActive) return "active";
    // Consider restaurants created recently without activation as pending
    if (!r.isActive && r.createdAt) {
      const created = new Date(r.createdAt);
      const daysSinceCreation = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 30) return "pending";
    }
    return "inactive";
  };

  // Client-side filtering is handled server-side by the hook,
  // but we also filter by owner name/email locally for the search
  const filtered = restaurants.filter((r) => {
    const ownerName = typeof r.owner === "object" ? r.owner.name : String(r.owner ?? "");
    const ownerEmail = typeof r.owner === "object" ? r.owner.email : "";
    const matchesSearch =
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.toLowerCase().includes(search.toLowerCase()) ||
      ownerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const toggleActive = async (id: string) => {
    const restaurant = restaurants.find((r) => r.id === id);
    if (restaurant) {
      await updateAdminRestaurant(id, { isActive: !restaurant.isActive });
    }
  };

  const approveRestaurant = async (id: string) => {
    await updateAdminRestaurant(id, { isActive: true });
  };

  const rejectRestaurant = async (id: string) => {
    await deleteAdminRestaurant(id);
  };

  const statusCounts = {
    all: restaurants.length,
    active: restaurants.filter((r) => getStatus(r) === "active").length,
    pending: restaurants.filter((r) => getStatus(r) === "pending").length,
    inactive: restaurants.filter((r) => getStatus(r) === "inactive").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Loading restaurants...</div>
      </div>
    );
  }

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

        {filtered.map((restaurant) => {
          const status = getStatus(restaurant);
          const ownerName = typeof restaurant.owner === "object" ? restaurant.owner.name : String(restaurant.owner ?? "");
          const ownerEmail = typeof restaurant.owner === "object" ? restaurant.owner.email : "";
          const totalOrders = (restaurant as Record<string, unknown>).totalOrders as number | undefined;
          const totalRevenue = (restaurant as Record<string, unknown>).totalRevenue as number | undefined;
          const rating = (restaurant as Record<string, unknown>).rating as number | undefined;
          const reviewCount = (restaurant as Record<string, unknown>).reviewCount as number | undefined;
          const city = (restaurant as Record<string, unknown>).city as string | undefined;
          const state = (restaurant as Record<string, unknown>).state as string | undefined;

          return (
          <Card
            key={restaurant.id}
            className={`border-slate-800 bg-slate-900 transition-colors hover:bg-slate-800/50 ${
              status === "pending"
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
                      {status === "active" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      )}
                      {status === "pending" && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Pending
                        </Badge>
                      )}
                      {status === "inactive" && (
                        <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {ownerName} &middot; {ownerEmail}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      {city && state && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {city}, {state}
                        </span>
                      )}
                      <span>Joined {restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 shrink-0">
                  {status !== "pending" && (
                    <>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3 text-slate-500" />
                          <span className="text-sm font-bold text-white">
                            {(totalOrders ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Orders</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-slate-500" />
                          <span className="text-sm font-bold text-white">
                            ${((totalRevenue ?? 0) / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">Revenue</p>
                      </div>
                      {rating != null && (
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-white">
                              {rating}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            ({reviewCount ?? 0})
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Actions */}
                  {status === "pending" ? (
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
          );
        })}
      </div>
    </div>
  );
}

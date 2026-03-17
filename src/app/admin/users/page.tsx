"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  MoreHorizontal,
  Eye,
  Shield,
  ShoppingBag,
  Calendar,
  Mail,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAdminUsers, type AdminUser } from "@/lib/hooks/use-admin";
import { ROLE_BADGE_STYLES } from "@/lib/constants";

const roleBadgeStyles = ROLE_BADGE_STYLES;

/** Derive avatar initials from a user's name. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const {
    users,
    isLoading,
    updateAdminUserRole,
  } = useAdminUsers(search, roleFilter);

  // Client-side search for name/email (hook handles server-side filtering too)
  const filtered = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const openEditRole = (user: AdminUser) => {
    setEditingUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const saveRole = async () => {
    if (editingUser) {
      await updateAdminUserRole(editingUser.id, newRole);
    }
    setEditDialogOpen(false);
  };

  const roleCounts = {
    all: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    owner: users.filter((u) => u.role === "owner").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
        <p className="text-slate-400">
          Manage platform users and their roles.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: roleCounts.all, icon: Users, color: "text-white" },
          { label: "Customers", value: roleCounts.customer, icon: ShoppingBag, color: "text-blue-400" },
          { label: "Owners", value: roleCounts.owner, icon: Shield, color: "text-purple-400" },
          { label: "Admins", value: roleCounts.admin, icon: Shield, color: "text-amber-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-slate-800 bg-slate-900">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px] border-slate-700 bg-slate-900 text-white">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User list */}
      <div className="space-y-2">
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Orders / Spent</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filtered.length === 0 && (
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">No users found</p>
              <p className="text-xs text-slate-500">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}

        {filtered.map((user) => (
          <Card
            key={user.id}
            className="border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-12 md:items-center">
                {/* User info */}
                <div className="flex items-center gap-3 md:col-span-4">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback
                      className={`text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-amber-500/20 text-amber-400"
                          : user.role === "owner"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <Badge className={roleBadgeStyles[user.role]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>

                {/* Orders */}
                <div className="md:col-span-2">
                  {user.role === "customer" ? (
                    <div>
                      <p className="text-sm font-medium text-white">
                        {(user as Record<string, unknown>).totalOrders as number ?? 0} orders
                      </p>
                      <p className="text-xs text-slate-400">
                        ${((user as Record<string, unknown>).totalSpent as number ?? 0).toFixed(2)} spent
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">N/A</span>
                  )}
                </div>

                {/* Joined */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end">
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
                      <DropdownMenuItem
                        className="focus:bg-slate-700 focus:text-white"
                        onClick={() => openEditRole(user)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem className="text-red-400 focus:bg-slate-700 focus:text-red-300">
                        Disable Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit role dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription className="text-slate-400">
              Update the role for {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={saveRole}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

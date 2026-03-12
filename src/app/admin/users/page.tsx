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

// --- Mock data ---

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastActive: string;
  avatarInitials: string;
}

const mockUsers: UserData[] = [
  {
    id: "u-1", name: "Sarah Chen", email: "sarah.chen@email.com", role: "customer",
    phone: "(555) 123-4567", totalOrders: 28, totalSpent: 1245.8, joinedAt: "2023-08-14",
    lastActive: "2 hours ago", avatarInitials: "SC",
  },
  {
    id: "u-2", name: "Marco Rossi", email: "marco@bellacucina.com", role: "owner",
    phone: "(555) 234-5678", totalOrders: 0, totalSpent: 0, joinedAt: "2023-06-15",
    lastActive: "10 min ago", avatarInitials: "MR",
  },
  {
    id: "u-3", name: "James Wilson", email: "james.wilson@email.com", role: "customer",
    phone: "(555) 345-6789", totalOrders: 45, totalSpent: 2890.5, joinedAt: "2023-03-22",
    lastActive: "1 day ago", avatarInitials: "JW",
  },
  {
    id: "u-4", name: "Emily Park", email: "emily.park@email.com", role: "customer",
    phone: "(555) 456-7890", totalOrders: 12, totalSpent: 620.0, joinedAt: "2024-01-05",
    lastActive: "3 hours ago", avatarInitials: "EP",
  },
  {
    id: "u-5", name: "Yuki Tanaka", email: "yuki@sushimaster.com", role: "owner",
    phone: "(555) 567-8901", totalOrders: 0, totalSpent: 0, joinedAt: "2023-08-22",
    lastActive: "30 min ago", avatarInitials: "YT",
  },
  {
    id: "u-6", name: "Admin User", email: "admin@getfed.com", role: "admin",
    phone: "(555) 000-0000", totalOrders: 0, totalSpent: 0, joinedAt: "2023-01-01",
    lastActive: "Online now", avatarInitials: "AD",
  },
  {
    id: "u-7", name: "Lisa Rodriguez", email: "lisa.rod@email.com", role: "customer",
    phone: "(555) 678-9012", totalOrders: 67, totalSpent: 4210.25, joinedAt: "2023-02-10",
    lastActive: "5 hours ago", avatarInitials: "LR",
  },
  {
    id: "u-8", name: "Michael Torres", email: "mike.torres@email.com", role: "customer",
    phone: "(555) 789-0123", totalOrders: 8, totalSpent: 380.0, joinedAt: "2024-02-28",
    lastActive: "2 days ago", avatarInitials: "MT",
  },
  {
    id: "u-9", name: "Carlos Mendez", email: "carlos@tacofiesta.com", role: "owner",
    phone: "(555) 890-1234", totalOrders: 0, totalSpent: 0, joinedAt: "2023-04-10",
    lastActive: "1 hour ago", avatarInitials: "CM",
  },
  {
    id: "u-10", name: "Anna Johnson", email: "anna.j@email.com", role: "customer",
    phone: "(555) 901-2345", totalOrders: 19, totalSpent: 890.75, joinedAt: "2023-11-20",
    lastActive: "4 hours ago", avatarInitials: "AJ",
  },
];

const roleBadgeStyles: Record<string, string> = {
  customer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  owner: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  admin: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  const filtered = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openEditRole = (user: UserData) => {
    setEditingUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const saveRole = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, role: newRole as UserData["role"] }
            : u
        )
      );
    }
    setEditDialogOpen(false);
  };

  const roleCounts = {
    all: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    owner: users.filter((u) => u.role === "owner").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

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
                      {user.avatarInitials}
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
                        {user.totalOrders} orders
                      </p>
                      <p className="text-xs text-slate-400">
                        ${user.totalSpent.toFixed(2)} spent
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
                    {user.joinedAt}
                  </div>
                  <p className="text-xs text-slate-500">{user.lastActive}</p>
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

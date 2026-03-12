"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
  Copy,
  BarChart3,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Mock data ---

interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

const initialPromos: Promotion[] = [
  {
    id: "p-1",
    code: "WELCOME20",
    description: "20% off your first order",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 25,
    maxUses: 500,
    usedCount: 187,
    startsAt: "2024-01-01",
    expiresAt: "2024-12-31",
    isActive: true,
  },
  {
    id: "p-2",
    code: "PASTA10",
    description: "$10 off any pasta order over $30",
    discountType: "fixed",
    discountValue: 10,
    minOrder: 30,
    maxUses: 200,
    usedCount: 83,
    startsAt: "2024-03-01",
    expiresAt: "2024-04-30",
    isActive: true,
  },
  {
    id: "p-3",
    code: "FRIDAY15",
    description: "15% off Friday orders",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 20,
    maxUses: null,
    usedCount: 342,
    startsAt: "2024-01-01",
    expiresAt: "2024-06-30",
    isActive: true,
  },
  {
    id: "p-4",
    code: "SUMMER5",
    description: "$5 off summer special menu items",
    discountType: "fixed",
    discountValue: 5,
    minOrder: 15,
    maxUses: 1000,
    usedCount: 1000,
    startsAt: "2024-06-01",
    expiresAt: "2024-08-31",
    isActive: false,
  },
  {
    id: "p-5",
    code: "LOYALTY25",
    description: "25% off for returning customers",
    discountType: "percentage",
    discountValue: 25,
    minOrder: 40,
    maxUses: 100,
    usedCount: 12,
    startsAt: "2024-03-01",
    expiresAt: "2024-05-31",
    isActive: false,
  },
];

const emptyPromo: Omit<Promotion, "id"> = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  minOrder: 0,
  maxUses: null,
  usedCount: 0,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

export default function PromotionsPage() {
  const [promos, setPromos] = useState(initialPromos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState(emptyPromo);

  const activePromos = promos.filter((p) => p.isActive);
  const inactivePromos = promos.filter((p) => !p.isActive);
  const totalRedemptions = promos.reduce((sum, p) => sum + p.usedCount, 0);

  const openNew = () => {
    setEditingPromo(null);
    setFormData({ ...emptyPromo });
    setDialogOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrder: promo.minOrder,
      maxUses: promo.maxUses,
      usedCount: promo.usedCount,
      startsAt: promo.startsAt,
      expiresAt: promo.expiresAt,
      isActive: promo.isActive,
    });
    setDialogOpen(true);
  };

  const savePromo = () => {
    if (editingPromo) {
      setPromos((prev) =>
        prev.map((p) =>
          p.id === editingPromo.id ? { ...p, ...formData } : p
        )
      );
    } else {
      setPromos((prev) => [
        ...prev,
        { id: `p-${Date.now()}`, ...formData },
      ]);
    }
    setDialogOpen(false);
  };

  const toggleActive = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">
            Create and manage discount codes for your customers.
          </p>
        </div>
        <Button className="gap-2 self-start" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activePromos.length}</p>
                <p className="text-xs text-muted-foreground">Active Promos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRedemptions}</p>
                <p className="text-xs text-muted-foreground">Total Redemptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">$4,280</p>
                <p className="text-xs text-muted-foreground">Total Discounts Given</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promo list */}
      <div className="space-y-3">
        {promos.map((promo) => {
          const usagePercent =
            promo.maxUses !== null
              ? Math.min(100, (promo.usedCount / promo.maxUses) * 100)
              : null;
          const isExpired = new Date(promo.expiresAt) < new Date();
          const isMaxedOut = promo.maxUses !== null && promo.usedCount >= promo.maxUses;

          return (
            <Card
              key={promo.id}
              className={!promo.isActive ? "opacity-60" : ""}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Promo info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <button
                        onClick={() => copyCode(promo.code)}
                        className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-mono text-sm font-bold transition-colors hover:bg-muted/80"
                        title="Copy code"
                      >
                        {promo.code}
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                      {promo.isActive && !isExpired && !isMaxedOut && (
                        <Badge variant="success">Active</Badge>
                      )}
                      {isExpired && (
                        <Badge variant="secondary">Expired</Badge>
                      )}
                      {isMaxedOut && (
                        <Badge variant="warning">Max Uses Reached</Badge>
                      )}
                      {!promo.isActive && !isExpired && !isMaxedOut && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {promo.discountType === "percentage"
                          ? `${promo.discountValue}% off`
                          : `$${promo.discountValue} off`}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {promo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {promo.startsAt} &mdash; {promo.expiresAt}
                      </span>
                      {promo.minOrder > 0 && (
                        <span>Min order: ${promo.minOrder}</span>
                      )}
                    </div>
                  </div>

                  {/* Usage stats */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center min-w-[80px]">
                      <p className="text-lg font-bold">{promo.usedCount}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {promo.maxUses !== null
                          ? `of ${promo.maxUses} uses`
                          : "uses (unlimited)"}
                      </p>
                      {usagePercent !== null && (
                        <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePercent >= 90
                                ? "bg-red-500"
                                : usagePercent >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={() => toggleActive(promo.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(promo)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deletePromo(promo.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promotion" : "Create Promotion"}
            </DialogTitle>
            <DialogDescription>
              {editingPromo
                ? "Update this promotion's details."
                : "Set up a new discount code for your customers."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo-code">Promo Code</Label>
                <Input
                  id="promo-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., SAVE20"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(v: "percentage" | "fixed") =>
                    setFormData({ ...formData, discountType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promo-desc">Description</Label>
              <Textarea
                id="promo-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what this promotion does..."
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="promo-value">
                  Discount Value{" "}
                  {formData.discountType === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="promo-value"
                  type="number"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  value={formData.discountValue || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-min">Min Order ($)</Label>
                <Input
                  id="promo-min"
                  type="number"
                  step="0.01"
                  value={formData.minOrder || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrder: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-max">Max Uses</Label>
                <Input
                  id="promo-max"
                  type="number"
                  value={formData.maxUses ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUses: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="promo-start">Start Date</Label>
                <Input
                  id="promo-start"
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startsAt: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-end">Expiry Date</Label>
                <Input
                  id="promo-end"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Active</Label>
                <p className="text-xs text-muted-foreground">
                  Enable this promotion immediately
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, isActive: v })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePromo}>
              {editingPromo ? "Save Changes" : "Create Promotion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

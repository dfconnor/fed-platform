"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Flame,
  Leaf,
  Wheat,
  Star,
  MoreHorizontal,
  FolderPlus,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMenu } from "@/lib/hooks/use-menu";
import { useDashboard } from "@/lib/demo-context";
import { EMPTY_MENU_ITEM } from "@/lib/constants";
import type { MenuItem, Category } from "@/lib/hooks/use-restaurant";

export default function MenuPage() {
  const { slug, restaurantId } = useDashboard();
  const {
    categories,
    isLoading,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createCategory,
    mutate,
  } = useMenu(slug);

  // Flatten categories into a flat items array for filtering
  const items = categories.flatMap((c) =>
    (c.items ?? []).map((item) => ({ ...item, categoryId: c.id }))
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(MenuItem & { categoryId: string }) | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_MENU_ITEM & { modifierGroups?: any[] }>(
    { ...EMPTY_MENU_ITEM, modifierGroups: [] }
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Expand all categories by default once loaded
  if (categories.length > 0 && expandedCategories.size === 0) {
    const allIds = new Set(categories.map((c) => c.id));
    if (allIds.size > 0) {
      setExpandedCategories(allIds);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === null || item.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const toggleItemSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const openEditDialog = (item: MenuItem & { categoryId: string }) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      imageUrl: item.imageUrl ?? "",
      categoryId: item.categoryId,
      isActive: item.isActive,
      isPopular: item.isPopular,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isSpicy: item.isSpicy,
      calories: item.calories,
      modifierGroups: item.modifierGroups ?? [],
    });
    setItemDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingItem(null);
    setFormData({
      ...EMPTY_MENU_ITEM,
      categoryId: activeCategory || categories[0]?.id || "",
      modifierGroups: [],
    });
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    const { modifierGroups, ...itemData } = formData;
    if (editingItem) {
      await updateMenuItem(editingItem.id, itemData);
    } else {
      await createMenuItem(itemData);
    }
    setItemDialogOpen(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteMenuItem(itemId);
  };

  const toggleItemActive = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      await updateMenuItem(itemId, { isActive: !item.isActive });
    }
  };

  const bulkToggleActive = async (active: boolean) => {
    const promises = Array.from(selectedItems).map((id) =>
      updateMenuItem(id, { isActive: active })
    );
    await Promise.all(promises);
    setSelectedItems(new Set());
  };

  const handleCreateCategory = async () => {
    await createCategory({
      name: newCategoryName,
      description: newCategoryDescription,
      restaurantId,
    });
    setNewCategoryName("");
    setNewCategoryDescription("");
    setCategoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu</h1>
          <p className="text-muted-foreground">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>
                  Create a new menu category to organize your items.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Appetizers"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Input
                    id="cat-desc"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="e.g., Start your meal right"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="gap-2" onClick={openNewDialog}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Search + Bulk actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={activeCategory || "all"}
            onValueChange={(v) => setActiveCategory(v === "all" ? null : v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedItems.size} selected</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkToggleActive(true)}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkToggleActive(false)}
              >
                Deactivate
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Menu categories + items */}
      <div className="space-y-4">
        {categories
          .filter(
            (cat) => activeCategory === null || cat.id === activeCategory
          )
          .map((category) => {
            const categoryItems = filteredItems.filter(
              (i) => i.categoryId === category.id
            );
            const isExpanded = expandedCategories.has(category.id);

            if (categoryItems.length === 0 && search !== "") return null;

            return (
              <Card key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div>
                      <h3 className="text-sm font-semibold">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description} &middot; {categoryItems.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {categoryItems.filter((i) => i.isActive).length} active
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="border-t p-0">
                    {categoryItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No items in this category yet
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={openNewDialog}
                          className="mt-1"
                        >
                          Add first item
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 ${
                              !item.isActive ? "opacity-50" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItemSelect(item.id)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">
                                  {item.name}
                                </p>
                                {item.isPopular && (
                                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                                )}
                                <div className="flex items-center gap-1 shrink-0">
                                  {item.isVegetarian && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-[8px] font-bold text-green-700">
                                      V
                                    </span>
                                  )}
                                  {item.isVegan && (
                                    <Leaf className="h-3.5 w-3.5 text-green-600" />
                                  )}
                                  {item.isGlutenFree && (
                                    <Wheat className="h-3.5 w-3.5 text-amber-500" />
                                  )}
                                  {item.isSpicy && (
                                    <Flame className="h-3.5 w-3.5 text-red-500" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </p>
                              {(item.modifierGroups?.length ?? 0) > 0 && (
                                <p className="text-[10px] text-muted-foreground">
                                  {item.modifierGroups.length} modifier group(s)
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-bold">
                                ${item.price.toFixed(2)}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleItemActive(item.id)}>
                                    {item.isActive ? (
                                      <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details for this menu item."
                : "Fill in the details to create a new menu item."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price ($)</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-desc">Description</Label>
              <Textarea
                id="item-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the dish..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, categoryId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-image">Image URL</Label>
                <Input
                  id="item-image"
                  value={formData.imageUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Dietary flags */}
            <div>
              <Label className="mb-3 block">Dietary Information</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { key: "isVegetarian" as const, label: "Vegetarian", icon: Leaf },
                  { key: "isVegan" as const, label: "Vegan", icon: Leaf },
                  { key: "isGlutenFree" as const, label: "Gluten Free", icon: Wheat },
                  { key: "isSpicy" as const, label: "Spicy", icon: Flame },
                ].map(({ key, label, icon: Icon }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Popular Item</Label>
                  <p className="text-xs text-muted-foreground">
                    Show a star badge and promote in listings
                  </p>
                </div>
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isPopular: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this item visible on the menu
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

            {/* Modifier groups */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Modifier Groups</Label>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-3 w-3" />
                  Add Group
                </Button>
              </div>
              {(formData.modifierGroups ?? []).length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No modifier groups yet. Add one for sizes, toppings, etc.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.modifierGroups ?? []).map((mg: any) => (
                    <div key={mg.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{mg.name}</span>
                          {mg.required && (
                            <Badge variant="secondary" className="text-[10px]">
                              Required
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {(mg.modifiers ?? []).map((m: any) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between text-xs text-muted-foreground"
                          >
                            <span>{m.name}</span>
                            <span>
                              {(m.priceAdjustment ?? m.price ?? 0) > 0
                                ? `+$${(m.priceAdjustment ?? m.price ?? 0).toFixed(2)}`
                                : "Included"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItem}>
              {editingItem ? "Save Changes" : "Create Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

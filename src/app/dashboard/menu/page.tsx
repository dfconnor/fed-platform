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

// --- Mock data ---

interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  modifiers: { id: string; name: string; price: number }[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  isActive: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  sortOrder: number;
  modifierGroups: ModifierGroup[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

const initialCategories: Category[] = [
  { id: "cat-1", name: "Appetizers", description: "Start your meal right", sortOrder: 0, isActive: true },
  { id: "cat-2", name: "Pizza", description: "Wood-fired Neapolitan style", sortOrder: 1, isActive: true },
  { id: "cat-3", name: "Pasta", description: "Handmade daily", sortOrder: 2, isActive: true },
  { id: "cat-4", name: "Main Courses", description: "Chef's signature dishes", sortOrder: 3, isActive: true },
  { id: "cat-5", name: "Desserts", description: "Sweet endings", sortOrder: 4, isActive: true },
  { id: "cat-6", name: "Beverages", description: "Drinks and cocktails", sortOrder: 5, isActive: true },
];

const initialItems: MenuItem[] = [
  {
    id: "item-1", name: "Bruschetta", description: "Toasted bread topped with fresh tomatoes, basil, and garlic", price: 11.0,
    categoryId: "cat-1", isActive: true, isPopular: true, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: false, sortOrder: 0,
    modifierGroups: [],
  },
  {
    id: "item-2", name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze", price: 13.0,
    categoryId: "cat-1", isActive: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false, sortOrder: 1,
    modifierGroups: [],
  },
  {
    id: "item-3", name: "Calamari Fritti", description: "Crispy fried calamari with marinara sauce", price: 14.0,
    categoryId: "cat-1", isActive: true, isPopular: false, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 2,
    modifierGroups: [],
  },
  {
    id: "item-4", name: "Margherita Pizza", description: "San Marzano tomatoes, fresh mozzarella, basil, and olive oil", price: 17.0,
    categoryId: "cat-2", isActive: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 0,
    modifierGroups: [
      { id: "mg-1", name: "Size", required: true, modifiers: [
        { id: "m-1", name: "Regular 12\"", price: 0 },
        { id: "m-2", name: "Large 16\"", price: 4 },
      ]},
      { id: "mg-2", name: "Extra Toppings", required: false, modifiers: [
        { id: "m-3", name: "Extra Cheese", price: 2 },
        { id: "m-4", name: "Mushrooms", price: 1.5 },
        { id: "m-5", name: "Olives", price: 1.5 },
      ]},
    ],
  },
  {
    id: "item-5", name: "Pepperoni Pizza", description: "Classic pepperoni with mozzarella and tomato sauce", price: 19.0,
    categoryId: "cat-2", isActive: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 1,
    modifierGroups: [],
  },
  {
    id: "item-6", name: "Four Cheese Pizza", description: "Mozzarella, gorgonzola, parmesan, and fontina", price: 20.0,
    categoryId: "cat-2", isActive: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 2,
    modifierGroups: [],
  },
  {
    id: "item-7", name: "Spaghetti Carbonara", description: "Pancetta, egg yolk, pecorino romano, and black pepper", price: 18.0,
    categoryId: "cat-3", isActive: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 0,
    modifierGroups: [],
  },
  {
    id: "item-8", name: "Penne Arrabbiata", description: "Spicy tomato sauce with garlic and red chili flakes", price: 16.0,
    categoryId: "cat-3", isActive: true, isPopular: false, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: true, sortOrder: 1,
    modifierGroups: [],
  },
  {
    id: "item-9", name: "Risotto ai Funghi", description: "Arborio rice with wild mushrooms, truffle oil, and parmesan", price: 22.0,
    categoryId: "cat-4", isActive: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false, sortOrder: 0,
    modifierGroups: [],
  },
  {
    id: "item-10", name: "Tiramisu", description: "Classic Italian dessert with mascarpone, espresso, and cocoa", price: 9.0,
    categoryId: "cat-5", isActive: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 0,
    modifierGroups: [],
  },
  {
    id: "item-11", name: "Gelato (3 scoops)", description: "Choose from our daily selection of house-made flavors", price: 8.0,
    categoryId: "cat-5", isActive: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false, sortOrder: 1,
    modifierGroups: [],
  },
  {
    id: "item-12", name: "Espresso", description: "Double shot, Italian-roasted", price: 3.5,
    categoryId: "cat-6", isActive: true, isPopular: false, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false, sortOrder: 0,
    modifierGroups: [],
  },
  {
    id: "item-13", name: "House Red Wine", description: "Glass of Chianti Classico DOCG", price: 12.0,
    categoryId: "cat-6", isActive: false, isPopular: false, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false, sortOrder: 1,
    modifierGroups: [],
  },
];

const emptyItem: Omit<MenuItem, "id"> = {
  name: "", description: "", price: 0, categoryId: "", isActive: true, isPopular: false,
  isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false, sortOrder: 0, modifierGroups: [],
};

export default function MenuPage() {
  const [categories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(initialCategories.map((c) => c.id))
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(emptyItem);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
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

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name, description: item.description, price: item.price,
      imageUrl: item.imageUrl, categoryId: item.categoryId, isActive: item.isActive,
      isPopular: item.isPopular, isVegetarian: item.isVegetarian, isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree, isSpicy: item.isSpicy, sortOrder: item.sortOrder,
      modifierGroups: item.modifierGroups,
    });
    setItemDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingItem(null);
    setFormData({ ...emptyItem, categoryId: activeCategory || categories[0]?.id || "" });
    setItemDialogOpen(true);
  };

  const saveItem = () => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, ...formData } : i))
      );
    } else {
      const newId = `item-${Date.now()}`;
      setItems((prev) => [...prev, { id: newId, ...formData }]);
    }
    setItemDialogOpen(false);
  };

  const deleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const toggleItemActive = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isActive: !i.isActive } : i))
    );
  };

  const bulkToggleActive = (active: boolean) => {
    setItems((prev) =>
      prev.map((i) => (selectedItems.has(i.id) ? { ...i, isActive: active } : i))
    );
    setSelectedItems(new Set());
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
                <Button onClick={() => setCategoryDialogOpen(false)}>
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
                              {item.modifierGroups.length > 0 && (
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
                                    onClick={() => deleteItem(item.id)}
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
              {formData.modifierGroups.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No modifier groups yet. Add one for sizes, toppings, etc.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.modifierGroups.map((mg) => (
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
                        {mg.modifiers.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between text-xs text-muted-foreground"
                          >
                            <span>{m.name}</span>
                            <span>
                              {m.price > 0 ? `+$${m.price.toFixed(2)}` : "Included"}
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

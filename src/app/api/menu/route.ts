import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { menuPostSchema, menuPatchSchema } from "@/lib/validations";
import { requireRestaurantOwner } from "@/lib/api-auth";

// Create menu category, item, or modifier group
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = menuPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.type === "category") {
      const { restaurantId, name, description, imageUrl, sortOrder } = data;

      const authResult = await requireRestaurantOwner(restaurantId);
      if (authResult.error) return authResult.error;

      const category = await prisma.menuCategory.create({
        data: {
          restaurantId,
          name,
          description,
          imageUrl,
          sortOrder: sortOrder || 0,
        },
      });

      return NextResponse.json({ category }, { status: 201 });
    }

    if (data.type === "item") {
      // Verify ownership via the category's restaurant
      const category = await prisma.menuCategory.findUnique({
        where: { id: data.categoryId },
        select: { restaurantId: true },
      });
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      const authResult = await requireRestaurantOwner(category.restaurantId);
      if (authResult.error) return authResult.error;

      const {
        categoryId,
        name,
        description,
        price,
        imageUrl,
        sortOrder,
        isPopular,
        isVegetarian,
        isVegan,
        isGlutenFree,
        isSpicy,
        calories,
      } = data;

      const item = await prisma.menuItem.create({
        data: {
          categoryId,
          name,
          description,
          price,
          imageUrl,
          sortOrder: sortOrder || 0,
          isPopular: isPopular || false,
          isVegetarian: isVegetarian || false,
          isVegan: isVegan || false,
          isGlutenFree: isGlutenFree || false,
          isSpicy: isSpicy || false,
          calories: calories ?? null,
        },
      });

      return NextResponse.json({ item }, { status: 201 });
    }

    if (data.type === "modifier_group") {
      // Verify ownership via the item's category's restaurant
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: data.menuItemId },
        include: { category: { select: { restaurantId: true } } },
      });
      if (!menuItem) {
        return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
      }
      const authResult = await requireRestaurantOwner(menuItem.category.restaurantId);
      if (authResult.error) return authResult.error;

      const { menuItemId, name, required, minSelect, maxSelect, modifiers } = data;

      const group = await prisma.modifierGroup.create({
        data: {
          menuItemId,
          name,
          required: required || false,
          minSelect: minSelect || 0,
          maxSelect: maxSelect || 1,
          modifiers: modifiers
            ? {
                create: modifiers.map(
                  (
                    m: { name: string; priceAdjustment?: number; isDefault?: boolean },
                    i: number
                  ) => ({
                    name: m.name,
                    priceAdjustment: m.priceAdjustment || 0,
                    isDefault: m.isDefault || false,
                    sortOrder: i,
                  })
                ),
              }
            : undefined,
        },
        include: { modifiers: true },
      });

      return NextResponse.json({ modifierGroup: group }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = menuPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, id, ...data } = parsed.data;

    if (type === "category") {
      // Verify ownership
      const cat = await prisma.menuCategory.findUnique({
        where: { id },
        select: { restaurantId: true },
      });
      if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
      const authResult = await requireRestaurantOwner(cat.restaurantId);
      if (authResult.error) return authResult.error;

      const category = await prisma.menuCategory.update({
        where: { id },
        data,
      });
      return NextResponse.json({ category });
    }

    if (type === "item") {
      // Verify ownership
      const menuItem = await prisma.menuItem.findUnique({
        where: { id },
        include: { category: { select: { restaurantId: true } } },
      });
      if (!menuItem) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      const authResult = await requireRestaurantOwner(menuItem.category.restaurantId);
      if (authResult.error) return authResult.error;

      const item = await prisma.menuItem.update({
        where: { id },
        data,
      });
      return NextResponse.json({ item });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { error: "Failed to update menu" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 }
      );
    }

    // Verify ownership before deleting
    if (type === "category") {
      const cat = await prisma.menuCategory.findUnique({
        where: { id },
        select: { restaurantId: true },
      });
      if (!cat) return NextResponse.json({ error: "Category not found" }, { status: 404 });
      const authResult = await requireRestaurantOwner(cat.restaurantId);
      if (authResult.error) return authResult.error;

      await prisma.menuCategory.delete({ where: { id } });
    } else if (type === "item") {
      const item = await prisma.menuItem.findUnique({
        where: { id },
        include: { category: { select: { restaurantId: true } } },
      });
      if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      const authResult = await requireRestaurantOwner(item.category.restaurantId);
      if (authResult.error) return authResult.error;

      await prisma.menuItem.delete({ where: { id } });
    } else if (type === "modifier_group") {
      const group = await prisma.modifierGroup.findUnique({
        where: { id },
        include: { menuItem: { include: { category: { select: { restaurantId: true } } } } },
      });
      if (!group) return NextResponse.json({ error: "Modifier group not found" }, { status: 404 });
      const authResult = await requireRestaurantOwner(group.menuItem.category.restaurantId);
      if (authResult.error) return authResult.error;

      await prisma.modifierGroup.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}

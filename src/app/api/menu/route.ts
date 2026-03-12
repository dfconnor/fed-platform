import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Create or update menu category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === "category") {
      const { restaurantId, name, description, imageUrl, sortOrder } = body;

      if (!restaurantId || !name) {
        return NextResponse.json(
          { error: "Restaurant ID and name are required" },
          { status: 400 }
        );
      }

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

    if (type === "item") {
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
      } = body;

      if (!categoryId || !name || price === undefined) {
        return NextResponse.json(
          { error: "Category ID, name, and price are required" },
          { status: 400 }
        );
      }

      const item = await prisma.menuItem.create({
        data: {
          categoryId,
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          sortOrder: sortOrder || 0,
          isPopular: isPopular || false,
          isVegetarian: isVegetarian || false,
          isVegan: isVegan || false,
          isGlutenFree: isGlutenFree || false,
          isSpicy: isSpicy || false,
          calories: calories ? parseInt(calories) : null,
        },
      });

      return NextResponse.json({ item }, { status: 201 });
    }

    if (type === "modifier_group") {
      const { menuItemId, name, required, minSelect, maxSelect, modifiers } = body;

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
    const { type, id, ...data } = body;

    if (type === "category") {
      const category = await prisma.menuCategory.update({
        where: { id },
        data,
      });
      return NextResponse.json({ category });
    }

    if (type === "item") {
      if (data.price) data.price = parseFloat(data.price);
      if (data.calories) data.calories = parseInt(data.calories);

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

    if (type === "category") {
      await prisma.menuCategory.delete({ where: { id } });
    } else if (type === "item") {
      await prisma.menuItem.delete({ where: { id } });
    } else if (type === "modifier_group") {
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

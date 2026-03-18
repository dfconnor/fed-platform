"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { hash } from "bcryptjs";
import { generateOrderNumber, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// ============================================
// Types
// ============================================

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// Auth Actions
// ============================================

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  role?: "customer" | "owner";
}): Promise<ActionResult> {
  try {
    const { name, email, password, role = "customer" } = formData;

    if (!email || !password || !name) {
      return { success: false, error: "Name, email, and password are required" };
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
      },
    });

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("registerUser error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

// ============================================
// Restaurant Actions
// ============================================

export async function createRestaurant(formData: {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "owner" && role !== "admin") {
      return { success: false, error: "Only owners and admins can create restaurants" };
    }

    if (!formData.name || formData.name.trim().length === 0) {
      return { success: false, error: "Restaurant name is required" };
    }

    const slug = slugify(formData.name);

    // Check for duplicate slug
    const existing = await prisma.restaurant.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A restaurant with a similar name already exists" };
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: session.user.id,
        name: formData.name.trim(),
        slug,
        description: formData.description?.trim(),
        phone: formData.phone?.trim(),
        email: formData.email?.trim(),
        website: formData.website?.trim(),
        addressLine1: formData.addressLine1?.trim(),
        addressLine2: formData.addressLine2?.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim(),
        zip: formData.zip?.trim(),
        primaryColor: formData.primaryColor || "#E63946",
        secondaryColor: formData.secondaryColor || "#1D3557",
        accentColor: formData.accentColor || "#F4A261",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: restaurant };
  } catch (error) {
    console.error("createRestaurant error:", error);
    return { success: false, error: "Failed to create restaurant" };
  }
}

export async function updateRestaurant(
  restaurantId: string,
  formData: {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zip?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    isActive?: boolean;
    acceptsOrders?: boolean;
    taxRate?: number;
    serviceFee?: number;
    minOrderAmount?: number;
    estimatedPrepTime?: number;
    businessHours?: string;
  }
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "You don't have permission to update this restaurant" };
    }

    // If name is being changed, update slug too
    const updateData: Record<string, unknown> = { ...formData };
    if (formData.name && formData.name !== restaurant.name) {
      const newSlug = slugify(formData.name);
      const slugExists = await prisma.restaurant.findFirst({
        where: { slug: newSlug, id: { not: restaurantId } },
      });
      if (slugExists) {
        return { success: false, error: "A restaurant with a similar name already exists" };
      }
      updateData.slug = newSlug;
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${updated.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("updateRestaurant error:", error);
    return { success: false, error: "Failed to update restaurant" };
  }
}

// ============================================
// Menu Category Actions
// ============================================

export async function createMenuCategory(formData: {
  restaurantId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: formData.restaurantId },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    if (!formData.name || formData.name.trim().length === 0) {
      return { success: false, error: "Category name is required" };
    }

    // Auto-calculate sort order if not provided
    let sortOrder = formData.sortOrder;
    if (sortOrder === undefined) {
      const maxCategory = await prisma.menuCategory.findFirst({
        where: { restaurantId: formData.restaurantId },
        orderBy: { sortOrder: "desc" },
      });
      sortOrder = (maxCategory?.sortOrder ?? -1) + 1;
    }

    const category = await prisma.menuCategory.create({
      data: {
        restaurantId: formData.restaurantId,
        name: formData.name.trim(),
        description: formData.description?.trim(),
        imageUrl: formData.imageUrl,
        sortOrder,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${restaurant.slug}`);
    return { success: true, data: category };
  } catch (error) {
    console.error("createMenuCategory error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateMenuCategory(
  categoryId: string,
  formData: {
    name?: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
      include: { restaurant: true },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (category.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    const updated = await prisma.menuCategory.update({
      where: { id: categoryId },
      data: formData,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${category.restaurant.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("updateMenuCategory error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteMenuCategory(
  categoryId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
      include: { restaurant: true, items: true },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (category.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    // Cascade delete is handled by Prisma schema
    await prisma.menuCategory.delete({ where: { id: categoryId } });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${category.restaurant.slug}`);
    return { success: true, data: { deleted: categoryId } };
  } catch (error) {
    console.error("deleteMenuCategory error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// ============================================
// Menu Item Actions
// ============================================

export async function createMenuItem(formData: {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  sortOrder?: number;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  calories?: number;
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const category = await prisma.menuCategory.findUnique({
      where: { id: formData.categoryId },
      include: { restaurant: true },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (category.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    if (!formData.name || formData.name.trim().length === 0) {
      return { success: false, error: "Item name is required" };
    }

    if (formData.price < 0) {
      return { success: false, error: "Price must be a positive number" };
    }

    // Auto-calculate sort order
    let sortOrder = formData.sortOrder;
    if (sortOrder === undefined) {
      const maxItem = await prisma.menuItem.findFirst({
        where: { categoryId: formData.categoryId },
        orderBy: { sortOrder: "desc" },
      });
      sortOrder = (maxItem?.sortOrder ?? -1) + 1;
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId: formData.categoryId,
        name: formData.name.trim(),
        description: formData.description?.trim(),
        price: formData.price,
        imageUrl: formData.imageUrl,
        sortOrder,
        isPopular: formData.isPopular ?? false,
        isVegetarian: formData.isVegetarian ?? false,
        isVegan: formData.isVegan ?? false,
        isGlutenFree: formData.isGlutenFree ?? false,
        isSpicy: formData.isSpicy ?? false,
        calories: formData.calories,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${category.restaurant.slug}`);
    return { success: true, data: item };
  } catch (error) {
    console.error("createMenuItem error:", error);
    return { success: false, error: "Failed to create menu item" };
  }
}

export async function updateMenuItem(
  itemId: string,
  formData: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
    isPopular?: boolean;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
    calories?: number;
  }
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { restaurant: true } } },
    });

    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (item.category.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    if (formData.price !== undefined && formData.price < 0) {
      return { success: false, error: "Price must be a positive number" };
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: formData,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${item.category.restaurant.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("updateMenuItem error:", error);
    return { success: false, error: "Failed to update menu item" };
  }
}

export async function deleteMenuItem(itemId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: { include: { restaurant: true } } },
    });

    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (item.category.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    await prisma.menuItem.delete({ where: { id: itemId } });

    revalidatePath("/dashboard");
    revalidatePath(`/menu/${item.category.restaurant.slug}`);
    return { success: true, data: { deleted: itemId } };
  } catch (error) {
    console.error("deleteMenuItem error:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

// ============================================
// Order Actions
// ============================================

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
      "completed",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return { success: false, error: `Invalid status: ${status}` };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const role = (session.user as { role?: string }).role;
    if (order.restaurant.ownerId !== session.user.id && role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    const completedAt =
      status === "completed" || status === "delivered" ? new Date() : undefined;

    const paymentStatus =
      status === "cancelled"
        ? "refunded"
        : status === "confirmed"
          ? "paid"
          : undefined;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(completedAt && { completedAt }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: updated };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function createOrder(formData: {
  restaurantId: string;
  orderType: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
    modifiers?: Array<{
      modifierId: string;
      name: string;
      price: number;
    }>;
  }>;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  tableNumber?: string;
  addressId?: string;
  tipAmount?: number;
  paymentMethod?: string;
  promoCode?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: formData.restaurantId },
    });

    if (!restaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    if (!restaurant.isActive || !restaurant.acceptsOrders) {
      return { success: false, error: "This restaurant is not currently accepting orders" };
    }

    if (!formData.items || formData.items.length === 0) {
      return { success: false, error: "Order must contain at least one item" };
    }

    // Fetch menu item prices to calculate totals server-side
    const menuItemIds = formData.items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isActive: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      return { success: false, error: "One or more menu items are unavailable" };
    }

    const menuItemMap = new Map(menuItems.map((mi) => [mi.id, mi]));

    // Build order items with server-verified prices
    const orderItems = formData.items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItemId)!;
      const modifierTotal =
        item.modifiers?.reduce((sum, mod) => sum + mod.price, 0) ?? 0;
      const unitPrice = menuItem.price + modifierTotal;
      const totalPrice = unitPrice * item.quantity;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        notes: item.notes,
        modifiers: item.modifiers
          ? {
              create: item.modifiers.map((mod) => ({
                modifierId: mod.modifierId,
                name: mod.name,
                price: mod.price,
              })),
            }
          : undefined,
      };
    });

    let subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Server-side promo validation
    let discountAmount = 0;
    if (formData.promoCode) {
      const promo = await prisma.promotion.findFirst({
        where: {
          restaurantId: formData.restaurantId,
          code: formData.promoCode.toUpperCase(),
          isActive: true,
          startsAt: { lte: new Date() },
          expiresAt: { gte: new Date() },
        }
      });

      if (promo && subtotal >= promo.minOrder) {
        if (promo.maxUses === null || promo.usedCount < promo.maxUses) {
          discountAmount = promo.discountType === "percentage" 
            ? subtotal * (promo.discountValue / 100)
            : promo.discountValue;
            
          // Cap discount at subtotal
          discountAmount = Math.min(discountAmount, subtotal);
          // Note: usedCount increment happens inside the $transaction below
        }
      }
    }

    const taxAmount = Math.round((subtotal - discountAmount) * restaurant.taxRate * 100) / 100;
    const tipAmount = formData.tipAmount ?? 0;
    const total =
      Math.round(
        (subtotal - discountAmount + taxAmount + restaurant.serviceFee + tipAmount) * 100
      ) / 100;

    // Enforce minimum order
    if (subtotal < restaurant.minOrderAmount) {
      return {
        success: false,
        error: `Minimum order amount is $${restaurant.minOrderAmount.toFixed(2)}`,
      };
    }

    const estimatedReady = new Date(
      Date.now() + restaurant.estimatedPrepTime * 60 * 1000
    );

    const order = await prisma.$transaction(async (tx) => {
      // Re-fetch promo inside transaction if it exists to ensure usedCount is accurate
      if (formData.promoCode) {
        const promo = await tx.promotion.findFirst({
          where: {
            restaurantId: formData.restaurantId,
            code: formData.promoCode.toUpperCase(),
            isActive: true,
            startsAt: { lte: new Date() },
            expiresAt: { gte: new Date() },
          }
        });

        if (promo && subtotal >= promo.minOrder) {
          if (promo.maxUses === null || promo.usedCount < promo.maxUses) {
            // Re-calculate discount based on tx-level promo data
            discountAmount = promo.discountType === "percentage" 
              ? subtotal * (promo.discountValue / 100)
              : promo.discountValue;
            discountAmount = Math.min(discountAmount, subtotal);

            await tx.promotion.update({
              where: { id: promo.id },
              data: { usedCount: { increment: 1 } }
            });
          }
        }
      }

      // Recalculate totals with the tx-level discount
      const finalTaxAmount = Math.round((subtotal - discountAmount) * restaurant.taxRate * 100) / 100;
      const finalTotal = Math.round(
        (subtotal - discountAmount + finalTaxAmount + restaurant.serviceFee + tipAmount) * 100
      ) / 100;

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          restaurantId: formData.restaurantId,
          customerId: session?.user?.id ?? null,
          status: "pending",
          orderType: formData.orderType,
          tableNumber: formData.tableNumber,
          subtotal: Math.round(subtotal * 100) / 100,
          taxAmount: finalTaxAmount,
          serviceFee: restaurant.serviceFee,
          tipAmount,
          discountAmount: Math.round(discountAmount * 100) / 100,
          total: finalTotal,
          paymentMethod: formData.paymentMethod ?? "card",
          paymentStatus: "pending",
          customerName: formData.customerName ?? session?.user?.name ?? null,
          customerEmail: formData.customerEmail ?? session?.user?.email ?? null,
          customerPhone: formData.customerPhone ?? null,
          customerNotes: formData.customerNotes,
          addressId: formData.addressId ?? null,
          estimatedReady,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: { include: { modifiers: true } },
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true, data: order };
  } catch (error) {
    console.error("createOrder error:", error);
    return { success: false, error: "Failed to create order" };
  }
}

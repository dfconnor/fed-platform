import { z } from "zod";

// ---- Menu ----
export const createCategorySchema = z.object({
  type: z.literal("category"),
  restaurantId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const createItemSchema = z.object({
  type: z.literal("item"),
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  isPopular: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isActive: z.boolean().optional(),
  calories: z.coerce.number().int().nonnegative().nullable().optional(),
});

export const createModifierGroupSchema = z.object({
  type: z.literal("modifier_group"),
  menuItemId: z.string().min(1),
  name: z.string().min(1),
  required: z.boolean().optional(),
  minSelect: z.number().int().nonnegative().optional(),
  maxSelect: z.number().int().positive().optional(),
  modifiers: z
    .array(
      z.object({
        name: z.string().min(1),
        priceAdjustment: z.number().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .optional(),
});

export const menuPostSchema = z.discriminatedUnion("type", [
  createCategorySchema,
  createItemSchema,
  createModifierGroupSchema,
]);

export const menuPatchSchema = z.object({
  type: z.enum(["category", "item"]),
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  calories: z.coerce.number().int().nonnegative().nullable().optional(),
});

// ---- Orders ----
export const createOrderSchema = z.object({
  restaurantId: z.string().min(1),
  customerId: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive().default(1),
        notes: z.string().optional(),
        modifiers: z
          .array(
            z.object({
              modifierId: z.string().min(1),
            })
          )
          .optional(),
      })
    )
    .min(1),
  orderType: z.enum(["pickup", "delivery", "dine_in"]).default("pickup"),
  tableNumber: z.string().optional(),
  customerNotes: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  tipAmount: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.string().optional(),
  promoCode: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "delivered",
      "cancelled",
    ])
    .optional(),
  kitchenNotes: z.string().optional(),
  paymentStatus: z.string().optional(),
});

// ---- Promotions ----
export const createPromotionSchema = z.object({
  restaurantId: z.string().min(1),
  code: z.string().min(1).max(50),
  description: z.string().optional().default(""),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().positive(),
  minOrder: z.coerce.number().nonnegative().default(0),
  maxUses: z.coerce.number().int().positive().nullable().optional(),
  startsAt: z.string().min(1),
  expiresAt: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const updatePromotionSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.coerce.number().positive().optional(),
  minOrder: z.coerce.number().nonnegative().optional(),
  maxUses: z.coerce.number().int().positive().nullable().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ---- Restaurant ----
export const createRestaurantSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  ownerId: z.string().min(1),
  description: z.string().optional(),
  cuisine: z.string().optional(),
});

export const updateRestaurantSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  cuisine: z.string().optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  website: z.string().url().optional().or(z.literal("")).nullable(),
  logoUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  isActive: z.boolean().optional(),
  acceptsOrders: z.boolean().optional(),
  taxRate: z.coerce.number().min(0).max(1).optional(),
  serviceFee: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).optional(),
  estimatedPrepTime: z.coerce.number().int().positive().optional(),
  businessHours: z.string().optional(),
  stripeAccountId: z.string().optional().nullable(),
});

// ---- Admin ----
export const updateUserRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["customer", "owner", "admin"]),
});

export const updatePlatformSettingsSchema = z.object({
  platformName: z.string().min(1).max(100).optional(),
  platformFeePercent: z.coerce.number().min(0).max(100).optional(),
  supportEmail: z.string().email().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")).nullable(),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
  role: z.enum(["customer", "owner"]).default("customer"),
});

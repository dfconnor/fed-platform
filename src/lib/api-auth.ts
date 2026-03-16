import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type SessionUser = {
  id: string;
  role: string;
  email?: string | null;
  name?: string | null;
};

/**
 * Require an authenticated session. Returns the user or a 401 response.
 */
export async function requireAuth(): Promise<
  { user: SessionUser; error?: never } | { user?: never; error: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {
    user: {
      id: session.user.id,
      role: (session.user as { role?: string }).role ?? "customer",
      email: session.user.email,
      name: session.user.name,
    },
  };
}

/**
 * Require admin role. Returns the user or a 401/403 response.
 */
export async function requireAdmin(): Promise<
  { user: SessionUser; error?: never } | { user?: never; error: NextResponse }
> {
  const result = await requireAuth();
  if (result.error) return result;
  if (result.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return result;
}

/**
 * Require that the authenticated user owns the given restaurant.
 * Admins bypass the ownership check.
 */
export async function requireRestaurantOwner(
  restaurantId: string
): Promise<
  { user: SessionUser; error?: never } | { user?: never; error: NextResponse }
> {
  const result = await requireAuth();
  if (result.error) return result;

  if (result.user.role === "admin") return result;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { ownerId: true },
  });

  if (!restaurant) {
    return {
      error: NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      ),
    };
  }

  if (restaurant.ownerId !== result.user.id) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

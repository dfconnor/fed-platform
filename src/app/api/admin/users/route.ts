/**
 * /api/admin/users — Admin-level user management.
 *
 * GET   ?role=customer|owner|admin&search=  — list all users with stats
 * PATCH { id, role }                         — update a user's role
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateUserRoleSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";

// ---------------------------------------------------------------------------
// GET — List all users with aggregated stats
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) return authResult.error;

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (role && role !== "all") {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        orders: { select: { total: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to the shape the admin UI expects
    const result = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, o) => sum + o.total, 0);
      const initials = (u.name || u.email)
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        id: u.id,
        name: u.name || "Unknown",
        email: u.email,
        role: u.role,
        phone: u.phone || "",
        totalOrders: u._count.orders,
        totalSpent: Math.round(totalSpent * 100) / 100,
        joinedAt: u.createdAt.toISOString().split("T")[0],
        lastActive: formatLastActive(u.updatedAt),
        avatarInitials: initials,
      };
    });

    return NextResponse.json({ users: result });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update a user's role
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) return authResult.error;

    const body = await req.json();

    const parsed = updateUserRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, role } = parsed.data;

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format an updatedAt date into a human-readable "last active" string. */
function formatLastActive(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 5) return "Online now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toISOString().split("T")[0];
}

/**
 * /api/admin/settings — Platform-level settings (single-row config).
 *
 * GET   — fetch platform settings (id="default")
 * PATCH — update platform settings
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updatePlatformSettingsSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-auth";

// ---------------------------------------------------------------------------
// GET — Fetch the platform settings record
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) return authResult.error;

    // Always fetch (or create) the single "default" row
    let settings = await prisma.platformSettings.findUnique({
      where: { id: "default" },
    });

    // Auto-create with defaults if it doesn't exist yet
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          id: "default",
          platformName: "Fed",
          platformFeePercent: 2.5,
          supportEmail: "support@getfed.com",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform settings" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update platform settings
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult.error) return authResult.error;

    const body = await req.json();

    const parsed = updatePlatformSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { platformName, platformFeePercent, supportEmail, logoUrl } = parsed.data;

    const data: Record<string, unknown> = {};
    if (platformName !== undefined) data.platformName = platformName;
    if (platformFeePercent !== undefined) data.platformFeePercent = platformFeePercent;
    if (supportEmail !== undefined) data.supportEmail = supportEmail;
    if (logoUrl !== undefined) data.logoUrl = logoUrl;

    const settings = await prisma.platformSettings.update({
      where: { id: "default" },
      data,
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error updating platform settings:", error);
    return NextResponse.json(
      { error: "Failed to update platform settings" },
      { status: 500 }
    );
  }
}

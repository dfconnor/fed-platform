import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await registerUser(body);

    if (result.success) {
      return NextResponse.json({ user: result.data }, { status: 201 });
    } else {
      const status = result.error.includes("already exists") ? 409 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. Update in local DataStore
    const updated = DataStore.updateUserStatus(userId, "approved");

    // 2. Sync to Supabase if profile exists
    try {
      const admin = createAdminClient();
      await admin.from("profiles").update({ status: "approved" }).eq("id", userId);
    } catch {
      // Supabase is offline/mock
    }

    return NextResponse.json({
      success: true,
      message: `Successfully approved student ${updated.full_name}. Portal access clearance granted.`,
      user: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to approve user" },
      { status: 500 }
    );
  }
}

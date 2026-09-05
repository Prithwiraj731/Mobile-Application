import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Incomplete or unverified enrollment details.";

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updated = DataStore.updateUserStatus(userId, "rejected", reason);

    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ status: "rejected", rejection_reason: reason })
        .eq("id", userId);
    } catch {
      // Supabase is offline/mock
    }

    return NextResponse.json({
      success: true,
      message: `Registration marked as rejected for ${updated.full_name}.`,
      user: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to reject user" },
      { status: 500 }
    );
  }
}

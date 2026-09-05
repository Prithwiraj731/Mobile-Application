import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { status, planCode } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let user = DataStore.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (status) {
      user = DataStore.updateUserStatus(userId, status);
      try {
        const admin = createAdminClient();
        await admin.from("profiles").update({ status }).eq("id", userId);
      } catch {}
    }

    if (planCode) {
      user = DataStore.updateUserPlan(userId, planCode);
    }

    return NextResponse.json({
      success: true,
      message: `Account settings updated for ${user.full_name}.`,
      user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update account status" },
      { status: 500 }
    );
  }
}

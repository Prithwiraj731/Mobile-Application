import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const role = searchParams.get("role") || "all";
    const search = searchParams.get("search") || "";

    const users = DataStore.getUsers({
      status,
      role,
      search,
    });

    return NextResponse.json({
      success: true,
      users,
      totalCount: users.length,
      pendingCount: users.filter((u) => u.status === "pending_approval").length,
      approvedCount: users.filter((u) => u.status === "approved" && u.role === "student").length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}

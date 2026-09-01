import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    try {
      await supabase.auth.signOut();
    } catch {}

    const response = NextResponse.json({ success: true });
    response.cookies.delete("demo_user_session");
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


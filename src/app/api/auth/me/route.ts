import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DataStore, parseEnrollment } from "@/lib/data-store";

export async function GET() {
  try {
    // 1. Check demo_user_session cookie first
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    if (demoCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(demoCookie));
        const stored = (parsed.id ? DataStore.getUserById(parsed.id) : null) ||
                       (parsed.email ? DataStore.getUsers().find((u) => u.email === parsed.email) : null);
        const user = stored || parsed;
        const enrollment = parseEnrollment(user.address);
        user.program = user.program || enrollment.program;
        user.semester = user.semester || enrollment.semester;

        return NextResponse.json({
          authenticated: true,
          user,
          profile: user,
        });
      } catch {}
    }

    // 2. Fallback to Supabase Auth
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const enrollment = parseEnrollment((profile as any)?.address);
        const fullProfile = {
          ...(profile || {}),
          program: (profile as any)?.program || user.user_metadata?.program || enrollment.program,
          semester: (profile as any)?.semester || user.user_metadata?.semester || enrollment.semester,
        };

        return NextResponse.json({
          authenticated: true,
          user,
          profile: fullProfile,
        });
      }
    } catch {}

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

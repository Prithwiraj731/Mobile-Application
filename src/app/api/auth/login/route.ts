import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_USERS } from "@/lib/mock-data";
import { Profile } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      // Check mock users for seamless demo evaluation
      const mock = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.demoPassword === password
      );

      if (mock) {
        const response = NextResponse.json({
          success: true,
          user: { id: mock.id, email: mock.email, full_name: mock.full_name },
          role: mock.role,
          status: mock.status,
          planCode: mock.planCode,
        });

        // Set demo session cookie for middleware and server components
        response.cookies.set(
          "demo_user_session",
          JSON.stringify({
            id: mock.id,
            email: mock.email,
            full_name: mock.full_name,
            role: mock.role,
            status: mock.status,
            planCode: mock.planCode,
          }),
          {
            path: "/",
            httpOnly: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }
        );

        return response;
      }

      return NextResponse.json({ error: authError?.message || "Invalid credentials." }, { status: 401 });
    }

    const user = authData.user;

    // 2. Fetch Profile details
    const { data: profile } = (await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()) as { data: Profile | null };

    const role = profile?.role || "student";
    const status = profile?.status || "pending_approval";

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: profile?.full_name },
      role,
      status,
    });

    response.cookies.delete("demo_user_session");

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}

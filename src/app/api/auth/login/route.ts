import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check DataStore first (persistent local / cached accounts)
    const storedUser = DataStore.getUserByEmail(cleanEmail);

    if (storedUser) {
      // Validate password if user has demoPassword recorded
      if (storedUser.demoPassword && storedUser.demoPassword !== password) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      // Check account approval status
      if (storedUser.status === "pending_approval") {
        return NextResponse.json(
          {
            error:
              "Your account is pending admin approval. You will be able to log in once the faculty verifies and approves your registration.",
            status: "pending_approval",
          },
          { status: 403 }
        );
      }

      if (storedUser.status === "rejected") {
        return NextResponse.json(
          {
            error: "Your admission application was not approved by the faculty.",
            status: "rejected",
          },
          { status: 403 }
        );
      }

      if (storedUser.status === "suspended") {
        return NextResponse.json(
          {
            error: "Your student account has been suspended. Please contact tuition administration.",
            status: "suspended",
          },
          { status: 403 }
        );
      }

      // User is approved! Create session cookie
      const sessionPayload = {
        id: storedUser.id,
        email: storedUser.email,
        full_name: storedUser.full_name,
        role: storedUser.role,
        status: storedUser.status,
        planCode: storedUser.planCode || "FREE",
      };

      const response = NextResponse.json({
        success: true,
        user: { id: storedUser.id, email: storedUser.email, full_name: storedUser.full_name },
        role: storedUser.role,
        status: storedUser.status,
        planCode: storedUser.planCode || "FREE",
      });

      response.cookies.set("demo_user_session", JSON.stringify(sessionPayload), {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // 2. If not in local DataStore, try Supabase Auth
    try {
      const supabase = await createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!authError && authData?.user) {
        const user = authData.user;
        const { data: profile } = (await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()) as { data: Profile | null };

        const role = profile?.role || "student";
        const status = profile?.status || "pending_approval";

        if (status === "pending_approval" && role === "student") {
          return NextResponse.json(
            {
              error:
                "Your account is pending admin approval. You will be able to log in once faculty verifies and approves your registration.",
              status: "pending_approval",
            },
            { status: 403 }
          );
        }

        const sessionPayload = {
          id: user.id,
          email: user.email,
          full_name: profile?.full_name || user.email?.split("@")[0],
          role,
          status,
          planCode: "FREE",
        };

        const response = NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, full_name: profile?.full_name },
          role,
          status,
        });

        response.cookies.set("demo_user_session", JSON.stringify(sessionPayload), {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    } catch {
      // Supabase is offline or mock
    }

    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed." }, { status: 500 });
  }
}

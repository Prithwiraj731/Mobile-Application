import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";
import { Profile } from "@/types";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Immediate bypass for static files, Next.js internal chunks, icons, and media
  if (
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    path === "/manifest.json" ||
    path.startsWith("/api/") ||
    path.startsWith("/uploads/") ||
    path.includes(".")
  ) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-securelearn-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // 2. Authenticate user from Supabase Auth or demo session
  let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    user = null;
  }

  // Check for demo user session if real Supabase user is not found
  const demoCookie = request.cookies.get("demo_user_session")?.value;
  let demoUser: any = null;
  if (!user && demoCookie) {
    try {
      demoUser = JSON.parse(decodeURIComponent(demoCookie));
    } catch {
      demoUser = null;
    }
  }

  const effectiveUser = user || demoUser;

  const isPublicRoute =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/pending") ||
    path.startsWith("/api/auth");

  // 3. Unauthenticated users attempting to access protected student or admin paths
  if (!effectiveUser && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // 4. Authenticated user checks
  if (effectiveUser) {
    let role = demoUser?.role || "student";
    let status = demoUser?.status || "approved";

    if (user) {
      const { data: profile } = (await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()) as { data: Profile | null };

      role = profile?.role || "student";
      status = profile?.status || "pending_approval";
    }

    // Handle Pending / Suspended / Rejected accounts
    if (status !== "approved" && !path.startsWith("/pending") && !path.startsWith("/api/auth")) {
      const url = request.nextUrl.clone();
      url.pathname = "/pending";
      url.searchParams.set("status", status);
      return NextResponse.redirect(url);
    }

    // Role-based route gating
    if (path.startsWith("/admin") && role !== "admin" && role !== "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Redirect logged in users away from landing page and auth pages
    if ((path === "/" || path.startsWith("/login") || path.startsWith("/signup")) && status === "approved") {
      const url = request.nextUrl.clone();
      url.pathname = role === "admin" || role === "super_admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

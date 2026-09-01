import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phoneNumber, address } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const admin = createAdminClient();

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber || null,
          address: address || null,
          role: "student",
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;

    if (userId) {
      // 2. Ensure profile is saved with 'pending_approval'
      await admin.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        email,
        phone_number: phoneNumber || null,
        address: address || null,
        role: "student",
        status: "pending_approval",
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully. Awaiting administrative approval.",
      status: "pending_approval",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal registration error." },
      { status: 500 }
    );
  }
}

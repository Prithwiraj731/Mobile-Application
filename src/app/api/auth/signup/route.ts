import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword, phoneNumber, address, program, semester } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match. Please verify both fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Check if user exists in DataStore
    const existing = DataStore.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email is already registered." },
        { status: 409 }
      );
    }

    // 2. Register into DataStore with pending_approval
    const newUser = DataStore.createUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phoneNumber: phoneNumber?.trim(),
      address: address?.trim(),
      program: program?.trim(),
      semester: semester?.trim(),
      role: "student",
      status: "pending_approval",
    });

    // 3. Attempt Supabase Auth sync in background if configured
    try {
      const supabase = await createClient();
      const admin = createAdminClient();
      const { data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber || null,
            address: address || null,
            program: program || null,
            semester: semester || null,
            role: "student",
          },
        },
      });

      if (authData.user) {
        await admin.from("profiles").upsert({
          id: authData.user.id,
          full_name: fullName,
          email,
          phone_number: phoneNumber || null,
          address: address || null,
          role: "student",
          status: "pending_approval",
          updated_at: new Date().toISOString(),
        });
      }
    } catch {
      // Supabase is offline or mock, local persistence handles it cleanly
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        status: newUser.status,
      },
      message:
        "Thanks for registering! Your application has been submitted to the admin for review. Once approved, you will be able to log in to access all notes, audios, and study materials.",
      status: "pending_approval",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

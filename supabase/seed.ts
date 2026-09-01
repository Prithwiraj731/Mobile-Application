import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!serviceRoleKey) {
  console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Auth users cannot be seeded via Admin API.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  role: "admin" | "student" | "super_admin";
  status: "pending_approval" | "approved" | "rejected" | "suspended";
  planCode?: "FREE" | "PRO" | "PREMIUM";
}

const SEED_USERS: SeedUser[] = [
  {
    email: "admin@securelearn.io",
    password: "Admin@123456",
    fullName: "Chief Academic Administrator",
    phoneNumber: "+1 (555) 019-2834",
    address: "Central Security Bureau, Floor 4",
    role: "admin",
    status: "approved",
  },
  {
    email: "student.free@example.com",
    password: "Student@123",
    fullName: "Aarav Sharma (Free Student)",
    phoneNumber: "+1 (555) 234-5678",
    address: "42 Knowledge Park, Sector 12",
    role: "student",
    status: "approved",
    planCode: "FREE",
  },
  {
    email: "student.pro@example.com",
    password: "Student@123",
    fullName: "Elena Rostova (Pro Scholar)",
    phoneNumber: "+1 (555) 345-6789",
    address: "74 Cambridge Avenue, Apt 3B",
    role: "student",
    status: "approved",
    planCode: "PRO",
  },
  {
    email: "student.premium@example.com",
    password: "Student@123",
    fullName: "Dr. Vikram Sethi (Premium Master)",
    phoneNumber: "+1 (555) 456-7890",
    address: "88 Quantum Boulevard, Suite 500",
    role: "student",
    status: "approved",
    planCode: "PREMIUM",
  },
  {
    email: "pending.student@example.com",
    password: "Student@123",
    fullName: "Rohan Verma (Pending Approval)",
    phoneNumber: "+1 (555) 567-8901",
    address: "19 Greenfield Lane, Unit 12",
    role: "student",
    status: "pending_approval",
    planCode: "FREE",
  },
  {
    email: "suspended.student@example.com",
    password: "Student@123",
    fullName: "Malicious Actor (Suspended Account)",
    phoneNumber: "+1 (555) 999-0000",
    address: "Blocked Node IP 192.168.1.99",
    role: "student",
    status: "suspended",
    planCode: "FREE",
  },
];

async function seed() {
  console.log("🚀 Starting Supabase Database & Auth Seed...");

  for (const user of SEED_USERS) {
    console.log(`\nCreating/Verifying user: ${user.email} [${user.role} | ${user.status}]...`);

    // 1. Create or get user in Supabase Auth via Admin API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.fullName,
        phone_number: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
    });

    let userId = authUser?.user?.id;

    if (authError) {
      if (authError.message.includes("already exists") || authError.message.includes("unique")) {
        console.log(`User ${user.email} already exists in auth. Fetching user ID...`);
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users.find((u) => u.email === user.email);
        userId = existing?.id;
      } else {
        console.error(`Auth creation failed for ${user.email}:`, authError.message);
        continue;
      }
    }

    if (!userId) {
      console.error(`Could not resolve user ID for ${user.email}`);
      continue;
    }

    // 2. Upsert Profile
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: user.fullName,
        email: user.email,
        phone_number: user.phoneNumber,
        address: user.address,
        role: user.role,
        status: user.status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error(`Profile upsert error for ${user.email}:`, profileError.message);
    } else {
      console.log(`Profile synced for ${user.fullName} (${user.status})`);
    }

    // 3. Assign Plan if specified
    if (user.planCode) {
      const { data: plan } = await supabase
        .from("subscription_plans")
        .select("id, rank")
        .eq("code", user.planCode)
        .single();

      if (plan) {
        await supabase.from("student_subscriptions").upsert(
          {
            student_id: userId,
            plan_id: plan.id,
            status: "active",
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Seeded ${user.planCode} plan`,
          },
          { onConflict: "id" }
        );
        console.log(`Assigned ${user.planCode} plan (Rank ${plan.rank}) to ${user.email}`);
      }
    }

    // 4. Enroll in all published courses if student is approved
    if (user.role === "student" && user.status === "approved") {
      const { data: courses } = await supabase.from("courses").select("id").eq("is_published", true);
      if (courses && courses.length > 0) {
        for (const course of courses) {
          await supabase.from("student_course_enrollments").upsert(
            {
              student_id: userId,
              course_id: course.id,
              status: "active",
              enrolled_at: new Date().toISOString(),
            },
            { onConflict: "student_id,course_id" }
          );
        }
        console.log(`Enrolled ${user.email} into ${courses.length} core courses`);
      }
    }
  }

  console.log("\n✅ Supabase Seeding Complete!");
}

seed().catch((err) => {
  console.error("Seed execution failed:", err);
});

import * as React from "react";
import { cookies } from "next/headers";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentBottomNav } from "@/components/student/StudentBottomNav";
import { createClient } from "@/lib/supabase/server";
import { MOCK_USERS } from "@/lib/mock-data";
import { StudentSubscription, SubscriptionPlan } from "@/types";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  let planCode = "FREE";

  try {
    const supabase = await createClient();
    let user: any = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      user = null;
    }

    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      profile = prof;

      const { data: activeSub } = (await supabase
        .from("student_subscriptions")
        .select("*")
        .eq("student_id", user.id)
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())
        .order("starts_at", { ascending: false })
        .maybeSingle()) as { data: StudentSubscription | null };

      if (activeSub && activeSub.plan_id) {
        const { data: plan } = (await supabase
          .from("subscription_plans")
          .select("*")
          .eq("id", activeSub.plan_id)
          .maybeSingle()) as { data: SubscriptionPlan | null };
        if (plan && plan.code) {
          planCode = plan.code;
        }
      }
    } else {
      const cookieStore = cookies();
      const demoCookie = cookieStore.get("demo_user_session")?.value;
      if (demoCookie) {
        const demoUser = JSON.parse(decodeURIComponent(demoCookie));
        const matched = MOCK_USERS.find((u) => u.id === demoUser.id || u.email === demoUser.email);
        profile = matched || demoUser;
        planCode = profile?.planCode || "FREE";
      }
    }
  } catch {
    profile = MOCK_USERS[1]; // Aarav Sharma (Free Student)
    planCode = "FREE";
  }

  if (!profile) {
    profile = MOCK_USERS[1];
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col text-surface-100 antialiased">
      <StudentHeader profile={profile} planCode={planCode} />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-surface-950 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <StudentBottomNav profile={profile} planCode={planCode} />
    </div>
  );
}

import { cookies } from "next/headers";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { MOCK_USERS } from "@/lib/mock-data";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;

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
        .single();
      profile = prof;
    } else {
      const cookieStore = cookies();
      const demoCookie = cookieStore.get("demo_user_session")?.value;
      if (demoCookie) {
        const demoUser = JSON.parse(decodeURIComponent(demoCookie));
        profile = MOCK_USERS.find((u) => u.id === demoUser.id || u.email === demoUser.email) || demoUser;
      }
    }
  } catch {
    profile = MOCK_USERS[0];
  }

  if (!profile) {
    profile = MOCK_USERS[0];
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col text-surface-100 antialiased">
      <AdminHeader profile={profile} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-surface-950">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

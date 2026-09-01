import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";
import { MethodologySection } from "@/components/landing/MethodologySection";
import { ProgramsSection } from "@/components/landing/ProgramsSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default async function HomePage() {
  try {
    const supabase = await createClient();
    let user: any = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch {
      user = null;
    }

    // 1. Check Demo session cookie
    const cookieStore = cookies();
    const demoCookie = cookieStore.get("demo_user_session")?.value;
    let demoUser: any = null;
    if (demoCookie) {
      try {
        demoUser = JSON.parse(decodeURIComponent(demoCookie));
      } catch {
        demoUser = null;
      }
    }

    const effectiveUser = user || demoUser;

    // 2. If user is authenticated, route them according to their verified role & approval status
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

      if (status === "pending_approval") {
        redirect("/pending?status=pending");
      }

      if (status === "suspended" || status === "rejected") {
        redirect(`/pending?status=${status}`);
      }

      if (role === "admin" || role === "super_admin") {
        redirect("/admin");
      }

      if (status === "approved") {
        redirect("/dashboard");
      }
    }
  } catch (error) {
    // If it's a Next.js redirect exception, re-throw it so Next.js redirects properly
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    // Otherwise continue to render the public landing page
  }

  // 3. For unauthenticated visitors, render the complete Public Landing Page experience
  return (
    <div className="min-h-screen bg-[#110f10] text-surface-100 antialiased selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <WhyChooseSection />
        <MethodologySection />
        <ProgramsSection />
        <SecuritySection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

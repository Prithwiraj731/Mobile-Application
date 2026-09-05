"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Shield } from "lucide-react";
import { PlanBadge } from "./PlanBadge";
import { Profile } from "@/types";

export interface StudentHeaderProps {
  profile?: Profile | null;
  planCode?: string;
}

export function StudentHeader({ profile, planCode = "FREE" }: StudentHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  const displayName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 py-3 bg-[#0d0c0d]/90 backdrop-blur-xl border-b border-white/5">
      {/* Left: User Profile Avatar & Name (Matches Reference Screenshot) */}
      <Link href="/dashboard" className="flex items-center gap-3 group active:scale-95 transition-transform">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-md shadow-orange-500/20">
            <div className="h-full w-full rounded-full bg-[#181516] flex items-center justify-center text-sm font-bold text-white overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="font-extrabold text-amber-400">{displayName.charAt(0)}</span>
              )}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0d0c0d]" />
        </div>

        <div>
          <h2 className="font-bold text-sm text-white tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
            {profile?.full_name || "Enrolled Student"}
          </h2>
          <p className="text-[11px] text-surface-400 font-medium capitalize">
            {profile?.role === "admin" ? "Lead Instructor" : "Student"}
          </p>
        </div>
      </Link>

      {/* Right: Plan Clearance & Notification Bell (Matches Reference Screenshot) */}
      <div className="flex items-center gap-2.5">
        <Link href="/subscription" className="hover:opacity-90 active:scale-95 transition-transform">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
            <Shield className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>{(planCode || "FREE").toUpperCase()} TIER</span>
          </div>
        </Link>

        {/* Bell with Notification Badge Counter */}
        <div className="relative">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c191a] border border-white/10 text-surface-300 hover:text-white hover:border-white/20 active:scale-95 transition-all"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[9px] font-black flex items-center justify-center shadow-md shadow-orange-500/40">
            2
          </span>
        </div>

        {/* Sign out Button */}
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c191a] border border-white/10 text-surface-400 hover:text-rose-400 hover:border-rose-500/30 active:scale-95 transition-all"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

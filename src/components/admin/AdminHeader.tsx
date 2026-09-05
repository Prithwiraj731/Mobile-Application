"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut, Eye, GraduationCap } from "lucide-react";
import { Profile } from "@/types";

export interface AdminHeaderProps {
  profile?: Profile | null;
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-800 bg-surface-950 px-3 sm:px-6 backdrop-blur-md">
      {/* Brand & Administrative Tag */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-sm shadow-rose-600/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Pabir Paul&apos;s Tuition
              </span>
              <span className="rounded bg-rose-950/80 px-1.5 py-0.2 border border-rose-700/40 font-mono text-[9px] font-semibold text-rose-400">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-surface-400 font-mono hidden sm:block">
              Tuition Management & Security Desk
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-700/40 px-2.5 py-1 rounded-lg hover:bg-indigo-900/40 transition-colors active:scale-95"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Student View</span>
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-surface-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950 border border-rose-800 font-bold text-xs text-rose-300 uppercase">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white">
              {profile?.full_name || "Pabir Paul (Faculty Admin)"}
            </p>
            <p className="text-[10px] text-surface-400 font-mono">
              {profile?.email || "admin@debrajtuition.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:text-rose-400 hover:bg-surface-800 active:scale-95 transition-all"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

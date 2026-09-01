"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Bookmark, Bell, User, ShieldCheck } from "lucide-react";
import { Profile } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { PlanBadge } from "./PlanBadge";

export interface StudentBottomNavProps {
  profile?: Profile | null;
  planCode?: string;
}

export function StudentBottomNav({ profile, planCode = "FREE" }: StudentBottomNavProps) {
  const pathname = usePathname();
  const [isIdCardOpen, setIsIdCardOpen] = React.useState(false);

  const isHomeActive = pathname === "/dashboard" || pathname === "/";
  const isBatchesActive = pathname.startsWith("/courses");
  const isNotificationsActive = pathname.startsWith("/subscription");

  return (
    <>
      {/* Floating Pill Dock Navigation (Matches Reference Screenshot) */}
      <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Mobile Navigation Dock"
          className="pointer-events-auto flex items-center gap-1.5 pill-dock px-2.5 py-1.5 rounded-full shadow-2xl"
        >
          {/* Home Tab - Active White Pill */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all ${
              isHomeActive
                ? "bg-white text-black shadow-md shadow-white/20"
                : "text-surface-400 hover:text-white"
            }`}
          >
            <LayoutGrid className={`h-4 w-4 ${isHomeActive ? "text-black" : "text-surface-400"}`} />
            <span>Home</span>
          </Link>

          {/* Bookmark / Courses Tab */}
          <Link
            href="/courses"
            className={`flex items-center justify-center h-9 w-9 rounded-full transition-all ${
              isBatchesActive
                ? "bg-white/20 text-white"
                : "text-surface-400 hover:text-white hover:bg-white/5 active:scale-95"
            }`}
            title="Saved Batches & Notes"
          >
            <Bookmark className="h-4 w-4" />
          </Link>

          {/* Tuition Pass / Notifications Tab */}
          <Link
            href="/subscription"
            className={`flex items-center justify-center h-9 w-9 rounded-full transition-all ${
              isNotificationsActive
                ? "bg-white/20 text-white"
                : "text-surface-400 hover:text-white hover:bg-white/5 active:scale-95"
            }`}
            title="Tuition Clearance & Pass"
          >
            <Bell className="h-4 w-4" />
          </Link>

          {/* Student ID / Profile Tab */}
          <button
            onClick={() => setIsIdCardOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-full text-surface-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            title="Student Profile ID"
          >
            <User className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Mobile Digital Student ID Modal */}
      <Modal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        title="Official Student ID Pass"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="rounded-3xl p-5 bg-[#181516] border border-white/10 text-white shadow-xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold">
                  Official Student ID Pass
                </p>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Pabir Paul&apos;s Tuition (Commerce)
                </h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-[1.5px] shrink-0">
                <div className="h-full w-full rounded-2xl bg-[#181516] flex items-center justify-center text-lg font-bold text-amber-400">
                  {profile?.full_name?.charAt(0) || "A"}
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="text-sm font-bold text-white truncate">
                  {profile?.full_name || "Aarav Sharma"}
                </h4>
                <p className="text-xs text-surface-400 truncate font-mono">
                  {profile?.email || "student.free@example.com"}
                </p>
                <div className="pt-1">
                  <PlanBadge planCode={planCode} size="sm" />
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="rounded-2xl bg-[#0d0c0d] p-3.5 border border-white/5 font-mono text-[11px] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-surface-400">STUDENT ID:</span>
                <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                  {profile?.id ? profile.id.substring(0, 13).toUpperCase() : "PPT-BCOM-2026"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-400">ENROLLMENT:</span>
                <span className="text-emerald-400 font-bold">● ACTIVE CLEARANCE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-400">APP INTEGRITY:</span>
                <span className="text-orange-400">FLAG_SECURE ACTIVE</span>
              </div>
            </div>

            <p className="text-center text-[10px] text-surface-500 font-mono">
              PABIR PAUL&apos;S TUITION • B.COM / M.COM / CA / CMA
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}

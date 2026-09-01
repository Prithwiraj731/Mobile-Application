"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Crown, ShieldAlert, FileText, CheckCircle2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StudentSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Commerce Batches", href: "/courses", icon: BookOpen },
    { name: "Notes & Scanners", href: "/dashboard#materials", icon: FileText },
    { name: "Tuition Pass & Fees", href: "/subscription", icon: Crown },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0b0f19] p-4 hidden md:flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-surface-500 font-bold mb-2">
            PABIR PAUL&apos;S COMMERCE
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors select-none",
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/25"
                    : "text-surface-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-surface-500")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Tuition Notice Box */}
        <div className="rounded-xl border border-white/10 bg-[#111726] p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <GraduationCap className="h-4 w-4" />
            <span className="text-xs font-bold text-white">Faculty Announcement</span>
          </div>
          <p className="text-[11px] text-surface-300 leading-relaxed">
            New B.COM Sem 1-8 and CA/CMA scanner solutions & tax revision audio lectures uploaded.
          </p>
          <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
            <span>Pabir Paul Academic Desk</span>
          </div>
        </div>

        {/* Security Policy Badge Box */}
        <div className="rounded-xl border border-white/10 bg-[#111726] p-4 space-y-2">
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold">Protected Study Mode</span>
          </div>
          <p className="text-[11px] text-surface-400 leading-relaxed">
            All notes and scanners are stamped dynamically with your student ID. Leaks are audited server-side.
          </p>
          <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
            <CheckCircle2 className="h-3 w-3" />
            <span>Encrypted Private Storage</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-surface-500 font-mono text-center">
        Pabir Paul&apos;s Tuition v1.2 (Commerce)
      </div>
    </aside>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FolderTree,
  Crown,
  ScrollText,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Pending Approvals", href: "/admin/approvals", icon: UserCheck, badge: "1" },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Content Library", href: "/admin/content", icon: FolderTree },
    { name: "Subscription Plans", href: "/admin/subscriptions", icon: Crown },
    { name: "Security & Audit Logs", href: "/admin/logs", icon: ScrollText },
  ];

  return (
    <aside className="w-64 border-r border-surface-800 bg-surface-950/80 p-4 hidden md:flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-surface-500 font-semibold mb-2">
            ADMINISTRATION
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                  isActive
                    ? "bg-rose-600/10 text-rose-400 border border-rose-500/20 font-semibold"
                    : "text-surface-400 hover:bg-surface-900 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-rose-400" : "text-surface-500")} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Security Alert Monitor Widget */}
        <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-xs font-semibold">Security Engine</span>
          </div>
          <p className="text-[11px] text-surface-400 leading-relaxed">
            Private bucket <code className="text-surface-200">study-materials</code> locked. Signed preview tokens expiring at 120s.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-surface-800/60 text-[10px] font-mono text-surface-500 text-center">
        RLS & POLICY ENGINE: ACTIVE
      </div>
    </aside>
  );
}

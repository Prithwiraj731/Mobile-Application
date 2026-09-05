"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  Crown,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RefreshCw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StoredUser } from "@/lib/data-store";

export default function AdminOverviewPage() {
  const [users, setUsers] = React.useState<StoredUser[]>([]);
  const [materialsCount, setMaterialsCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, materialsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/materials?status=all"),
      ]);
      const usersData = await usersRes.json();
      const materialsData = await materialsRes.json();

      if (usersRes.ok && usersData.users) {
        setUsers(usersData.users);
      }
      if (materialsRes.ok && materialsData.materials) {
        setMaterialsCount(materialsData.materials.length);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleApproveStudent = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, { method: "POST" });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
        );
        setActionFeedback(`Approved "${userName}". Student can now log in.`);
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch {
      setActionFeedback("Failed to approve student.");
    }
  };

  const pendingUsers = users.filter((u) => u.status === "pending_approval");
  const approvedStudents = users.filter((u) => u.status === "approved" && u.role === "student");
  const suspendedUsers = users.filter((u) => u.status === "suspended");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              Faculty Command Desk
            </span>
            <span className="text-surface-600">•</span>
            <span className="text-[11px] font-mono text-emerald-400">Database Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Academic Administrative Overview
          </h1>
          <p className="text-xs sm:text-sm text-surface-400 mt-1">
            Live enrollment verification queue, study material repository, and student access desk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/approvals">
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-2 active:scale-95 transition-all">
              <UserCheck className="h-4 w-4" />
              <span>Review Approvals ({pendingUsers.length})</span>
            </button>
          </Link>
          <Link href="/admin/content">
            <button className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-xs font-semibold border border-surface-700 flex items-center gap-2 active:scale-95 transition-all">
              <FileText className="h-4 w-4" />
              <span>Upload Material</span>
            </button>
          </Link>
        </div>
      </div>

      {actionFeedback && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/approvals"
          className="rounded-xl border border-amber-800/40 bg-amber-950/10 p-5 hover:border-amber-700/60 transition-colors shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Pending Approval</span>
            <span className="p-2 rounded-lg bg-amber-950 border border-amber-800/60 text-amber-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{pendingUsers.length}</p>
          <span className="text-[11px] text-amber-300/80 mt-1 block">Awaiting admin review</span>
        </Link>

        <Link
          href="/admin/users"
          className="rounded-xl border border-surface-800 bg-surface-900/60 p-5 hover:border-surface-700 transition-colors shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-surface-400 font-semibold">Approved Students</span>
            <span className="p-2 rounded-lg bg-surface-950 border border-surface-800 text-emerald-400">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{approvedStudents.length}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Active enrolled scholars</span>
        </Link>

        <Link
          href="/admin/content"
          className="rounded-xl border border-surface-800 bg-surface-900/60 p-5 hover:border-surface-700 transition-colors shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-surface-400 font-semibold">Study Materials</span>
            <span className="p-2 rounded-lg bg-surface-950 border border-surface-800 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{materialsCount}</p>
          <span className="text-[11px] text-indigo-400 mt-1 block">PDFs, Audios, Notes</span>
        </Link>

        <Link
          href="/admin/users"
          className="rounded-xl border border-surface-800 bg-surface-900/60 p-5 hover:border-surface-700 transition-colors shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-surface-400 font-semibold">Suspended</span>
            <span className="p-2 rounded-lg bg-surface-950 border border-surface-800 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{suspendedUsers.length}</p>
          <span className="text-[11px] text-rose-400 mt-1 block">Restricted accounts</span>
        </Link>
      </div>

      {/* 3. Pending Approvals Direct Queue */}
      <div className="rounded-2xl border border-surface-800 bg-surface-900 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-surface-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-400" />
              <span>Newly Registered Students Awaiting Approval</span>
            </h2>
            <p className="text-xs text-surface-400 mt-0.5">
              Approve students so they can log in and access your uploaded study notes and audios.
            </p>
          </div>
          <Link
            href="/admin/approvals"
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-surface-400 space-y-1">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-1 opacity-80" />
            <p className="font-semibold text-white">Queue is clear</p>
            <p>No new student registrations awaiting approval.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800/60">
            {pendingUsers.slice(0, 5).map((u) => (
              <div
                key={u.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{u.full_name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 font-mono mt-0.5">
                    <span>{u.email}</span>
                    {u.phone_number && <span>• {u.phone_number}</span>}
                    {u.address && <span className="text-surface-300">• {u.address}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveStudent(u.id, u.full_name)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve Student</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

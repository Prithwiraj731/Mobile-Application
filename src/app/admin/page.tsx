"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  Crown,
  ShieldAlert,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { MOCK_USERS, MOCK_MATERIALS, MOCK_ACCESS_LOGS, MOCK_AUDIT_LOGS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminOverviewPage() {
  const pendingUsers = MOCK_USERS.filter((u) => u.status === "pending_approval");
  const approvedStudents = MOCK_USERS.filter((u) => u.status === "approved" && u.role === "student");
  const suspendedUsers = MOCK_USERS.filter((u) => u.status === "suspended");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              System Command Center
            </span>
            <span className="text-surface-600">•</span>
            <span className="text-[11px] font-mono text-emerald-400">Database & RLS Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Academic Administrative Overview
          </h1>
          <p className="text-xs sm:text-sm text-surface-400 mt-1">
            Real-time enrollment queues, study material authorizations, and active security audit feeds
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/approvals">
            <Button variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-500 text-xs">
              <UserCheck className="h-4 w-4 mr-1.5" />
              Review Approvals ({pendingUsers.length})
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button variant="secondary" size="sm" className="text-xs">
              <FileText className="h-4 w-4 mr-1.5" />
              Upload Material
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/approvals"
          className="rounded-xl border border-amber-800/40 bg-amber-950/10 p-5 hover:border-amber-700/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Pending Approval</span>
            <span className="p-2 rounded-lg bg-amber-950 border border-amber-800/60 text-amber-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{pendingUsers.length}</p>
          <span className="text-[11px] text-amber-300/80 mt-1 block">Awaiting ID verification</span>
        </Link>

        <Link
          href="/admin/users"
          className="rounded-xl border border-surface-800 bg-surface-900/60 p-5 hover:border-surface-700 transition-colors"
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
          className="rounded-xl border border-surface-800 bg-surface-900/60 p-5 hover:border-surface-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-surface-400 font-semibold">Study Materials</span>
            <span className="p-2 rounded-lg bg-surface-950 border border-surface-800 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{MOCK_MATERIALS.length}</p>
          <span className="text-[11px] text-indigo-400 mt-1 block">Protected in private bucket</span>
        </Link>

        <Link
          href="/admin/logs"
          className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-5 hover:border-rose-800/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-rose-400 font-semibold">Suspended Accounts</span>
            <span className="p-2 rounded-lg bg-rose-950 border border-rose-800/60 text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{suspendedUsers.length}</p>
          <span className="text-[11px] text-rose-400 mt-1 block">1 security violation logged</span>
        </Link>
      </div>

      {/* 3. Action Columns: Pending Approvals Queue & Security Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals Widget */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-800">
            <div>
              <h2 className="text-base font-bold text-white">Pending Applicant Queue</h2>
              <p className="text-xs text-surface-400">Requires administrative verification to grant LMS access</p>
            </div>
            <Link href="/admin/approvals" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              View All →
            </Link>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-surface-500 font-mono">
              ✓ All applicants have been processed.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg border border-surface-800 bg-surface-950/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{user.full_name}</span>
                      <Badge variant="warning">Pending Approval</Badge>
                    </div>
                    <p className="text-xs text-surface-400 font-mono">{user.email}</p>
                    <p className="text-[11px] text-surface-500">{user.phone_number} • {user.address}</p>
                  </div>

                  <Link href="/admin/approvals">
                    <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-xs w-full sm:w-auto">
                      Inspect & Approve
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Security & Material Access Stream */}
        <div className="rounded-xl border border-surface-800 bg-surface-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-800">
            <div>
              <h2 className="text-base font-bold text-white">Live Access Log Activity</h2>
              <p className="text-xs text-surface-400">Real-time preview authorizations & security events</p>
            </div>
            <Link href="/admin/logs" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Full Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_ACCESS_LOGS.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-surface-800 bg-surface-950/80 p-3.5 flex items-start gap-3"
              >
                <div
                  className={`mt-0.5 p-1.5 rounded ${
                    log.action === "unauthorized_attempt"
                      ? "bg-rose-950 text-rose-400 border border-rose-800/60"
                      : "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                  }`}
                >
                  {log.action === "unauthorized_attempt" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-white uppercase">
                      {log.action.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-surface-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-surface-300">
                    {(log.metadata as any)?.note || "Material preview accessed"}
                  </p>
                  <p className="text-[10px] font-mono text-surface-500">
                    IP: {log.ip_address} • Trace: {log.session_id || "BLOCKED"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

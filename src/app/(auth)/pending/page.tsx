"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock, ShieldAlert, XCircle, ArrowLeft, RefreshCw, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";

function PendingContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "pending";

  const isSuspended = status === "suspended" || status === "restricted";
  const isRejected = status === "rejected";
  const isPending = !isSuspended && !isRejected;

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm border border-blue-400/30">
            <GraduationCap className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Pabir Paul&apos;s Tuition • Commerce Division
        </h2>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111726] p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        {/* Status Icon */}
        <div className="inline-flex p-4 rounded-xl bg-[#0b0f19] border border-white/10 shadow-inner">
          {isPending && <Clock className="h-10 w-10 text-amber-400 animate-pulse" />}
          {isSuspended && <ShieldAlert className="h-10 w-10 text-rose-500" />}
          {isRejected && <XCircle className="h-10 w-10 text-rose-400" />}
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isPending && "Admission Awaiting Faculty Approval"}
            {isSuspended && "Student Access Suspended"}
            {isRejected && "Admission Not Approved"}
          </h1>

          <p className="text-xs sm:text-sm text-surface-300 leading-relaxed max-w-md mx-auto">
            {isPending &&
              "Your student admission application has been registered. Pabir Paul will review your academic semester/level enrollment shortly. Once verified, your full study notes, scanner solutions, and lecture audio will unlock."}
            {isSuspended &&
              "Your student account access has been suspended due to security violation or pending batch fee clearance."}
            {isRejected &&
              "Your registration could not be verified for current commerce tuition batches."}
          </p>
        </div>

        {/* Details Box */}
        <div className="rounded-lg border border-white/5 bg-[#0b0f19] p-4 text-xs font-mono text-left space-y-2 text-surface-300">
          <div className="flex justify-between">
            <span className="text-surface-500">FACULTY DESK:</span>
            <span className="text-blue-400 font-semibold">PABIR PAUL (COMMERCE)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">CLEARANCE STATUS:</span>
            <span
              className={`font-semibold uppercase ${
                isPending ? "text-amber-400" : "text-rose-400"
              }`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">CONTACT DESK:</span>
            <span className="text-surface-300">support@pabirpaul.io</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Return to Sign In
            </Button>
          </Link>

          {isPending && (
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Check Approval Status</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PendingStatusPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center p-4 sm:p-6 text-surface-100 pb-12">
      <React.Suspense
        fallback={
          <div className="p-8 text-center text-xs text-surface-400">
            Loading verification status...
          </div>
        }
      >
        <PendingContent />
      </React.Suspense>
    </div>
  );
}

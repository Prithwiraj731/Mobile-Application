"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, ArrowRight, Lock, AlertCircle, Clock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPendingApproval, setIsPendingApproval] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsPendingApproval(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === "pending_approval") {
          setIsPendingApproval(true);
          setError(data.error || "Your account is pending admin approval.");
        } else {
          setError(data.error || "Invalid credentials.");
        }
        setIsLoading(false);
        return;
      }

      let target = "/dashboard";
      if (data.status === "pending_approval") {
        target = "/pending?status=pending";
      } else if (data.status === "suspended" || data.status === "rejected") {
        target = `/pending?status=${data.status}`;
      } else if (data.role === "admin" || data.role === "super_admin") {
        target = "/admin";
      } else {
        target = "/dashboard";
      }

      window.location.href = target;
    } catch {
      setError("Network connection error. Please try again.");
      setIsLoading(false);
    }
  };



  return (
    <div
      className="min-h-screen bg-[#0c0a0b] flex flex-col justify-center items-center p-4 sm:p-6 text-surface-100 pb-16 relative overflow-hidden"
      style={{ paddingTop: "max(env(safe-area-inset-top, 0px), 24px)" }}
    >
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-12 left-12 h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse" />
      <div className="absolute top-28 right-16 h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.9)] animate-pulse" />
      <div className="absolute bottom-20 left-10 h-4 w-4 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.9)] animate-pulse" />
      <div className="absolute bottom-32 right-12 h-3.5 w-3.5 rounded-full bg-orange-400 shadow-[0_0_16px_rgba(249,115,22,0.9)] animate-pulse" />

      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* 3D Crest & Headline */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-[2px] shadow-2xl shadow-orange-500/30 animate-float">
              <div className="h-full w-full rounded-3xl bg-[#181516] flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-orange-400" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-400/50 font-bold text-xs">
              ☀️
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              Learn <span className="text-orange-400">Commerce</span> 📚
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 font-medium max-w-xs mx-auto mt-1">
              Pabir Paul&apos;s Tuition • B.COM (Sem 1-8), M.COM, CA & CMA
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl bg-[#181516]/95 p-6 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-5">
          {/* Pending Approval Notice */}
          {isPendingApproval ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/60 p-4 text-xs text-amber-300 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-200">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
                <span>Admission Pending Admin Approval</span>
              </div>
              <p className="text-[11px] text-surface-300 leading-relaxed">
                Your account is currently waiting for admin approval. Once the faculty verifies and approves your registration, you can sign in to access all notes and materials.
              </p>
              <div className="pt-1">
                <Link
                  href="/pending?status=pending"
                  className="text-amber-400 hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                >
                  View Approval Status Details →
                </Link>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsPendingApproval(false);
                }}
                placeholder="student@example.com"
                className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPendingApproval(false);
                }}
                placeholder="••••••••"
                className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            {/* Warm Mango CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-mango w-full py-3.5 rounded-full text-sm font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-1 text-center text-xs text-surface-400">
            New student joining tuition batches?{" "}
            <Link href="/signup" className="text-orange-400 hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}

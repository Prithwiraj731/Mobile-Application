"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, ArrowRight, Lock, AlertCircle, Sparkles } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("student.free@example.com");
  const [password, setPassword] = React.useState("Student@123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
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
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        let target = "/dashboard";
        if (user.status === "pending_approval") {
          target = "/pending?status=pending";
        } else if (user.status === "suspended" || user.status === "rejected") {
          target = `/pending?status=${user.status}`;
        } else if (user.role === "admin") {
          target = "/admin";
        }
        window.location.href = target;
      } else {
        setError("Network error or invalid user.");
        setIsLoading(false);
      }
    }
  };

  const handleSelectMock = (user: (typeof MOCK_USERS)[0]) => {
    setEmail(user.email);
    setPassword(user.demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0a0b] flex flex-col justify-center items-center p-4 sm:p-6 text-surface-100 pb-16 relative overflow-hidden">
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
            {/* Glowing Sun Sparkle */}
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
          {error && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                Student Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            {/* Warm Mango CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-mango w-full py-3.5 rounded-full text-sm font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
            New student joining Pabir Paul&apos;s Tuition?{" "}
            <Link href="/signup" className="text-orange-400 hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>

        {/* 1-Click Evaluation Switcher */}
        <div className="rounded-3xl bg-[#181516]/80 p-5 space-y-3 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-surface-300">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>1-Click Test Account Switcher</span>
            </div>
            <span className="text-[10px] text-surface-500 font-mono">Instant Switch</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {MOCK_USERS.map((u) => {
              const isSelected = email === u.email;
              const isInstructor = u.role === "admin";
              const isPremium = u.planCode === "PREMIUM";

              return (
                <button
                  key={u.id}
                  onClick={() => handleSelectMock(u)}
                  className={`flex flex-col text-left p-3 rounded-2xl border text-xs transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? isInstructor
                        ? "border-amber-400 bg-amber-500/15 text-white shadow-lg"
                        : "border-orange-500 bg-orange-500/15 text-white shadow-lg"
                      : "border-white/5 bg-[#0c0a0b]/80 text-surface-400 hover:border-white/20 hover:text-surface-200"
                  }`}
                >
                  <span className="font-bold text-surface-100 truncate">{u.full_name}</span>
                  <span className="text-[10px] text-surface-400 capitalize font-mono mt-0.5">
                    {isInstructor ? "⭐ Lead Faculty" : isPremium ? "👑 VIP Master" : `${u.planCode} Student`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

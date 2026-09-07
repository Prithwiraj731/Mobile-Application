"use client";

import * as React from "react";
import { Crown, Sparkles, Shield, Check, Lock, Calendar, GraduationCap, Award } from "lucide-react";
import { MOCK_PLANS } from "@/lib/mock-data";
import { PlanBadge } from "@/components/student/PlanBadge";
import { Button } from "@/components/ui/Button";

import { BackButton } from "@/components/ui/BackButton";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-24 relative">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-3">
          <BackButton fallbackHref="/dashboard" label="Return to Dashboard" />
          <div className="flex items-center gap-2 text-orange-400 text-xs font-mono">
            <GraduationCap className="h-4 w-4" />
            <span className="tracking-wider uppercase font-bold">COMMERCE TUITION PASS CLEARANCE</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Tuition Pass & Batch Clearance 👑
        </h1>
        <p className="text-xs sm:text-sm text-surface-400 mt-1">
          Review your commerce tuition clearance level, active validity, and study material entitlements
        </p>
      </div>

      {/* Active Subscription Summary Card */}
      <div className="relative z-10 rounded-3xl bg-[#181516] p-6 sm:p-7 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-400 font-medium">Current Clearance:</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
              <Shield className="h-3 w-3" />
              <span>FREE PASS CLEARANCE</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Standard Commerce Pass</h2>
          <p className="text-xs sm:text-sm text-surface-300 max-w-xl leading-relaxed">
            Your student account currently has access to foundational formula sheets, ledger formats, and introductory audio briefings.
          </p>
        </div>

        <div className="space-y-2 bg-[#0c0a0b] p-4 rounded-2xl border border-white/5 shrink-0 text-xs font-mono text-surface-300 shadow-inner">
          <div className="flex items-center gap-2 text-surface-300">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span>Academic Year 2026-27</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-bold">● Status: Verified Tuition Student</p>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Tuition Pass Tier Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {MOCK_PLANS.map((plan) => {
            const isCurrent = plan.code === "FREE";
            const isPremium = plan.code === "PREMIUM";
            const isPro = plan.code === "PRO";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${
                  isPremium
                    ? "bg-gradient-to-b from-[#241c14] to-[#16120e] border-2 border-amber-500/50 shadow-[0_20px_50px_rgba(245,158,11,0.25)]"
                    : isPro
                    ? "bg-gradient-to-b from-[#1c1424] to-[#120e17] border border-purple-500/40 shadow-[0_20px_50px_rgba(168,85,247,0.2)]"
                    : "bg-[#181516] border border-white/10"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black font-mono px-3.5 py-1 rounded-full uppercase tracking-wider ${
                        isPremium
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : isPro
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {plan.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                        Active Pass
                      </span>
                    )}
                  </div>

                  <div>
                    <span
                      className={`text-3xl sm:text-4xl font-black ${
                        isPremium
                          ? "text-amber-400 drop-shadow-sm"
                          : isPro
                          ? "text-purple-300 drop-shadow-sm"
                          : "text-white"
                      }`}
                    >
                      ₹{plan.price_cents / 100}
                    </span>
                    <span className="text-xs text-surface-400 ml-1.5 font-mono">
                      / {plan.duration_days} days
                    </span>
                  </div>

                  <p className="text-xs text-surface-400 leading-relaxed">{plan.description}</p>

                  <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
                    <p className="font-bold text-surface-200 uppercase tracking-wider text-[10px] font-mono">
                      Included Entitlements:
                    </p>
                    <ul className="space-y-2 text-surface-300">
                      {plan.code === "FREE" && (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Foundational Formula Sheets (PDF)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Introductory Audio Briefings</span>
                          </li>
                          <li className="flex items-center gap-2 text-surface-500">
                            <Lock className="h-4 w-4 text-surface-600 shrink-0" />
                            <span>Full DPPs & Solved Problem Sets</span>
                          </li>
                        </>
                      )}

                      {plan.code === "PRO" && (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-400 shrink-0" />
                            <span>All Standard Pass Material</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-400 shrink-0" />
                            <span>Complete DPPs & Numerical Problems</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-400 shrink-0" />
                            <span>Full Chapter Audio Lectures</span>
                          </li>
                        </>
                      )}

                      {plan.code === "PREMIUM" && (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-amber-400 shrink-0" />
                            <span>All Pro & Standard Materials</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-amber-400 shrink-0" />
                            <span>Past 10-Yr University & ICAI Scanners</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-amber-400 shrink-0" />
                            <span>Direct Doubt Notes & Test Keys</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                  {isCurrent ? (
                    <button className="w-full py-3 rounded-full bg-white/10 text-surface-400 text-xs font-bold cursor-not-allowed" disabled>
                      Active Tuition Pass
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`To upgrade to ${plan.name}, please contact Pabir Paul or the tuition admissions desk.`)}
                      className={`w-full py-3 rounded-full text-xs font-black shadow-lg transition-all active:scale-95 ${
                        isPremium
                          ? "btn-mango"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                      }`}
                    >
                      Request Batch Upgrade
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

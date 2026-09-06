"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Lock,
  BookOpen,
  Calculator,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-32 md:pt-36 pb-16 md:pb-24 overflow-hidden">
      {/* Ambient Subtle Glowing Gradients */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-amber-500/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-orange-500/[0.06] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Academic Session 2026–27 • Admissions Open</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Master Commerce, Accounting & Tax with{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Pabir Paul
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-surface-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Dedicated private coaching for <strong className="text-white font-semibold">B.COM (Sem 1 to 8)</strong>,{" "}
              <strong className="text-white font-semibold">M.COM (Sem 1 to 4)</strong>, and{" "}
              <strong className="text-white font-semibold">CA & CMA Professional Exams</strong>. Master Financial Accounting, Direct & Indirect Taxation, Corporate Law, Costing, and Auditing in a structured, distraction-free environment.
            </p>

            {/* Curriculum Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">B.COM Honours</span>
                </div>
                <p className="text-[11px] text-surface-400 leading-tight">Sem 1 to 8 • NEP 4-Yr Syllabus</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Calculator className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">M.COM Postgrad</span>
                </div>
                <p className="text-[11px] text-surface-400 leading-tight">Sem 1 to 4 • Tax & Strategic Costing</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">CA & CMA</span>
                </div>
                <p className="text-[11px] text-surface-400 leading-tight">Foundation, Inter & Scanner Keys</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/signup"
                className="btn-mango px-7 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl text-xs font-semibold text-surface-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Lock className="h-4 w-4 text-amber-400" />
                <span>Student Portal Sign In</span>
              </Link>
            </div>

            {/* Trust Notice */}
            <p className="text-[11px] text-surface-400 font-mono pt-1 flex items-center justify-center lg:justify-start gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified enrollment required • Watermarked notes • Anti-leak protected</span>
            </p>
          </div>

          {/* Right Column: Obsidian Executive Academy Desk Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#1a1718] to-[#110f10] border border-white/[0.1] shadow-2xl p-6 sm:p-7 space-y-4">
              {/* Header inside preview */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 font-bold">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pabir Paul Academic Desk</h4>
                    <p className="text-[10px] text-surface-400 font-mono">Commerce & Professional Division</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Portal
                </span>
              </div>

              {/* Course Module Item 1 */}
              <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase font-mono text-amber-400">
                    B.COM (SEM 1 TO 8)
                  </span>
                  <span className="text-[10px] font-mono text-surface-400">NEP 4-Yr Syllabus</span>
                </div>
                <h5 className="text-sm font-bold text-white">Financial & Corporate Accounting</h5>
                <p className="text-xs text-surface-300">Journal entries, Final Accounts, Amalgamation & Cash Flow Statements.</p>
              </div>

              {/* Course Module Item 2 */}
              <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase font-mono text-orange-400">
                    TAXATION & AUDITING
                  </span>
                  <span className="text-[10px] font-mono text-surface-400">Direct & Indirect</span>
                </div>
                <h5 className="text-sm font-bold text-white">Income Tax Laws & GST Framework</h5>
                <p className="text-xs text-surface-300">PGBP, Capital Gains, Chapter VI-A deductions & Input Tax Credit (ITC).</p>
              </div>

              {/* Course Module Item 3 */}
              <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase font-mono text-emerald-400">
                    CA & CMA PROFESSIONAL
                  </span>
                  <span className="text-[10px] font-mono text-surface-400">Foundation • Inter • Final</span>
                </div>
                <h5 className="text-sm font-bold text-white">Cost & Strategic Financial Management</h5>
                <p className="text-xs text-surface-300">Marginal costing, Standard costing, Capital budgeting & Scanner solutions.</p>
              </div>

              {/* Floating Tile */}
              <div className="flex justify-end pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-surface-300">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span>Kolkata Offline & App-Powered Batch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-3xl bg-[#141213] border border-white/[0.08] shadow-2xl">
          <div className="text-center space-y-0.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">8 Semesters</p>
            <p className="text-xs text-amber-400 font-semibold">Complete B.COM Coverage</p>
            <p className="text-[10px] text-surface-400 font-mono">Accounts, Tax, Law & Costing</p>
          </div>

          <div className="text-center space-y-0.5 border-l border-white/[0.08] pl-3 sm:pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">4 Semesters</p>
            <p className="text-xs text-orange-400 font-semibold">M.COM Postgraduate</p>
            <p className="text-[10px] text-surface-400 font-mono">Advanced Reporting & Tax</p>
          </div>

          <div className="text-center space-y-0.5 border-l border-white/[0.08] pl-3 sm:pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">CA & CMA</p>
            <p className="text-xs text-amber-300 font-semibold">Professional Batches</p>
            <p className="text-[10px] text-surface-400 font-mono">Inter & Final Scanner Series</p>
          </div>

          <div className="text-center space-y-0.5 border-l border-white/[0.08] pl-3 sm:pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs text-emerald-400 font-semibold">Protected Notes</p>
            <p className="text-[10px] text-surface-400 font-mono">Watermarked Student Material</p>
          </div>
        </div>
      </div>
    </section>
  );
}

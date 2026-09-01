"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  BookOpen,
  Calculator,
  FileSpreadsheet,
  Zap,
  Sparkles,
  Play,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400 shadow-sm">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Admissions Open • B.COM, M.COM, CA & CMA Batches</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Master Commerce, Accounting & Tax with{" "}
              <span className="text-orange-400">Pabir Paul</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-surface-300 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Dedicated private coaching for <strong>B.COM (Sem 1 to 8)</strong>, <strong>M.COM (Sem 1 to 4)</strong>, and <strong>CA & CMA Professional Exams</strong>. Master Financial Accounting, Direct & Indirect Taxation, Corporate Law, Costing, and Auditing in a structured, distraction-free environment.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-xs font-bold text-surface-200 bg-[#181516] px-4 py-3 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                <span>B.COM Sem 1 to 8</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-surface-200 bg-[#181516] px-4 py-3 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                <span>M.COM Sem 1 to 4</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-surface-200 bg-[#181516] px-4 py-3 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                <span>CA & CMA Scanners</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/signup"
                className="btn-mango w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/login"
                className="btn-secondary w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="h-4 w-4 text-orange-400" />
                <span>Student Portal Sign In</span>
              </Link>
            </div>

            {/* Trust Notice */}
            <p className="text-[11px] text-surface-400 font-mono pt-1 flex items-center justify-center lg:justify-start gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              <span>Verified student enrollment required. All notes protected with dynamic watermarking.</span>
            </p>
          </div>

          {/* Right Column: Warm Mango / Orange Futuristic Card (Matches Reference UI) */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden card-featured-hero p-6 sm:p-8 text-white shadow-2xl space-y-5">
              {/* Header inside preview */}
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold border border-white/30">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Pabir Paul Academic Desk</h4>
                    <p className="text-[10px] text-white/80 font-mono">Commerce & Professional Division</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black text-white bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25">
                  ● Verified Portal
                </span>
              </div>

              {/* Course Module Item 1 */}
              <div className="rounded-2xl bg-black/20 backdrop-blur-md p-4 border border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase font-mono text-amber-200">
                    B.COM (SEM 1 TO 8)
                  </span>
                  <span className="text-[10px] font-mono text-white/75">NEP 4-Yr Syllabus</span>
                </div>
                <h5 className="text-sm font-black text-white">Financial & Corporate Accounting</h5>
                <p className="text-xs text-white/90">Journal entries, Final Accounts, Amalgamation & Cash Flow Statements.</p>
              </div>

              {/* Course Module Item 2 */}
              <div className="rounded-2xl bg-black/20 backdrop-blur-md p-4 border border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase font-mono text-amber-200">
                    TAXATION & AUDITING
                  </span>
                  <span className="text-[10px] font-mono text-white/75">Direct & Indirect</span>
                </div>
                <h5 className="text-sm font-black text-white">Income Tax Laws & GST Framework</h5>
                <p className="text-xs text-white/90">PGBP, Capital Gains, Chapter VI-A deductions & Input Tax Credit (ITC).</p>
              </div>

              {/* Course Module Item 3 */}
              <div className="rounded-2xl bg-black/20 backdrop-blur-md p-4 border border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase font-mono text-amber-200">
                    CA & CMA PROFESSIONAL
                  </span>
                  <span className="text-[10px] font-mono text-white/75">Foundation • Inter • Final</span>
                </div>
                <h5 className="text-sm font-black text-white">Cost & Strategic Financial Management</h5>
                <p className="text-xs text-white/90">Marginal costing, Standard costing, Capital budgeting & Scanner solutions.</p>
              </div>

              {/* Floating 3D Graphic Tile inside preview */}
              <div className="flex justify-end pt-1">
                <div className="relative inline-flex items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl glass-float-tile flex items-center justify-center shadow-2xl animate-float">
                    <GraduationCap className="h-8 w-8 text-white stroke-[2]" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-300 text-black flex items-center justify-center text-[9px] font-bold shadow-md">
                    ✦
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#181516] border border-white/10 shadow-2xl">
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-white">8 Semesters</p>
            <p className="text-xs text-orange-400 font-bold">Complete B.COM Coverage</p>
            <p className="text-[10px] text-surface-400 font-mono">Accounting, Tax, Law & Costing</p>
          </div>

          <div className="text-center space-y-1 border-l border-white/10 pl-4">
            <p className="text-2xl sm:text-3xl font-black text-white">4 Semesters</p>
            <p className="text-xs text-purple-400 font-bold">M.COM Postgraduate</p>
            <p className="text-[10px] text-surface-400 font-mono">Advanced Reporting & Tax</p>
          </div>

          <div className="text-center space-y-1 border-l border-white/10 pl-4">
            <p className="text-2xl sm:text-3xl font-black text-white">CA & CMA</p>
            <p className="text-xs text-sky-400 font-bold">Professional Batches</p>
            <p className="text-[10px] text-surface-400 font-mono">Inter & Final Scanner Series</p>
          </div>

          <div className="text-center space-y-1 border-l border-white/10 pl-4">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
            <p className="text-xs text-emerald-400 font-bold">Protected Notes</p>
            <p className="text-[10px] text-surface-400 font-mono">Watermarked Student Notes</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import {
  Calculator,
  ShieldCheck,
  Target,
  FileSpreadsheet,
  Headphones,
  Award,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export function WhyChooseSection() {
  const pillars = [
    {
      icon: Calculator,
      title: "First-Principles Ledger Mastery",
      description:
        "No memorizing debit/credit shortcuts blindly. Every accounting standard (AS/Ind AS) and balance sheet adjustment is proven from core double-entry logic.",
      highlight: "Pure Conceptual Accounting",
    },
    {
      icon: FileSpreadsheet,
      title: "Past 10-Yr Scanner Series",
      description:
        "Exhaustive solved university past papers for B.Com & M.Com, plus ICAI/ICMAI scanner problems with detailed working notes.",
      highlight: "Comprehensive Exam Scanners",
    },
    {
      icon: Target,
      title: "Direct & Indirect Tax Breakdown",
      description:
        "Simplified Income Tax provisions (PGBP, Capital Gains, Chapter VI-A) and practical GST Input Tax Credit (ITC) calculations.",
      highlight: "Updated Finance Act & GST Rules",
    },
    {
      icon: Headphones,
      title: "Audio Law & Section Capsules",
      description:
        "High-density audio briefings by Pabir Paul covering Companies Act sections, Auditing Standards (SA), and tax amendments for rapid revision.",
      highlight: "Audio Lessons for Quick Recall",
    },
    {
      icon: ShieldCheck,
      title: "Disciplined Batch Isolation",
      description:
        "Dedicated small cohorts segmented by semester (B.Com Sem 1-8, M.Com Sem 1-4) and professional exam level (CA/CMA Inter & Final).",
      highlight: "Small, High-Focus Batches",
    },
    {
      icon: Award,
      title: "Protected Academic Workspace",
      description:
        "Private digital portal where all verified lecture notes, scanner keys, and tax charts are stamped dynamically with your student ID.",
      highlight: "Zero Leaks • 100% Private",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Why Pabir Paul&apos;s Tuition</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Coaching Built for <span className="text-orange-400">Commerce Toppers</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-surface-300 font-medium leading-relaxed">
            Unlike mass online courses, Pabir Paul&apos;s Tuition provides disciplined, university-aligned guidance designed for 1st-class honours and professional rank holders.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl card-dark-glass p-6 sm:p-7 hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-md">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-surface-500 bg-[#0c0a0b] px-3 py-1 rounded-full border border-white/5">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0" />
                  <span className="text-xs font-bold text-surface-200">{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

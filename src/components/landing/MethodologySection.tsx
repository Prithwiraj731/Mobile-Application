"use client";

import * as React from "react";
import {
  BookOpen,
  FileText,
  Headphones,
  CheckSquare,
  Layers,
  CheckCircle2,
} from "lucide-react";

export function MethodologySection() {
  const steps = [
    {
      step: "01",
      title: "Interactive Batch Lecture",
      icon: BookOpen,
      badge: "Concept Foundation",
      description:
        "In-depth classroom sessions breaking down accounting standards, tax provisions, case laws, and mathematical calculations with real-time student interaction.",
      deliverable: "Live double-entry & tax theory breakdown",
    },
    {
      step: "02",
      title: "Master Ledger & Tax Notes",
      icon: FileText,
      badge: "Consolidation",
      description:
        "Clear, illustrated PDF notes uploaded to the private portal. Watermarked dynamically with your student ID to guarantee document security.",
      deliverable: "Watermarked balance sheet formats & tax charts",
    },
    {
      step: "03",
      title: "Audio Section & Law Briefings",
      icon: Headphones,
      badge: "Retention",
      description:
        "High-density audio recaps by Pabir Paul. Ideal for 15-minute quick reviews before sleep, morning routines, or exam days.",
      deliverable: "High-retention audio memory capsules",
    },
    {
      step: "04",
      title: "Graded Scanner & DPP Sets",
      icon: CheckSquare,
      badge: "Exam Mastery",
      description:
        "Daily Practice Problems (DPP) and past university/ICAI scanner sets. Complete homework exercises with thorough step-by-step teacher evaluations.",
      deliverable: "Targeted problem sheets & score analytics",
    },
  ];

  return (
    <section id="methodology" className="py-20 md:py-28 bg-[#100d0e] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
            <Layers className="h-3.5 w-3.5" />
            <span>4-Step Commerce Mastery Loop</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How Students Achieve <span className="text-orange-400">1st Class Honours</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-surface-300 font-medium leading-relaxed">
            Our structured pedagogical loop ensures every single chapter is learned, consolidated, memorized, and tested to perfection.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative rounded-3xl card-dark-glass p-6 sm:p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-orange-500/40">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      {step.badge}
                    </span>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-white">{step.title}</h3>
                    <p className="text-xs text-surface-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 text-[11px] font-mono text-surface-400 flex items-center gap-1.5">
                  <span className="text-orange-400 font-bold">✓</span>
                  <span>{step.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

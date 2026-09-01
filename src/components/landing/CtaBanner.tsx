"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Lock, BookOpen, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl card-featured-hero p-8 sm:p-12 lg:p-14 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-xs font-mono font-bold text-white uppercase tracking-wider">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Admissions Open • Academic Year 2026-27</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              Ready to Excel in B.COM, M.COM, CA or CMA?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-white/95 font-medium leading-relaxed drop-shadow-sm">
              Apply for batch admission today. Gain exclusive access to Pabir Paul&apos;s private lecture notes, past 10-year scanner solutions, and audio law recaps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-black/95 hover:bg-black text-white text-xs sm:text-sm font-black px-8 py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="h-4 w-4 text-orange-400 stroke-[2.5]" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs sm:text-sm font-bold px-7 py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all backdrop-blur-md"
            >
              <Lock className="h-4 w-4" />
              <span>Student Login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { Star, Quote, Trophy } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Debraj Paul",
      role: "B.COM (Honours) Sem 6 • Calcutta University",
      score: "First Class with Distinction (84%)",
      quote:
        "Pabir Sir's Corporate Accounting & Tax scanner series made complex holding company accounts and GST computations crystal clear. The watermarked notes were my primary revision material.",
      badge: "University Top Ranker",
    },
    {
      name: "Sneha Mukherjee",
      role: "CA Intermediate (Group 1 & 2)",
      score: "Cleared in 1st Attempt",
      quote:
        "The audio law capsules and solved scanner sets were invaluable during exam preparation. Pabir Sir breaks down every provision with practical business context.",
      badge: "CA Inter Qualifier",
    },
    {
      name: "Ramesh Sharma (Parent)",
      role: "Parent of Aarav Sharma (B.COM Sem 3)",
      score: "Consistent Academic Improvement",
      quote:
        "As a parent, I appreciate the structured batch environment and personal accountability. The tuition portal ensures our son stays disciplined with his accounting homework and tests.",
      badge: "Parent Endorsement",
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#100d0e] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>Student & Parent Voices</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Proven Results in <span className="text-orange-400">University & Professional Exams</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-surface-300 font-medium leading-relaxed">
            Read how Pabir Paul&apos;s disciplined coaching methodology and private digital portal helped students achieve top ranks in B.COM, M.COM, CA, and CMA.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl card-dark-glass p-6 sm:p-7 flex flex-col justify-between hover:border-orange-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-orange-500/15 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
                    {t.badge}
                  </span>
                </div>

                <Quote className="h-7 w-7 text-orange-500/30" />

                <p className="text-xs sm:text-sm text-surface-200 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 space-y-1">
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
                <p className="text-xs text-surface-400">{t.role}</p>
                <p className="text-xs font-mono font-bold text-orange-400 pt-0.5">
                  ✓ {t.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

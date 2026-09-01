"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "Which commerce programs and semesters are covered under Pabir Paul's Tuition?",
      a: "We offer dedicated coaching for all 8 Semesters of B.COM (NEP 4-year & 3-year curriculum), all 4 Semesters of M.COM, as well as CA Foundation / Intermediate / Final and CMA Foundation / Intermediate / Final.",
    },
    {
      q: "How does the admission and account approval process work?",
      a: "When you apply via the Sign Up form, your registration is submitted in 'Pending Approval' status. Pabir Paul reviews your semester and course enrollment. Once approved, your account is activated and you can sign in to access your batch dashboard.",
    },
    {
      q: "Are the study materials aligned with university past papers and professional scanners?",
      a: "Yes! The portal provides past 10-year solved scanner series for B.Com and M.Com universities, along with ICAI and ICMAI scanner solutions with complete step-by-step working notes.",
    },
    {
      q: "What types of learning materials will I get access to?",
      a: "Enrolled students receive high-yield PDF chapter notes, ledger formats, tax formula charts, audio revision summaries of accounting standards & sections, and graded Daily Practice Problems (DPP).",
    },
    {
      q: "Can I use the tuition portal on my mobile phone or tablet?",
      a: "Yes! The portal is built mobile-first with touch-optimized navigation, audio playback, and responsive PDF viewers. It also works seamlessly on tablets, laptops, and desktop browsers.",
    },
    {
      q: "What is dynamic watermarking and why is it used?",
      a: "Every educational document and tax scanner is dynamically stamped with your verified student name, email, student ID, and session timestamp. This guarantees educational materials remain private and prevents unauthorized circulation.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything You Need to <span className="text-orange-400">Know</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-surface-300 font-medium leading-relaxed">
            Common questions regarding B.COM, M.COM, CA, CMA admissions, semester syllabi, and protected portal access.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl card-dark-glass overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white font-bold text-sm sm:text-base hover:text-orange-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-orange-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-surface-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

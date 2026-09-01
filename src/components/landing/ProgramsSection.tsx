"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ArrowRight, Layers, FileSpreadsheet, Calculator, Sparkles } from "lucide-react";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";

export function ProgramsSection() {
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");

  const currentProgram = COMMERCE_PROGRAMS.find((p) => p.id === selectedProgram) || COMMERCE_PROGRAMS[0];

  const semesterSubjectDetails: Record<string, string[]> = {
    // B.COM Semesters 1-8
    "Semester 1": ["Financial Accounting - I", "Business Law", "Principles of Management", "Microeconomics"],
    "Semester 2": ["Cost & Management Accounting - I", "Corporate Laws", "Business Mathematics & Stats", "Macroeconomics"],
    "Semester 3": ["Financial Accounting - II (Company Accounts)", "Direct Tax Laws (Income Tax)", "Business Communication", "Indian Financial System"],
    "Semester 4": ["Cost & Management Accounting - II", "Indirect Tax (GST & Customs)", "Auditing Principles & Practices", "E-Commerce"],
    "Semester 5": ["Corporate Accounting (Amalgamation & Holding)", "Financial Management (Capital Budgeting)", "Public Finance", "Entrepreneurship Dev."],
    "Semester 6": ["Financial Reporting & Analysis (Ind AS)", "Advanced Auditing & Assurance", "Management Accounting", "Banking & Insurance Law"],
    "Semester 7": ["Advanced Corporate Financial Accounting", "Strategic Financial Management (SFM)", "International Business", "Corporate Ethics"],
    "Semester 8": ["Advanced Tax Planning & Management", "Business Valuation & M&A Restructuring", "Research Methodology & Project", "Insolvency & Bankruptcy Code"],

    // M.COM Semesters 1-4
    "Semester 1 (M.Com)": ["Advanced Financial Accounting & Theory", "Managerial Economics", "Advanced Business Statistics", "Corporate Governance"],
    "Semester 2 (M.Com)": ["Strategic Management Accounting", "Advanced Corporate Tax Planning", "Financial Markets & Services", "Operations Research"],
    "Semester 3 (M.Com)": ["Security Analysis & Portfolio Management", "International Financial Management", "Advanced Auditing Principles", "Strategic Management"],
    "Semester 4 (M.Com)": ["Corporate Financial Strategy & Valuation", "Derivatives & Financial Risk Management", "Forensic Accounting & Fraud Analysis", "Master Dissertation Guidance"],

    // CA
    "Foundation (CA)": ["Principles and Practice of Accounting", "Business Laws", "Quantitative Aptitude", "Business Economics"],
    "Intermediate - Group 1 (CA)": ["Advanced Accounting", "Corporate and Other Laws", "Taxation (Income Tax & GST)"],
    "Intermediate - Group 2 (CA)": ["Cost and Management Accounting", "Auditing and Ethics", "Financial Management & Strategic Management (FM-SM)"],
    "Final (CA)": ["Financial Reporting (FR)", "Advanced Financial Management (AFM)", "Advanced Auditing & Ethics", "Direct Tax & International Tax", "Indirect Tax Laws (GST & Customs)"],

    // CMA
    "Foundation (CMA)": ["Fundamentals of Business Laws & Ethics", "Financial and Cost Accounting", "Business Mathematics & Stats", "Business Economics"],
    "Intermediate - Group 1 (CMA)": ["Business Laws & Ethics", "Financial Accounting", "Direct & Indirect Taxation", "Cost Accounting"],
    "Intermediate - Group 2 (CMA)": ["Operations Management & Strategic Management", "Corporate Accounting & Auditing", "Financial Management & Data Analytics", "Management Accounting"],
    "Final (CMA)": ["Corporate & Economic Laws", "Strategic Financial Management (SFM)", "Strategic Cost Management (SCM)", "Direct Tax & International Taxation", "Corporate Financial Reporting"],
  };

  return (
    <section id="programs" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
            <Layers className="h-3.5 w-3.5" />
            <span>Academic Commerce Bifurcation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Curriculum Breakdown for <span className="text-orange-400">Every Level</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-surface-300 font-medium leading-relaxed">
            Choose your academic stream below to view the complete semester-wise and group-wise subject bifurcation.
          </p>
        </div>

        {/* Program Tabs */}
        <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
          {COMMERCE_PROGRAMS.map((prog) => {
            const isSelected = selectedProgram === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => setSelectedProgram(prog.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                  isSelected
                    ? "bg-white text-black shadow-xl shadow-white/20"
                    : "bg-[#181516] text-surface-400 hover:text-white border border-white/10"
                }`}
              >
                <span>{prog.name}</span>
                <span className="text-[10px] font-mono opacity-80">
                  {prog.id === "BCOM" ? "(8 Semesters)" : prog.id === "MCOM" ? "(4 Semesters)" : "(Professional)"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Program Overview Box */}
        <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-[#181516] border border-white/10 space-y-2 text-center max-w-3xl mx-auto shadow-xl">
          <h3 className="text-lg font-black text-white">{currentProgram.fullName}</h3>
          <p className="text-xs text-surface-300 leading-relaxed">{currentProgram.description}</p>
        </div>

        {/* Semesters / Groups Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentProgram.semestersOrGroups.map((sem, idx) => {
            const lookupKey =
              selectedProgram === "MCOM"
                ? `${sem} (M.Com)`
                : selectedProgram === "CA"
                ? `${sem} (CA)`
                : selectedProgram === "CMA"
                ? `${sem} (CMA)`
                : sem;

            const subjects = semesterSubjectDetails[lookupKey] || ["Accounting & Taxation", "Corporate Law", "Financial Management"];

            return (
              <div
                key={sem}
                className="rounded-3xl card-dark-glass p-6 space-y-4 hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-mono font-bold text-orange-400 uppercase">
                      {selectedProgram} • {sem}
                    </span>
                    <span className="text-[10px] font-mono text-surface-500 bg-[#0c0a0b] px-2 py-0.5 rounded-full border border-white/5">
                      Phase {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-mono font-bold text-surface-400 uppercase">
                      Core Subjects Covered:
                    </p>
                    <ul className="space-y-1.5 text-xs text-surface-200">
                      {subjects.map((sub) => (
                        <li key={sub} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-surface-400">Notes & Scanners</span>
                  <Link
                    href="/signup"
                    className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

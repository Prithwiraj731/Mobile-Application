"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, GraduationCap, Play, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";

export default function CoursesPage() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [selectedSemester, setSelectedSemester] = React.useState<string>("all");

  React.useEffect(() => {
    setIsLoading(true);
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const currentProgramObj = COMMERCE_PROGRAMS.find((p) => p.id === selectedProgram) || COMMERCE_PROGRAMS[0];

  const filteredCourses = courses.filter((c) => {
    const matchesProg = c.program === selectedProgram;
    const matchesSem =
      selectedSemester === "all" ||
      c.semester.toLowerCase().includes(selectedSemester.toLowerCase());
    return matchesProg && matchesSem;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-24 relative">
      {/* Ambient Glows */}
      <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 -left-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-orange-400 text-xs font-mono mb-1">
          <GraduationCap className="h-4 w-4" />
          <span className="tracking-wider uppercase font-bold">DEBRAJ TUTORIALS &bull; COMMERCE CURRICULUM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Tuition Batches & Semesters 📚
        </h1>
        <p className="text-xs sm:text-sm text-surface-400 mt-1">
          Structured semester pathways and professional courses for B.COM, M.COM, CA, and CMA
        </p>
      </div>

      {/* Program Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 relative z-10">
        {COMMERCE_PROGRAMS.map((prog) => {
          const isSelected = selectedProgram === prog.id;
          return (
            <button
              key={prog.id}
              onClick={() => {
                setSelectedProgram(prog.id);
                setSelectedSemester("all");
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-[#181516] text-surface-400 hover:text-white border border-white/5"
              }`}
            >
              <span>{prog.name}</span>
              <span className="text-[10px] opacity-75 font-mono">
                {prog.id === "BCOM" ? "(8 Sem)" : prog.id === "MCOM" ? "(4 Sem)" : "(Prof)"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Semester Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs relative z-10">
        <button
          onClick={() => setSelectedSemester("all")}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 text-[11px] font-semibold active:scale-95 ${
            selectedSemester === "all"
              ? "bg-white/20 text-white border border-white/30 shadow-sm"
              : "bg-[#181516] text-surface-400 hover:text-white border border-white/5"
          }`}
        >
          All {selectedProgram === "CA" || selectedProgram === "CMA" ? "Groups" : "Semesters"}
        </button>

        {currentProgramObj.semestersOrGroups.map((sem) => {
          const isSelected = selectedSemester === sem;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 text-[11px] font-semibold active:scale-95 ${
                isSelected
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/40"
                  : "bg-[#181516] text-surface-400 hover:text-white border border-white/5"
              }`}
            >
              {sem}
            </button>
          );
        })}
      </div>

      {/* Courses Grid with Vivid Futuristic Cards */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-12 text-center">
            <RefreshCw className="h-6 w-6 text-orange-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-surface-400">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                No Batches Listed for {selectedProgram} ({selectedSemester})
              </h3>
              <p className="text-xs text-surface-400 max-w-sm mx-auto">
                Courses and semester study plans are currently being configured by faculty. Please check back shortly or explore other streams.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, idx) => {
              const isCyan = idx % 4 === 0;
              const isViolet = idx % 4 === 1;
              const isEmerald = idx % 4 === 2;
              const cardClass = isCyan
                ? "card-cyan-vivid"
                : isViolet
                ? "card-violet-vivid"
                : isEmerald
                ? "card-emerald-vivid"
                : "card-amber-vivid";

              const iconEmoji = isCyan ? "🔮" : isViolet ? "📊" : isEmerald ? "⚖️" : "📈";

              return (
                <div
                  key={course.id}
                  className={`group relative rounded-3xl p-6 text-white transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${cardClass}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span>{iconEmoji}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white">
                        {course.code}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-sm line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/20 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{course.semester}</span>
                    </span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-1.5 bg-white text-black font-black text-xs px-4 py-2 rounded-full shadow-xl hover:bg-amber-300 transition-colors active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current text-black" />
                      <span>Enter Batch</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

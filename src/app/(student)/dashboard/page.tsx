"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  FileText,
  Headphones,
  Image as ImageIcon,
  Play,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  GraduationCap,
  Sparkles,
  Zap,
  Flame,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import { MaterialCard } from "@/components/student/MaterialCard";
import { PlanBadge } from "@/components/student/PlanBadge";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";
import { MaterialWithDetails } from "@/types";

export default function StudentDashboardPage() {
  const [userPlanRank, setUserPlanRank] = React.useState<number>(1); // Default Free (Rank 1)
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [selectedSemester, setSelectedSemester] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [previewToken, setPreviewToken] = React.useState<string | undefined>();
  const [watermarkText, setWatermarkText] = React.useState<string>("");
  const [sessionTraceId, setSessionTraceId] = React.useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [targetUpgradeTier, setTargetUpgradeTier] = React.useState<string>("pro");

  const [courses, setCourses] = React.useState<any[]>([]);
  const [materials, setMaterials] = React.useState<MaterialWithDetails[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = React.useState(false);

  const handleSimulateTierChange = (rank: number) => {
    setUserPlanRank(rank);
  };

  const handleProgramChange = (prog: "BCOM" | "MCOM" | "CA" | "CMA") => {
    setSelectedProgram(prog);
    setSelectedSemester("all");
  };

  const handleOpenPreview = async (material: MaterialWithDetails) => {
    setSelectedMaterial(material);

    try {
      const res = await fetch(`/api/preview/${material.id}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewToken(data.signedUrl);
        setWatermarkText(data.watermarkText || `Student • ${new Date().toLocaleDateString()} • Session #SEC-LIVE`);
        setSessionTraceId(data.sessionTraceId || "SEC-DEV-TRACER");
      } else {
        const trace = `SEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        setPreviewToken(material.file?.file_path ? `/api/preview/${material.id}/stream` : undefined);
        setWatermarkText(`Verified Student • Pabir Paul Tuition • ${new Date().toLocaleDateString()} • Session #${trace}`);
        setSessionTraceId(trace);
      }
    } catch {
      const trace = `SEC-${Date.now().toString(36).toUpperCase()}`;
      setWatermarkText(`Verified Student • Pabir Paul Tuition • Session #${trace}`);
      setSessionTraceId(trace);
    }

    setIsViewerOpen(true);
  };

  const handleUpgradePrompt = (requiredLevel: string) => {
    setTargetUpgradeTier(requiredLevel);
    setIsUpgradeModalOpen(true);
  };

  // Filter courses based on program, semester & search
  const currentProgramObj = COMMERCE_PROGRAMS.find((p) => p.id === selectedProgram) || COMMERCE_PROGRAMS[0];

  const filteredCourses = courses.filter((c) => {
    const matchesProgram = c.program === selectedProgram;
    const matchesSemester =
      selectedSemester === "all" ||
      c.semester.toLowerCase().includes(selectedSemester.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProgram && matchesSemester && matchesSearch;
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMaterials(true);
      try {
        const [matRes, courseRes] = await Promise.all([
          fetch("/api/materials"),
          fetch("/api/courses"),
        ]);
        const matData = await matRes.json();
        const courseData = await courseRes.json();
        if (matRes.ok && Array.isArray(matData.materials)) {
          setMaterials(matData.materials);
        }
        if (courseRes.ok && Array.isArray(courseData.courses)) {
          setCourses(courseData.courses);
        }
      } catch {
        // Keep initial state on network failure
      } finally {
        setIsLoadingMaterials(false);
      }
    };

    fetchData();
  }, []);

  // Filter materials based on search query & selected type
  const filteredMaterials = materials.filter((m) => {
    const matchesType = selectedType === "all" || m.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-24 relative">
      {/* Futuristic Ambient Glowing Orbs */}
      <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 -right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      {/* 1. Main Title & Test Tier Switcher (Exact Reference UI) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Explore your Courses <span className="text-2xl">📚</span>
          </h1>
          <p className="text-xs sm:text-sm text-surface-400 mt-1 font-medium">
            Access verified batch notes, audio briefings, and problem sheets
          </p>
        </div>

        {/* Sleek Pill Tier Switcher */}
        <div className="flex items-center gap-1.5 bg-[#181516] p-1.5 rounded-full border border-white/10 shrink-0 self-start sm:self-auto shadow-inner">
          <span className="text-[10px] text-surface-400 font-mono pl-2 pr-0.5">Tier:</span>
          <button
            onClick={() => handleSimulateTierChange(1)}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-200 active:scale-95 ${
              userPlanRank === 1
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/30"
                : "text-surface-400 hover:text-white"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => handleSimulateTierChange(2)}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-200 active:scale-95 ${
              userPlanRank === 2
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/30"
                : "text-surface-400 hover:text-white"
            }`}
          >
            Pro
          </button>
          <button
            onClick={() => handleSimulateTierChange(3)}
            className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-200 active:scale-95 ${
              userPlanRank === 3
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                : "text-surface-400 hover:text-white"
            }`}
          >
            VIP
          </button>
        </div>
      </div>

      {/* 2. Search Bar Pill (Exact Reference UI) */}
      <div className="relative z-10">
        <div className="search-pill flex items-center gap-3 px-5 py-3.5 rounded-full text-surface-200">
          <Search className="h-4 w-4 text-surface-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your courses, notes, or topics..."
            className="w-full bg-transparent text-xs sm:text-sm placeholder-surface-500 focus:outline-none text-white font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-surface-400 hover:text-white font-mono px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. Featured Hero Card (Exact Reference UI & Futuristic Animation) */}
      <div className="relative rounded-3xl overflow-hidden card-featured-hero p-6 sm:p-8 text-white shadow-2xl z-10">
        <div className="relative z-10 max-w-lg space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-[10px] font-mono font-black uppercase tracking-wider text-white">
            <Zap className="h-3 w-3 fill-current text-amber-300" />
            <span>FEATURED BATCH MODULE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
            Learn new things!
          </h2>

          <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-sm max-w-md">
            The premier tuition portal to master core concepts, solve DPPs, and excel in board & competitive exams.
          </p>

          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-black/95 hover:bg-black text-white text-xs font-black px-5 py-2.5 rounded-full shadow-2xl active:scale-95 transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current text-white" />
              <span>Play Lessons</span>
            </Link>
          </div>
        </div>

        {/* Floating 3D Graphic Tile on Right (Animated) */}
        <div className="absolute right-6 bottom-6 sm:bottom-8 sm:right-8 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl glass-float-tile flex items-center justify-center shadow-2xl animate-float">
              <GraduationCap className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-md stroke-[1.75]" />
            </div>
            {/* Sparkling Star Accent */}
            <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-300 text-black flex items-center justify-center text-[10px] font-bold shadow-lg shadow-amber-300/60">
              ✦
            </div>
          </div>
        </div>
      </div>

      {/* 4. Stream & Semester Filter (Commerce Tracks) */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {COMMERCE_PROGRAMS.map((prog) => {
            const isSelected = selectedProgram === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => handleProgramChange(prog.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? "bg-white text-black shadow-md shadow-white/20"
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

        {/* Semester Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedSemester("all")}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 text-[11px] font-semibold active:scale-95 ${
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
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 text-[11px] font-semibold active:scale-95 ${
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
      </div>

      {/* 5. Popular Courses (Exact Reference UI with vivid cards & smooth scaling) */}
      <div className="space-y-4 pt-1 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
            Popular Courses
          </h3>
          <Link
            href="/courses"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-8 text-center space-y-2">
            <GraduationCap className="h-8 w-8 text-surface-500 mx-auto" />
            <p className="text-sm font-bold text-white">No courses listed for {selectedProgram} yet</p>
            <p className="text-xs text-surface-400">Your faculty will publish study modules and batches soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="space-y-3">
                    {/* Top 3D Icon Box with glass effect */}
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span>{iconEmoji}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-base sm:text-lg text-white leading-snug drop-shadow-sm line-clamp-2">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 text-white/90 text-xs font-medium pt-0.5">
                        <BookOpen className="h-3.5 w-3.5 shrink-0" />
                        <span>{course.semester}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Tag on Left, Play Button on Right */}
                  <div className="pt-5 mt-4 border-t border-white/20 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white">
                      {course.code}
                    </span>

                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-1.5 bg-white text-black font-black text-xs px-4 py-2 rounded-full shadow-xl hover:bg-amber-300 transition-colors active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current text-black" />
                      <span>Play</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Study Materials & Scanner Solutions */}
      <div id="materials" className="space-y-4 pt-2 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-orange-400" />
              <span>Notes, Scanners & Audio Lectures</span>
            </h3>
            <p className="text-xs text-surface-400">
              Tap any item to launch watermarked encrypted preview session
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All" },
              { id: "pdf", label: "PDF Notes" },
              { id: "audio", label: "Audio Briefings" },
              { id: "image", label: "Ledger Charts" },
              { id: "text_note", label: "Revision" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  selectedType === tab.id
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                    : "bg-[#181516] text-surface-400 hover:text-white border border-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">No Study Materials Published Yet</p>
              <p className="text-xs text-surface-400 max-w-sm mx-auto">
                New lecture notes, PDF scanners, and audio lectures uploaded by the faculty will appear here immediately once published.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                userPlanRank={userPlanRank}
                onOpenPreview={handleOpenPreview}
                onUpgradePrompt={handleUpgradePrompt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Secure Viewer Modal */}
      <SecureViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        material={selectedMaterial}
        signedUrl={previewToken}
        watermarkText={watermarkText}
        sessionTraceId={sessionTraceId}
      />

      {/* Upgrade Pass Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Tuition Pass Clearance Required"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#181516] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Requires {targetUpgradeTier.toUpperCase()} Commerce Pass
              </h4>
              <p className="text-xs text-surface-300 leading-relaxed">
                This study scanner is restricted to verified students enrolled in the {targetUpgradeTier.toUpperCase()} batch. Update your pass to unlock this material.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsUpgradeModalOpen(false)}>
              Dismiss
            </Button>
            <Link href="/subscription">
              <button className="btn-mango px-4 py-2 rounded-full text-xs font-bold shadow-md">
                View Tuition Passes →
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}

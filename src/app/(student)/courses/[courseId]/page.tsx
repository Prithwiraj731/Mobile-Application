"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ArrowLeft, BookOpen, Sparkles, CheckCircle2, Play } from "lucide-react";
import { MOCK_COURSES, MOCK_MATERIALS, MOCK_USERS } from "@/lib/mock-data";
import { MaterialCard } from "@/components/student/MaterialCard";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { MaterialWithDetails } from "@/types";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const course = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
  const [selectedMaterial, setSelectedMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [watermarkText, setWatermarkText] = React.useState("");
  const [sessionTraceId, setSessionTraceId] = React.useState("");

  const [courseMaterials, setCourseMaterials] = React.useState<MaterialWithDetails[]>(MOCK_MATERIALS);

  React.useEffect(() => {
    fetch("/api/materials")
      .then((res) => res.json())
      .then((data) => {
        if (data.materials && data.materials.length > 0) {
          setCourseMaterials(data.materials);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenPreview = async (material: MaterialWithDetails) => {
    setSelectedMaterial(material);
    try {
      const res = await fetch(`/api/preview/${material.id}`);
      if (res.ok) {
        const data = await res.json();
        setWatermarkText(data.watermarkText || `Student • Session #SEC`);
        setSessionTraceId(data.sessionTraceId || "SEC-DEV");
      } else {
        const trace = `SEC-${Date.now().toString(36).toUpperCase()}`;
        setSessionTraceId(trace);
        setWatermarkText(`Student Session #${trace}`);
      }
    } catch {
      const trace = `SEC-${Date.now().toString(36).toUpperCase()}`;
      setSessionTraceId(trace);
    }
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-surface-400 font-medium">
        <Link href="/courses" className="hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Batches
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-surface-600" />
        <span className="text-white font-bold truncate">{course.title}</span>
      </div>

      {/* Course Banner */}
      <div className="rounded-3xl bg-[#1a1616]/90 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start shadow-2xl">
        <div className="w-full md:w-72 aspect-video rounded-2xl overflow-hidden shrink-0 bg-surface-950 shadow-lg relative">
          <img src={course.thumbnail_url || ""} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[10px] text-white border border-white/20 font-bold">
            {course.code}
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
              ● ENROLLED BATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">{course.title}</h1>
          <p className="text-xs sm:text-sm text-surface-300 leading-relaxed max-w-3xl">{course.description}</p>
        </div>
      </div>

      {/* Modules & Materials Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
          Structured Course Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              userPlanRank={2} // Pro tier clearance
              onOpenPreview={handleOpenPreview}
              onUpgradePrompt={() => alert("Please upgrade your plan to access this resource.")}
            />
          ))}
        </div>
      </div>

      {/* Secure Viewer Modal */}
      <SecureViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        material={selectedMaterial}
        watermarkText={watermarkText}
        sessionTraceId={sessionTraceId}
      />
    </div>
  );
}

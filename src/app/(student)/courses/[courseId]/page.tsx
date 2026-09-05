"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ArrowLeft, BookOpen, Sparkles, CheckCircle2, Play, RefreshCw, AlertCircle } from "lucide-react";
import { MaterialCard } from "@/components/student/MaterialCard";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { MaterialWithDetails } from "@/types";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = React.useState<any | null>(null);
  const [courseMaterials, setCourseMaterials] = React.useState<MaterialWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedMaterial, setSelectedMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [watermarkText, setWatermarkText] = React.useState("");
  const [sessionTraceId, setSessionTraceId] = React.useState("");

  React.useEffect(() => {
    if (!courseId) return;
    setIsLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found or unavailable.");
        return res.json();
      })
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
          setCourseMaterials(data.materials || []);
        } else {
          setError("Course not found.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load course.");
      })
      .finally(() => setIsLoading(false));
  }, [courseId]);

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

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="h-8 w-8 text-orange-400 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-surface-300">Loading course curriculum & notes...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-16 space-y-4 text-center">
        <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-10 max-w-md mx-auto space-y-3">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Course Not Found</h2>
          <p className="text-xs text-surface-400 leading-relaxed">
            The course you are looking for might have been updated or removed by the instructor.
          </p>
          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Batches</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <img
            src={course.thumbnail_url || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[10px] text-white border border-white/20 font-bold">
            {course.code}
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
              ● ENROLLED BATCH
            </span>
            <span className="text-xs font-mono text-orange-400 bg-surface-800 px-2.5 py-0.5 rounded-full border border-surface-700">
              {course.program} &bull; {course.semester}
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
          <span>Course Notes & Resources ({courseMaterials.length})</span>
        </h2>

        {courseMaterials.length === 0 ? (
          <div className="rounded-3xl bg-[#181516]/60 border border-white/5 p-10 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-surface-500 mx-auto" />
            <p className="text-sm font-bold text-white">No study materials published for this course yet</p>
            <p className="text-xs text-surface-400">Once uploaded by your faculty, PDFs, audios, and notes will appear here.</p>
          </div>
        ) : (
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
        )}
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

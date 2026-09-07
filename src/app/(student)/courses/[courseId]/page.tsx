"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, ArrowLeft, BookOpen, Sparkles, CheckCircle2, Play, RefreshCw, AlertCircle, Lock } from "lucide-react";
import { MaterialCard } from "@/components/student/MaterialCard";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { BackButton } from "@/components/ui/BackButton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MaterialWithDetails } from "@/types";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = React.useState<any | null>(null);
  const [courseMaterials, setCourseMaterials] = React.useState<MaterialWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [userPlanRank, setUserPlanRank] = React.useState<number>(1);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);
  const [targetUpgradeTier, setTargetUpgradeTier] = React.useState("pro");
  const [restrictedNotice, setRestrictedNotice] = React.useState<string | null>(null);

  const [selectedMaterial, setSelectedMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [previewToken, setPreviewToken] = React.useState<string | undefined>();
  const [watermarkText, setWatermarkText] = React.useState("");
  const [sessionTraceId, setSessionTraceId] = React.useState("");

  React.useEffect(() => {
    if (!courseId) return;
    setIsLoading(true);

    Promise.all([
      fetch(`/api/courses/${courseId}`).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Course not found or unavailable.");
        }
        return data;
      }),
      fetch("/api/auth/me").then((r) => r.json().catch(() => ({}))),
    ])
      .then(([courseData, meData]) => {
        if (courseData.course) {
          setCourse(courseData.course);
          setCourseMaterials(courseData.materials || []);
        } else {
          setError("Course not found.");
        }

        if (meData?.authenticated && meData?.profile) {
          const plan = (meData.profile.planCode || "FREE").toUpperCase();
          const rank = plan === "PREMIUM" || plan === "VIP" ? 3 : plan === "PRO" ? 2 : 1;
          setUserPlanRank(rank);
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
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setRestrictedNotice(
          data.error || "Access Restricted: You can only preview materials from your enrolled semester."
        );
        return;
      }

      if (data.signedUrl) {
        setPreviewToken(data.signedUrl);
        setWatermarkText(data.watermarkText || `Student • Pabir Paul Tuition • Session #SEC-LIVE`);
        setSessionTraceId(data.sessionTraceId || "SEC-DEV-TRACER");
        setIsViewerOpen(true);
      } else {
        setRestrictedNotice("Preview stream URL could not be generated.");
      }
    } catch {
      setRestrictedNotice("Network error initiating secure preview session.");
    }
  };

  const handleUpgradePrompt = (requiredLevel: string) => {
    setTargetUpgradeTier(requiredLevel);
    setIsUpgradeModalOpen(true);
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
    const isRestricted = error?.toLowerCase().includes("restricted");
    return (
      <div className="py-16 space-y-4 text-center">
        <div className="rounded-3xl bg-[#181516]/90 border border-white/10 p-8 sm:p-10 max-w-md mx-auto space-y-4 shadow-2xl">
          <AlertCircle className={`h-12 w-12 mx-auto ${isRestricted ? "text-amber-400" : "text-rose-400"}`} />
          <h2 className="text-xl font-black text-white">
            {isRestricted ? "Access Restricted" : "Course Not Found"}
          </h2>
          <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
            {error || "The course you are looking for might have been updated or removed by the instructor."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <BackButton fallbackHref="/courses" label="Back to Batches" />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors active:scale-95"
            >
              <span>Dashboard</span>
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
        <BackButton fallbackHref="/courses" variant="icon" label="Back to Batches" />
        <Link href="/courses" className="hover:text-white flex items-center gap-1.5 transition-colors">
          Batches
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

      {/* Batch Restriction Clearance Modal */}
      <Modal
        isOpen={!!restrictedNotice}
        onClose={() => setRestrictedNotice(null)}
        title="Batch Clearance Required"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#181516] border border-amber-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Semester Scoped Resource</h4>
              <p className="text-xs text-surface-300 leading-relaxed">
                {restrictedNotice}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setRestrictedNotice(null)}>
              Understand
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

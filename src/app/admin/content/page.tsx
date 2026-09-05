"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  FileText,
  Image as ImageIcon,
  Headphones,
  BookOpen,
  CheckCircle2,
  Lock,
  UploadCloud,
  Layers,
  Trash2,
  Eye,
  RefreshCw,
  Upload,
  AlertCircle,
  GraduationCap,
  ExternalLink,
  BookMarked,
  Filter,
} from "lucide-react";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { MaterialWithDetails, AccessLevel, MaterialType } from "@/types";
import { formatBytes } from "@/lib/utils/cn";

interface StoredCourseItem {
  id: string;
  title: string;
  slug: string;
  code: string;
  program: "BCOM" | "MCOM" | "CA" | "CMA";
  semester: string;
  description: string;
  thumbnail_url?: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = React.useState<"materials" | "courses">("materials");
  const [materials, setMaterials] = React.useState<MaterialWithDetails[]>([]);
  const [courses, setCourses] = React.useState<StoredCourseItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Material Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<MaterialType>("pdf");
  const [accessLevel, setAccessLevel] = React.useState<AccessLevel>("free");
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [selectedSemester, setSelectedSemester] = React.useState("Semester 1");
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>("NEW_CUSTOM");
  const [customCourseTitle, setCustomCourseTitle] = React.useState("");
  const [contentText, setContentText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Course Form State
  const [newCourseTitle, setNewCourseTitle] = React.useState("");
  const [newCourseCode, setNewCourseCode] = React.useState("");
  const [newCourseProgram, setNewCourseProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [newCourseSemester, setNewCourseSemester] = React.useState("Semester 1");
  const [newCourseDesc, setNewCourseDesc] = React.useState("");

  const activeProg = COMMERCE_PROGRAMS.find((p) => p.id === selectedProgram) || COMMERCE_PROGRAMS[0];
  const activeCourseProg = COMMERCE_PROGRAMS.find((p) => p.id === newCourseProgram) || COMMERCE_PROGRAMS[0];

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [matRes, courseRes] = await Promise.all([
        fetch("/api/materials?status=all"),
        fetch("/api/courses"),
      ]);

      const matData = await matRes.json();
      const courseData = await courseRes.json();

      if (matRes.ok && matData.materials) {
        setMaterials(matData.materials);
      }
      if (courseRes.ok && courseData.courses) {
        setCourses(courseData.courses);
      }
    } catch {
      setErrorMessage("Failed to load content and courses.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllData();
  }, []);

  // Filter courses relevant to current program in the upload modal
  const programCourses = courses.filter((c) => c.program === selectedProgram);

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Please provide a title for the material.");
      return;
    }

    // Validate course choice
    let finalCourseId = "";
    let finalCourseTitle = "";

    if (selectedCourseId !== "NEW_CUSTOM") {
      finalCourseId = selectedCourseId;
      const found = courses.find((c) => c.id === selectedCourseId);
      if (found) finalCourseTitle = found.title;
    } else {
      if (!customCourseTitle.trim()) {
        setErrorMessage("Please provide a Course or Subject Name.");
        return;
      }
      finalCourseTitle = customCourseTitle.trim();
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("type", type);
      formData.append("accessLevel", accessLevel);
      formData.append("program", selectedProgram);
      formData.append("semester", selectedSemester);
      formData.append("courseId", finalCourseId);
      formData.append("courseTitle", finalCourseTitle);
      formData.append("contentText", contentText);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/materials", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to upload material.");
        setIsSubmitting(false);
        return;
      }

      setFeedback(`Successfully published "${title}" for students.`);
      setTimeout(() => setFeedback(null), 4000);
      setIsUploadModalOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setContentText("");
      setSelectedFile(null);
      setType("pdf");
      setCustomCourseTitle("");
      setSelectedCourseId("NEW_CUSTOM");

      // Reload fresh data to capture created course & material
      await fetchAllData();
    } catch {
      setErrorMessage("Network error uploading material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      setErrorMessage("Course title is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourseTitle.trim(),
          code: newCourseCode.trim() || undefined,
          program: newCourseProgram,
          semester: newCourseSemester,
          description: newCourseDesc.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create course.");
        setIsSubmitting(false);
        return;
      }

      setFeedback(`Course "${newCourseTitle}" created successfully.`);
      setTimeout(() => setFeedback(null), 4000);
      setIsCourseModalOpen(false);

      // Reset
      setNewCourseTitle("");
      setNewCourseCode("");
      setNewCourseDesc("");

      // Refresh
      await fetchAllData();
    } catch {
      setErrorMessage("Failed to create course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (id: string, matTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${matTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/materials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        setFeedback("Material deleted successfully.");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setErrorMessage(data.error || "Failed to delete material.");
      }
    } catch {
      setErrorMessage("Error deleting material.");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/materials/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok && data.material) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === id ? data.material : m))
        );
        setFeedback(data.message || "Material status updated.");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setErrorMessage(data.error || "Failed to update material.");
      }
    } catch {
      setErrorMessage("Error updating material status.");
    }
  };

  const handleDeleteCourse = async (id: string, courseTitle: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the course "${courseTitle}"? Note: Materials attached will remain in the library.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        setFeedback("Course deleted successfully.");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setErrorMessage(data.error || "Failed to delete course.");
      }
    } catch {
      setErrorMessage("Error deleting course.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              CONTENT REPOSITORY & CURRICULUM
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Study Material Library & Courses
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Upload PDF notes, lecture audios, revision summaries, and organize batches for enrolled students.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="btn-secondary px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
            title="Refresh library"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsCourseModalOpen(true)}
            className="px-3.5 py-2 bg-surface-800 hover:bg-surface-700 border border-surface-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <BookMarked className="h-4 w-4 text-orange-400" />
            <span>Add Course / Batch</span>
          </button>

          <button
            onClick={() => {
              if (courses.length > 0 && selectedCourseId === "NEW_CUSTOM") {
                setSelectedCourseId(courses[0].id);
              }
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-surface-800 pb-3">
        <button
          onClick={() => setActiveTab("materials")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "materials"
              ? "bg-orange-600/15 border border-orange-500/40 text-orange-400 shadow-sm"
              : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/40"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Study Materials ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "courses"
              ? "bg-orange-600/15 border border-orange-500/40 text-orange-400 shadow-sm"
              : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/40"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Courses & Batches ({courses.length})</span>
        </button>
      </div>

      {/* TAB 1: MATERIALS TABLE */}
      {activeTab === "materials" && (
        <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
                <tr>
                  <th className="px-5 py-3">Material Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Course / Batch</th>
                  <th className="px-5 py-3">Tier Access</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">File / Storage</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-surface-500">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-orange-400" />
                      <span>Loading materials library...</span>
                    </td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-surface-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-surface-600" />
                      <p className="font-semibold text-surface-300">No study materials uploaded yet.</p>
                      <p className="text-[11px] mt-1 text-surface-500">
                        Click &quot;Upload New Material&quot; above to upload your first PDF note, audio lecture, or summary.
                      </p>
                    </td>
                  </tr>
                ) : (
                  materials.map((mat) => {
                    const courseTitle =
                      (mat.topic as any)?.chapter?.subject?.course?.title ||
                      (mat.topic as any)?.chapter?.subject?.title ||
                      "Coursework";
                    const batchTitle = (mat.topic as any)?.title || "Batch Resource";

                    return (
                      <tr key={mat.id} className="hover:bg-surface-800/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-white truncate max-w-xs">{mat.title}</div>
                          <div className="text-[11px] text-surface-400 truncate max-w-xs">
                            {mat.description || "No description"}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-200 border border-surface-700 font-semibold inline-flex items-center gap-1">
                            {mat.type === "pdf" && <FileText className="h-3 w-3 text-rose-400" />}
                            {mat.type === "audio" && <Headphones className="h-3 w-3 text-sky-400" />}
                            {mat.type === "text_note" && <BookOpen className="h-3 w-3 text-amber-400" />}
                            {mat.type === "image" && <ImageIcon className="h-3 w-3 text-emerald-400" />}
                            <span>{mat.type.replace("_", " ")}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-surface-200 truncate max-w-[180px]">
                            {courseTitle}
                          </div>
                          <div className="text-[10px] text-surface-400">
                            {batchTitle}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {mat.access_level === "free" && <Badge variant="free">Free Tier</Badge>}
                          {mat.access_level === "pro" && <Badge variant="pro">Pro Plan</Badge>}
                          {mat.access_level === "premium" && <Badge variant="premium">VIP Master</Badge>}
                        </td>
                        <td className="px-5 py-3.5">
                          {mat.status === "published" ? (
                            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                              ● Published
                            </span>
                          ) : (
                            <span className="text-surface-500 font-mono text-[11px]">○ Archived</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-surface-400 truncate max-w-[140px]">
                          {mat.file?.original_filename || (mat.type === "text_note" ? "Revision Note" : "Standard File")}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/materials/${mat.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                              title="Preview student view"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <Button
                              variant={mat.status === "published" ? "outline" : "secondary"}
                              size="sm"
                              onClick={() => handleTogglePublish(mat.id)}
                              className="text-[11px] h-7 px-2"
                            >
                              {mat.status === "published" ? "Archive" : "Publish"}
                            </Button>

                            <button
                              onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                              title="Delete material"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES & BATCHES */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-surface-300">
                <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
                  <tr>
                    <th className="px-5 py-3">Course / Subject</th>
                    <th className="px-5 py-3">Stream</th>
                    <th className="px-5 py-3">Semester / Group</th>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Attached Materials</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-surface-500">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-orange-400" />
                        <span>Loading courses...</span>
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-surface-500">
                        <GraduationCap className="h-8 w-8 mx-auto mb-2 text-surface-600" />
                        <p className="font-semibold text-surface-300">No courses created yet.</p>
                        <p className="text-[11px] mt-1 text-surface-500">
                          Click &quot;Add Course / Batch&quot; or upload study materials to start organizing your curriculum.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => {
                      const attachedCount = materials.filter(
                        (m) =>
                          (m.topic as any)?.chapter?.subject?.course_id === course.id ||
                          (m.topic as any)?.chapter?.subject?.course?.id === course.id ||
                          (m.topic as any)?.chapter?.subject?.title?.toLowerCase() === course.title.toLowerCase()
                      ).length;

                      return (
                        <tr key={course.id} className="hover:bg-surface-800/40 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-white">{course.title}</div>
                            <div className="text-[11px] text-surface-400 line-clamp-1">
                              {course.description}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-800 text-orange-400 font-bold border border-surface-700">
                              {course.program}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-surface-200">
                            {course.semester}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-[11px] text-surface-400">
                            {course.code}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-[11px] text-surface-300">
                            <span className="px-2 py-0.5 rounded-full bg-surface-800 border border-surface-700">
                              {attachedCount} materials
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/courses/${course.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                                title="View student course page"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                                title="Delete course"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upload Material Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Publish Study Material"
        description="Upload lecture audio recordings, PDF notes, scanner sheets, or write revision summaries for students."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          {/* Material Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-surface-300 font-mono">
              Material Format *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "pdf", label: "PDF Scanner", icon: FileText },
                { id: "audio", label: "Audio Class", icon: Headphones },
                { id: "text_note", label: "Revision Note", icon: BookOpen },
                { id: "image", label: "Diagram / Sheet", icon: ImageIcon },
              ].map((t) => {
                const isSelected = type === t.id;
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setType(t.id as MaterialType);
                      setSelectedFile(null);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold active:scale-95 ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/20 text-white shadow-md shadow-orange-500/20"
                        : "border-surface-800 bg-surface-950 text-surface-400 hover:border-surface-700 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Material Title *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Financial Management - Capital Budgeting Practice Notes"
          />

          <Input
            label="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of problems, topics, and references covered"
          />

          {/* Academic Stream and Semester Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Academic Stream *
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => {
                  const prog = e.target.value as any;
                  setSelectedProgram(prog);
                  const pObj = COMMERCE_PROGRAMS.find((p) => p.id === prog);
                  if (pObj && pObj.semestersOrGroups.length > 0) {
                    setSelectedSemester(pObj.semestersOrGroups[0]);
                  }
                }}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {COMMERCE_PROGRAMS.map((prog) => (
                  <option key={prog.id} value={prog.id} className="bg-surface-900">
                    {prog.name} - {prog.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Target Semester / Group *
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {activeProg.semestersOrGroups.map((sem) => (
                  <option key={sem} value={sem} className="bg-surface-900">
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course / Subject Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-surface-300 font-mono">
              Course / Subject Curriculum *
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              {programCourses.length > 0 && (
                <optgroup label={`Existing ${selectedProgram} Courses`}>
                  {programCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.semester})
                    </option>
                  ))}
                </optgroup>
              )}
              {courses.filter((c) => c.program !== selectedProgram).length > 0 && (
                <optgroup label="Other Courses">
                  {courses
                    .filter((c) => c.program !== selectedProgram)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.program}] {c.title}
                      </option>
                    ))}
                </optgroup>
              )}
              <option value="NEW_CUSTOM">+ Enter New Course / Subject Name</option>
            </select>

            {selectedCourseId === "NEW_CUSTOM" && (
              <div className="mt-2 animate-in fade-in">
                <Input
                  label="Enter Course / Subject Name *"
                  required
                  value={customCourseTitle}
                  onChange={(e) => setCustomCourseTitle(e.target.value)}
                  placeholder="e.g. Corporate Accounting & Auditing"
                />
              </div>
            )}
          </div>

          {/* Access Tier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-surface-300 font-mono">
              Student Access Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "free", label: "Free (All Students)" },
                { id: "pro", label: "Pro Plan Only" },
                { id: "premium", label: "VIP Masterclass" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setAccessLevel(tier.id as AccessLevel)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    accessLevel === tier.id
                      ? "border-orange-500 bg-orange-500/15 text-white"
                      : "border-surface-800 bg-surface-950 text-surface-400 hover:text-white"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* If Text Note: Rich textarea */}
          {type === "text_note" ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Revision Note Content (Markdown / Text) *
              </label>
              <textarea
                rows={6}
                required
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Write your study notes, key formulas, journal entry principles, and exam questions here..."
                className="w-full bg-surface-950 border border-surface-800 rounded-xl p-3 text-xs text-white placeholder-surface-600 focus:outline-none focus:border-orange-500 font-sans leading-relaxed"
              />
            </div>
          ) : (
            /* File Upload Input */
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Attach File ({type.toUpperCase()})
              </label>
              <div className="border-2 border-dashed border-surface-800 rounded-2xl p-4 sm:p-6 text-center hover:border-orange-500/50 transition-colors bg-surface-950">
                <UploadCloud className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept={
                    type === "pdf"
                      ? ".pdf,application/pdf"
                      : type === "audio"
                      ? "audio/*,.mp3,.wav,.m4a,.aac"
                      : "image/*"
                  }
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-white text-xs font-bold active:scale-95 transition-all"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{selectedFile ? "Change File" : `Browse ${type.toUpperCase()} File`}</span>
                </label>
                {selectedFile ? (
                  <p className="mt-2 text-xs font-mono text-emerald-400">
                    Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-surface-500">
                    Supports {type === "pdf" ? ".pdf files" : type === "audio" ? ".mp3, .wav audio recordings" : ".png, .jpg images"} (Up to 50MB)
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Publishing material...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish to Portal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Add New Course or Batch"
        description="Create a dedicated course subject or batch to categorize upcoming lecture notes and PDFs."
        maxWidth="md"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <Input
            label="Course / Subject Title *"
            required
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="e.g. Financial Management & Capital Budgeting"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Stream *
              </label>
              <select
                value={newCourseProgram}
                onChange={(e) => {
                  const prog = e.target.value as any;
                  setNewCourseProgram(prog);
                  const pObj = COMMERCE_PROGRAMS.find((p) => p.id === prog);
                  if (pObj && pObj.semestersOrGroups.length > 0) {
                    setNewCourseSemester(pObj.semestersOrGroups[0]);
                  }
                }}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {COMMERCE_PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-surface-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Semester / Group *
              </label>
              <select
                value={newCourseSemester}
                onChange={(e) => setNewCourseSemester(e.target.value)}
                className="w-full bg-surface-950 border border-surface-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {activeCourseProg.semestersOrGroups.map((s) => (
                  <option key={s} value={s} className="bg-surface-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Course Code (Optional)"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            placeholder="e.g. BCOM-SEM3-FM"
          />

          <Input
            label="Short Description"
            value={newCourseDesc}
            onChange={(e) => setNewCourseDesc(e.target.value)}
            placeholder="Brief description of the syllabus covered"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCourseModalOpen(false)}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Creating...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Create Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";

import * as React from "react";
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
} from "lucide-react";
import { MOCK_MATERIALS, MOCK_COURSES } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { MaterialWithDetails, AccessLevel, MaterialType } from "@/types";
import { formatBytes } from "@/lib/utils/cn";

export default function AdminContentPage() {
  const [materials, setMaterials] = React.useState<MaterialWithDetails[]>(MOCK_MATERIALS);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<MaterialType>("pdf");
  const [accessLevel, setAccessLevel] = React.useState<AccessLevel>("free");
  const [courseId, setCourseId] = React.useState(MOCK_COURSES[0].id);
  const [contentText, setContentText] = React.useState("");
  const [filename, setFilename] = React.useState("Chapter_Derivation_Guide.pdf");

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();

    const newMat: MaterialWithDetails = {
      id: `m-custom-${Date.now()}`,
      topic_id: "t0000001-0000-0000-0000-000000000001",
      title,
      description,
      type,
      access_level: accessLevel,
      status: "published",
      order_index: materials.length + 1,
      content_text: type === "text_note" ? contentText : null,
      created_by_admin_id: "u-admin-001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      topic: {
        id: "t0000001-0000-0000-0000-000000000001",
        chapter_id: "ch000001-0000-0000-0000-000000000001",
        title: "General Dynamics",
        slug: "general-dynamics",
        description: "",
        order_index: 1,
        created_at: "",
        updated_at: "",
        chapter: {
          id: "ch000001-0000-0000-0000-000000000001",
          subject_id: "s0000001-0000-0000-0000-000000000001",
          title: "Mechanics",
          slug: "mechanics",
          description: "",
          order_index: 1,
          created_at: "",
          updated_at: "",
          subject: {
            id: "s0000001-0000-0000-0000-000000000001",
            course_id: courseId,
            title: "Physics",
            slug: "physics",
            description: "",
            order_index: 1,
            created_at: "",
            updated_at: "",
            course: MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0],
          },
        },
      },
      file:
        type !== "text_note"
          ? {
              id: `f-custom-${Date.now()}`,
              material_id: `m-custom-${Date.now()}`,
              bucket_name: "study-materials",
              file_path: `uploads/${filename}`,
              original_filename: filename,
              mime_type: type === "pdf" ? "application/pdf" : type === "image" ? "image/png" : "audio/mpeg",
              size_bytes: 2500000,
              checksum_sha256: null,
              page_count: type === "pdf" ? 12 : null,
              duration_seconds: type === "audio" ? 900 : null,
              created_at: new Date().toISOString(),
            }
          : null,
    };

    setMaterials([newMat, ...materials]);
    setIsUploadModalOpen(false);
    setFeedback(`Published "${title}" to private storage under ${accessLevel.toUpperCase()} tier.`);
    setTimeout(() => setFeedback(null), 4000);

    // Reset
    setTitle("");
    setDescription("");
  };

  const handleTogglePublish = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "published" ? ("archived" as const) : ("published" as const) }
          : m
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              CONTENT REPOSITORY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Study Material Library & Uploads
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Publish encrypted PDFs, schematics, and audio lectures directly to the private <code className="text-surface-200">study-materials</code> bucket
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Study Material
        </Button>
      </div>

      {feedback && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Materials Table */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
              <tr>
                <th className="px-5 py-3">Material Title</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Course / Chapter</th>
                <th className="px-5 py-3">Tier Access</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Storage Key</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {materials.map((mat) => (
                <tr key={mat.id} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white truncate max-w-xs">{mat.title}</div>
                    <div className="text-[11px] text-surface-400 truncate max-w-xs">{mat.description}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-200 border border-surface-700 font-semibold">
                      {mat.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-surface-200">
                      {(mat.topic as any)?.chapter?.subject?.course?.title || "Advanced Academics"}
                    </div>
                    <div className="text-[10px] text-surface-400">
                      {(mat.topic as any)?.chapter?.title || "Rotational Mechanics"}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {mat.access_level === "free" && <Badge variant="free">Free Tier</Badge>}
                    {mat.access_level === "pro" && <Badge variant="pro">Pro Plan</Badge>}
                    {mat.access_level === "premium" && <Badge variant="premium">Premium VIP</Badge>}
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
                    {mat.file?.file_path || "text/database"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant={mat.status === "published" ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleTogglePublish(mat.id)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      {mat.status === "published" ? "Archive" : "Publish"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Material Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Add & Encrypt Study Material"
        description="Configure metadata and upload to private object storage. Files are never publicly exposed."
        maxWidth="xl"
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          <Input
            label="Material Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Maxwell's Equations & Relativistic Field Notes"
          />

          <Input
            label="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of derivations and topic coverage"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-surface-300">Material Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="w-full h-9 rounded-md border border-surface-800 bg-surface-900 px-3 text-xs text-surface-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="pdf">PDF Document</option>
                <option value="image">Image Schematic</option>
                <option value="audio">Audio Briefing</option>
                <option value="text_note">Structured Text Note</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-surface-300">Access Level</label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                className="w-full h-9 rounded-md border border-surface-800 bg-surface-900 px-3 text-xs text-surface-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="free">Free Tier</option>
                <option value="pro">Pro Scholar Tier</option>
                <option value="premium">Premium Master VIP</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-surface-300">Assign Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-9 rounded-md border border-surface-800 bg-surface-900 px-3 text-xs text-surface-100 focus:outline-none focus:border-indigo-500"
            >
              {MOCK_COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {type === "text_note" ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-surface-300">Study Note Text</label>
              <textarea
                rows={5}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Write formatted markdown notes..."
                className="w-full rounded-md border border-surface-800 bg-surface-900 p-3 text-xs text-surface-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-surface-300">Target File</label>
              <div className="border-2 border-dashed border-surface-800 rounded-xl p-6 text-center bg-surface-950/60 hover:border-indigo-500/40 transition-colors">
                <UploadCloud className="h-8 w-8 text-indigo-400 mx-auto" />
                <p className="text-xs font-semibold text-white mt-2">
                  Drop {type.toUpperCase()} file to encrypt and upload
                </p>
                <p className="text-[10px] text-surface-500 mt-1 font-mono">
                  Destination: supabase://storage/study-materials (Private)
                </p>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="mt-3 w-64 text-center bg-surface-900 border border-surface-800 text-xs px-2 py-1 rounded text-surface-300 font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-800">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Encrypt & Publish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

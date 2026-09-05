"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { MaterialWithDetails } from "@/types";

export default function StandaloneMaterialPage() {
  const params = useParams();
  const materialId = params.materialId as string;

  const [material, setMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isViewerOpen, setIsViewerOpen] = React.useState(true);
  const [watermarkText, setWatermarkText] = React.useState("");
  const [sessionTraceId, setSessionTraceId] = React.useState("");

  React.useEffect(() => {
    const fetchMaterial = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/materials");
        const data = await res.json();
        if (res.ok && Array.isArray(data.materials)) {
          const found = data.materials.find((m: MaterialWithDetails) => m.id === materialId);
          if (found) {
            setMaterial(found);
            const trace = `SEC-${Date.now().toString(36).toUpperCase()}`;
            setSessionTraceId(trace);
            setWatermarkText(`Verified Student • Debraj Tuition • ${new Date().toLocaleDateString()} • Session #${trace}`);
          }
        }
      } catch {
        // Handle fetch error
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-3">
        <RefreshCw className="h-6 w-6 animate-spin text-orange-400 mx-auto" />
        <p className="text-xs text-surface-400">Loading study material...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard" className="text-xs text-surface-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
        <div className="p-12 text-center rounded-3xl border border-white/5 bg-[#181516] space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Study Material Not Found</h2>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            The requested study material may have been archived or removed by the instructor.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all active:scale-95"
          >
            Go to Course Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-xs text-surface-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      <SecureViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        material={material}
        watermarkText={watermarkText}
        sessionTraceId={sessionTraceId}
      />

      {!isViewerOpen && (
        <div className="p-12 text-center rounded-3xl border border-white/5 bg-[#181516] space-y-4">
          <Shield className="h-10 w-10 text-orange-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Preview Viewer Closed</h2>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            Click below to reopen the secure watermarked study session.
          </p>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold active:scale-95 transition-all"
          >
            Reopen Secure Preview
          </button>
        </div>
      )}
    </div>
  );
}

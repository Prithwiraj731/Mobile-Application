"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Shield, AlertCircle, RefreshCw } from "lucide-react";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { BackButton } from "@/components/ui/BackButton";
import { MaterialWithDetails } from "@/types";

export default function StandaloneMaterialPage() {
  const params = useParams();
  const materialId = params.materialId as string;

  const [material, setMaterial] = React.useState<MaterialWithDetails | null>(null);
  const [previewToken, setPreviewToken] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(true);
  const [watermarkText, setWatermarkText] = React.useState("");
  const [sessionTraceId, setSessionTraceId] = React.useState("");

  React.useEffect(() => {
    if (!materialId) return;

    const fetchMaterial = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/preview/${materialId}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || "Failed to authorize preview.");
          setIsLoading(false);
          return;
        }

        if (data.material) {
          setMaterial(data.material);
          setPreviewToken(data.signedUrl);
          setWatermarkText(data.watermarkText || `Student • Pabir Paul Tuition • Session #SEC-LIVE`);
          setSessionTraceId(data.sessionTraceId || "SEC-DEV-TRACER");
        } else {
          setError("Study material details could not be found.");
        }
      } catch (err: any) {
        setError(err.message || "Network error loading study material.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (isLoading) {
    return (
      <div className="p-16 text-center space-y-3">
        <RefreshCw className="h-7 w-7 animate-spin text-orange-400 mx-auto" />
        <p className="text-xs text-surface-400 font-medium">Securing and preparing watermarked session...</p>
      </div>
    );
  }

  if (error || !material) {
    const isRestricted = error?.toLowerCase().includes("restricted");
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-start">
          <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="p-10 text-center rounded-3xl border border-white/10 bg-[#181516]/90 space-y-4 max-w-lg mx-auto shadow-2xl">
          <AlertCircle className={`h-12 w-12 mx-auto ${isRestricted ? "text-amber-400" : "text-rose-400"}`} />
          <h2 className="text-lg font-bold text-white">
            {isRestricted ? "Batch Access Restricted" : "Study Material Not Found"}
          </h2>
          <p className="text-xs sm:text-sm text-surface-300 max-w-md mx-auto leading-relaxed">
            {error || "The requested study material may have been archived or removed by the instructor."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <BackButton fallbackHref="/dashboard" label="Go Back" />
            <Link
              href="/dashboard"
              className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-lg"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
      </div>

      <SecureViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        material={material}
        signedUrl={previewToken}
        watermarkText={watermarkText}
        sessionTraceId={sessionTraceId}
      />

      {!isViewerOpen && (
        <div className="p-12 text-center rounded-3xl border border-white/5 bg-[#181516] space-y-4 max-w-lg mx-auto">
          <Shield className="h-10 w-10 text-orange-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Preview Viewer Closed</h2>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            Click below to reopen the secure watermarked study session for {material.title}.
          </p>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold active:scale-95 transition-all shadow-md"
          >
            Reopen Secure Preview
          </button>
        </div>
      )}
    </div>
  );
}

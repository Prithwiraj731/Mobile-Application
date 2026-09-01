"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Shield, Lock, AlertTriangle } from "lucide-react";
import { MOCK_MATERIALS, MOCK_USERS } from "@/lib/mock-data";
import { SecureViewerModal } from "@/components/secure-viewer/SecureViewerModal";
import { MaterialCard } from "@/components/student/MaterialCard";
import { MaterialWithDetails } from "@/types";

export default function StandaloneMaterialPage() {
  const params = useParams();
  const materialId = params.materialId as string;

  const material = MOCK_MATERIALS.find((m) => m.id === materialId) || MOCK_MATERIALS[0];
  const [isViewerOpen, setIsViewerOpen] = React.useState(true);

  const student = MOCK_USERS[1];
  const trace = `SEC-${Date.now().toString(36).toUpperCase()}`;
  const watermarkText = `${student.full_name} • ${student.email} • ${new Date().toLocaleDateString()} • Session #${trace}`;

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
        sessionTraceId={trace}
      />

      {!isViewerOpen && (
        <div className="p-12 text-center rounded-xl border border-surface-800 bg-surface-900/60 space-y-4">
          <Shield className="h-10 w-10 text-indigo-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Preview Viewer Closed</h2>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            Click below to reopen the secure watermarked study session.
          </p>
          <button
            onClick={() => setIsViewerOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            Reopen Secure Preview
          </button>
        </div>
      )}
    </div>
  );
}

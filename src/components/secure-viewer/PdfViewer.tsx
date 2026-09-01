"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from "lucide-react";
import { MaterialWithDetails } from "@/types";

export interface PdfViewerProps {
  material: MaterialWithDetails;
  signedUrl?: string;
  watermarkText: string;
}

export function PdfViewer({ material, signedUrl, watermarkText }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const totalPages = material.file?.page_count || 6;

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleZoomIn = () => setZoomLevel((z) => Math.min(175, z + 25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 25));

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 secure-protected-area">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-surface-900 border-b border-surface-800 text-xs text-surface-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-surface-950 px-2.5 py-1 rounded-lg border border-surface-800">
            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-surface-200 truncate max-w-[140px] sm:max-w-[220px]">
              {material.file?.original_filename || material.title}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-surface-950 px-2 py-0.5 rounded-lg border border-surface-800">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 hover:text-white disabled:opacity-30 active:scale-95"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono px-1.5 text-surface-200 text-[11px]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 hover:text-white disabled:opacity-30 active:scale-95"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-950 px-1.5 py-0.5 rounded-lg border border-surface-800">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 75}
              className="p-1 hover:text-white disabled:opacity-30 active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono px-1 text-[10px] text-surface-200">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 175}
              className="p-1 hover:text-white disabled:opacity-30 active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            ● ENCRYPTED PREVIEW
          </span>
        </div>
      </div>

      {/* Main Document Canvas Stage */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-surface-950/80">
        <div
          className="relative bg-white text-zinc-900 rounded shadow-2xl transition-all duration-200 overflow-hidden border border-zinc-300"
          style={{
            width: `${(600 * zoomLevel) / 100}px`,
            minHeight: `${(850 * zoomLevel) / 100}px`,
            transformOrigin: "top center",
          }}
        >
          {/* Simulated High-Fidelity Academic PDF Document Page */}
          <div className="p-6 sm:p-12 text-zinc-900 space-y-6 select-none font-serif">
            {/* Document Header */}
            <div className="border-b-2 border-zinc-900 pb-4">
              <div className="flex justify-between items-baseline text-xs font-sans text-zinc-500 uppercase tracking-widest">
                <span className="font-bold text-indigo-950">Pabir Paul&apos;s Tuition</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <h1 className="text-xl font-bold text-zinc-900 mt-2 font-sans tracking-tight">
                {material.title}
              </h1>
              <p className="text-xs font-sans text-zinc-600 mt-1">
                Batch Module: {(material.topic as any)?.chapter?.subject?.course?.title || "Physics & Advanced Science"}
              </p>
            </div>

            {/* Academic Content Sections based on page */}
            {currentPage === 1 && (
              <div className="space-y-4 text-sm leading-relaxed text-zinc-800">
                <h2 className="text-base font-bold font-sans text-indigo-950 border-l-4 border-indigo-600 pl-2">
                  1. Fundamental Principles & Governing Equations
                </h2>
                <p>
                  In this chapter, we develop the generalized equations of motion for complex mechanical systems.
                  The fundamental formulation begins with D’Alembert’s principle, transforming dynamic equilibrium into a virtual work framework.
                </p>
                <div className="my-4 p-4 bg-zinc-100 rounded border border-zinc-300 font-mono text-xs text-zinc-900 space-y-2">
                  <p className="font-semibold text-zinc-700">{"// Virtual Work & Kinetic Momentum Integral:"}</p>
                  <p className="text-indigo-900 font-bold">{"delta W = sum_{i=1}^N ( F_i - dp_i/dt ) * delta r_i = 0"}</p>
                  <p className="text-zinc-600">{"Where p_i = m_i * v_i represents conjugate linear momentum."}</p>
                </div>
                <p>
                  By expressing spatial coordinates in generalized coordinates q_j, non-conservative constraint forces vanish under holonomic constraints, yielding the canonical Euler-Lagrange equations:
                </p>
                <div className="my-3 p-3 bg-indigo-50/70 rounded border border-indigo-200 font-mono text-xs text-indigo-950 text-center font-bold">
                  {"d/dt [ dL / d(dq_j/dt) ] - dL / dq_j = Q_j^(non-cons)"}
                </div>
              </div>
            )}

            {currentPage === 2 && (
              <div className="space-y-4 text-sm leading-relaxed text-zinc-800">
                <h2 className="text-base font-bold font-sans text-indigo-950 border-l-4 border-indigo-600 pl-2">
                  2. Inertia Tensors and Rotational Invariance
                </h2>
                <p>
                  For three-dimensional rigid body mechanics, the angular momentum vector L is related to angular velocity omega through the symmetric second-rank Inertia Tensor I:
                </p>
                <div className="my-4 p-4 bg-zinc-100 rounded border border-zinc-300 font-mono text-xs text-zinc-900">
                  <p className="font-bold text-center">{"I = [ I_xx, -I_xy, -I_xz; -I_yx, I_yy, -I_yz; -I_zx, -I_zy, I_zz ]"}</p>
                </div>
                <p>
                  The diagonal elements represent principal moments of inertia along the orthogonal body axes. Precession torque is governed by Euler’s rotational equations:
                </p>
                <ul className="list-disc list-inside space-y-1 font-sans text-xs text-zinc-700 pl-2">
                  <li>{"I_1 * d(omega_1)/dt - (I_2 - I_3) * omega_2 * omega_3 = tau_1"}</li>
                  <li>{"I_2 * d(omega_2)/dt - (I_3 - I_1) * omega_3 * omega_1 = tau_2"}</li>
                  <li>{"I_3 * d(omega_3)/dt - (I_1 - I_2) * omega_1 * omega_2 = tau_3"}</li>
                </ul>
              </div>
            )}

            {currentPage >= 3 && (
              <div className="space-y-4 text-sm leading-relaxed text-zinc-800">
                <h2 className="text-base font-bold font-sans text-indigo-950 border-l-4 border-indigo-600 pl-2">
                  {"3. Analytical Problems & Worked Demonstrations (Part " + (currentPage - 2) + ")"}
                </h2>
                <p>
                  Consider a symmetric spinning gyroscope with principal moment I_3 along its symmetry axis, subjected to a gravitational torque tau = r x m*g.
                </p>
                <div className="my-4 p-4 bg-zinc-50 rounded border border-zinc-200 font-mono text-xs text-zinc-800">
                  <p className="font-semibold text-emerald-800">{"// Steady Precession Frequency:"}</p>
                  <p className="mt-1 font-bold">{"Omega_p = (M * g * R) / (I_3 * omega_s * cos(theta))"}</p>
                </div>
                <p className="text-xs font-sans text-zinc-600">
                  Notice that as the spin frequency omega_s approaches infinity, the precession rate asymptotically decreases, demonstrating rotational gyroscopic stability.
                </p>
              </div>
            )}

            {/* Document Footer */}
            <div className="pt-8 border-t border-zinc-200 text-[10px] font-sans text-zinc-500 flex justify-between">
              <span>CONFIDENTIAL STUDY MATERIAL • DO NOT DISTRIBUTE</span>
              <span className="font-bold">PABIR PAUL&apos;S TUITION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

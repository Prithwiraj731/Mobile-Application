"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Download, RefreshCw } from "lucide-react";
import { MaterialWithDetails } from "@/types";
import { downloadMaterialFile } from "@/lib/utils/download-helper";

export interface PdfViewerProps {
  material: MaterialWithDetails;
  signedUrl?: string;
  watermarkText: string;
}

export function PdfViewer({ material, signedUrl }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const totalPages = material.file?.page_count || 6;

  const isRealPdf = Boolean(signedUrl && (signedUrl.endsWith(".pdf") || signedUrl.includes("/uploads/")));

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleZoomIn = () => setZoomLevel((z) => Math.min(175, z + 25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 25));

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadMaterialFile(
        material.id,
        material.file?.original_filename || `${material.title}.pdf`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 secure-protected-area">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-surface-900 border-b border-surface-800 text-xs text-surface-300">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-surface-950 px-2.5 py-1 rounded-lg border border-surface-800">
            <FileText className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="font-medium text-surface-200 truncate max-w-[140px] sm:max-w-[220px]">
              {material.file?.original_filename || material.title}
            </span>
          </div>

          {!isRealPdf && (
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
          )}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          {!isRealPdf && (
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
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all disabled:opacity-50"
            title="Download PDF"
          >
            {isDownloading ? (
              <RefreshCw className="h-3 w-3 animate-spin text-white" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            <span>{isDownloading ? "Downloading..." : "Download"}</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            ● AUTHORIZED
          </span>
        </div>
      </div>

      {/* Main Document Canvas Stage */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-surface-950/80">
        {isRealPdf && signedUrl ? (
          <iframe
            src={`${signedUrl}#view=FitH`}
            title={material.title}
            className="w-full h-full min-h-[500px] rounded-lg border border-surface-800 bg-white"
          />
        ) : (
          <div
            className="relative bg-white text-zinc-900 rounded shadow-2xl transition-all duration-200 overflow-hidden border border-zinc-300"
            style={{
              width: `${(600 * zoomLevel) / 100}px`,
              minHeight: `${(850 * zoomLevel) / 100}px`,
              transformOrigin: "top center",
            }}
          >
            {/* Academic Commerce Syllabus & Notes Canvas */}
            <div className="p-6 sm:p-12 text-zinc-900 space-y-6 select-none font-serif">
              {/* Document Header */}
              <div className="border-b-2 border-zinc-900 pb-4">
                <div className="flex justify-between items-baseline text-xs font-sans text-zinc-500 uppercase tracking-widest">
                  <span className="font-bold text-orange-900">Pabir Paul&apos;s Tuition</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 mt-2 font-sans tracking-tight">
                  {material.title}
                </h1>
                <p className="text-xs font-sans text-zinc-600 mt-1">
                  Batch: {(material.topic as any)?.chapter?.subject?.course?.title || "Commerce Professional Study"} • Access: {material.access_level.toUpperCase()}
                </p>
              </div>

              {/* Dynamic Pages */}
              {currentPage === 1 && (
                <div className="space-y-4 text-sm leading-relaxed text-zinc-800">
                  <h2 className="text-base font-bold font-sans text-orange-950 border-l-4 border-orange-600 pl-2">
                    1. Fundamental Principles & Concepts
                  </h2>
                  <p>
                    {material.description ||
                      "Detailed examination of core theoretical framework, valuation mechanisms, accounting treatment, and statutory provisions."}
                  </p>
                  <div className="my-4 p-4 bg-zinc-100 rounded border border-zinc-300 font-mono text-xs text-zinc-900 space-y-2">
                    <p className="font-semibold text-zinc-700">{"// Key Analytical Formulation:"}</p>
                    <p className="text-orange-900 font-bold">{"NPV = sum_{t=1}^n [ CF_t / (1 + k)^t ] - Initial_Outflow"}</p>
                    <p className="text-zinc-600">{"Where k denotes weighted average cost of capital (WACC)."}</p>
                  </div>
                  <p>
                    Ensure adherence to step marking guidelines: Always state underlying assumptions, schedule workings in working notes, and round calculations to two decimal places.
                  </p>
                </div>
              )}

              {currentPage >= 2 && (
                <div className="space-y-4 text-sm leading-relaxed text-zinc-800">
                  <h2 className="text-base font-bold font-sans text-orange-950 border-l-4 border-orange-600 pl-2">
                    {"2. University & Professional Exam Scanner (Section " + currentPage + ")"}
                  </h2>
                  <p>
                    Analysis of recurring 10-year question patterns, scanner variations, and model answers prepared specifically for upcoming examinations.
                  </p>
                  <div className="my-4 p-4 bg-amber-50/80 rounded border border-amber-200 font-mono text-xs text-amber-950">
                    <p className="font-bold">Important Exam Problem Tip:</p>
                    <p className="mt-1 text-zinc-700">
                      Cross-verify opening balances before closing accounts. In case of discrepancies in trial balance, reconcile suspense account entries first.
                    </p>
                  </div>
                </div>
              )}

              {/* Document Footer */}
              <div className="pt-8 border-t border-zinc-200 text-[10px] font-sans text-zinc-500 flex justify-between">
                <span>CONFIDENTIAL COMMERCE STUDY MATERIAL • DO NOT DISTRIBUTE</span>
                <span className="font-bold">PABIR PAUL&apos;S TUITION</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

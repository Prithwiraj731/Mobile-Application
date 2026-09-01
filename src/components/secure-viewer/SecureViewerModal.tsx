"use client";

import * as React from "react";
import { X, Shield, Maximize2, Minimize2, AlertTriangle, Lock, ArrowLeft } from "lucide-react";
import { MaterialWithDetails } from "@/types";
import { DynamicWatermark } from "./DynamicWatermark";
import { PdfViewer } from "./PdfViewer";
import { ImageViewer } from "./ImageViewer";
import { AudioPlayer } from "./AudioPlayer";
import { TextNoteViewer } from "./TextNoteViewer";

export interface SecureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: MaterialWithDetails | null;
  signedUrl?: string;
  watermarkText?: string;
  sessionTraceId?: string;
}

export function SecureViewerModal({
  isOpen,
  onClose,
  material,
  signedUrl,
  watermarkText = "PABIR PAUL'S TUITION • CONFIDENTIAL PREVIEW",
  sessionTraceId,
}: SecureViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [securityNotice, setSecurityNotice] = React.useState<string | null>(null);

  // Keyboard shortcut interception & anti-tamper deterrents
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Intercept Escape for modal close
      if (e.key === "Escape" && !document.fullscreenElement) {
        onClose();
        return;
      }

      // 2. Intercept Save, Print, Copy, View-Source, DevTools shortcuts
      const isModifier = e.ctrlKey || e.metaKey;
      if (
        (isModifier && (e.key === "s" || e.key === "S")) || // Save
        (isModifier && (e.key === "p" || e.key === "P")) || // Print
        (isModifier && (e.key === "u" || e.key === "U")) || // View source
        e.key === "PrintScreen" ||
        e.key === "F12"
      ) {
        e.preventDefault();
        e.stopPropagation();
        setSecurityNotice("Pabir Paul's Tuition Security: Direct saving, printing, and screenshot capture are strictly prohibited.");
        setTimeout(() => setSecurityNotice(null), 3500);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !material) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md secure-protected-area"
      onContextMenu={(e) => {
        e.preventDefault();
        setSecurityNotice("Context menu is disabled in protected study viewer.");
        setTimeout(() => setSecurityNotice(null), 3000);
      }}
    >
      {/* Viewer Shell Container (Full Screen on Mobile) */}
      <div className="relative w-full h-full sm:h-[95vh] max-w-6xl rounded-none sm:rounded-2xl border-0 sm:border border-surface-800 bg-surface-950 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Dynamic Security Watermark Overlay */}
        <DynamicWatermark watermarkText={watermarkText} sessionTraceId={sessionTraceId} />

        {/* Security Warning Toast */}
        {securityNotice && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-rose-950/90 border border-rose-600 text-rose-200 px-4 py-2 rounded-xl text-xs shadow-xl animate-in fade-in slide-in-from-top-2 max-w-[90%] text-center">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{securityNotice}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-surface-900/90 border-b border-surface-800 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onClose}
              className="sm:hidden p-2 rounded-lg text-surface-300 hover:bg-surface-800 active:scale-95 transition-all"
              title="Return"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/60 border border-indigo-700/50 rounded-md text-indigo-300 text-xs font-mono font-medium shrink-0">
              <Shield className="h-3.5 w-3.5" />
              <span>SECURE PREVIEW</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-md">
                {material.title}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-surface-400 truncate">
                {(material.topic as any)?.chapter?.subject?.course?.title || "Pabir Paul's Tuition"} • {material.access_level.toUpperCase()} Pass
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-surface-400 hover:bg-surface-800 hover:text-white transition-colors active:scale-95"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="hidden sm:flex p-2 rounded-lg text-surface-400 hover:bg-surface-800 hover:text-white transition-colors active:scale-95"
              title="Close Viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Viewer Body */}
        <div className="flex-1 relative overflow-hidden">
          {material.type === "pdf" && (
            <PdfViewer material={material} signedUrl={signedUrl} watermarkText={watermarkText} />
          )}
          {material.type === "image" && (
            <ImageViewer material={material} signedUrl={signedUrl} watermarkText={watermarkText} />
          )}
          {material.type === "audio" && (
            <AudioPlayer material={material} signedUrl={signedUrl} watermarkText={watermarkText} />
          )}
          {material.type === "text_note" && (
            <TextNoteViewer material={material} watermarkText={watermarkText} />
          )}
        </div>

        {/* Footer Security Trace Bar */}
        <div className="px-3 sm:px-4 py-2 bg-surface-950 border-t border-surface-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-surface-400 font-mono z-30 pb-safe">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>TRACE: {sessionTraceId || "SEC-LIVE-AUDIT"}</span>
          </div>
          <span className="hidden sm:inline text-surface-500">
            Personalized to student profile. Pabir Paul&apos;s Tuition.
          </span>
        </div>
      </div>
    </div>
  );
}

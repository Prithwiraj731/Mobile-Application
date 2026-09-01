"use client";

import * as React from "react";
import { BookOpen, ShieldAlert } from "lucide-react";
import { MaterialWithDetails } from "@/types";

export interface TextNoteViewerProps {
  material: MaterialWithDetails;
  watermarkText: string;
}

export function TextNoteViewer({ material, watermarkText }: TextNoteViewerProps) {
  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 secure-protected-area">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800 text-xs text-surface-300">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-400" />
          <span className="font-medium text-surface-200 truncate">{material.title}</span>
        </div>
        <span className="text-[11px] text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
          PROTECTED STUDY NOTE
        </span>
      </div>

      <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
        <div className="prose prose-invert max-w-none text-surface-200 space-y-4 font-sans leading-relaxed">
          <div className="border-b border-surface-800 pb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">{material.title}</h1>
            {material.description && (
              <p className="text-sm text-surface-400 mt-1">{material.description}</p>
            )}
          </div>

          <div className="whitespace-pre-wrap font-sans text-sm text-surface-200 leading-7 bg-surface-900/50 p-6 rounded-xl border border-surface-800/80">
            {material.content_text || "No text content loaded."}
          </div>
        </div>
      </div>
    </div>
  );
}

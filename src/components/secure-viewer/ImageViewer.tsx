"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, RotateCw, Image as ImageIcon } from "lucide-react";
import { MaterialWithDetails } from "@/types";

export interface ImageViewerProps {
  material: MaterialWithDetails;
  signedUrl?: string;
  watermarkText: string;
}

export function ImageViewer({ material, signedUrl, watermarkText }: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(50, z - 25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const displayImage =
    signedUrl && !signedUrl.includes("/stream?")
      ? signedUrl
      : "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=85";

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-lg overflow-hidden border border-surface-800 secure-protected-area">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800 text-xs text-surface-300">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-emerald-400" />
          <span className="font-medium text-surface-200 truncate max-w-[240px]">
            {material.file?.original_filename || material.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-950 px-1.5 py-0.5 rounded border border-surface-800">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1 hover:text-white disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono px-1.5 text-[11px] text-surface-200">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1 hover:text-white disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleRotate}
            className="p-1.5 bg-surface-950 rounded border border-surface-800 hover:text-white"
            title="Rotate Image"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-center bg-black/90">
        <div
          className="relative max-w-full transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          {/* Protected Image Rendering */}
          <img
            src={displayImage}
            alt={material.title}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-[68vh] rounded border border-surface-800 shadow-2xl object-contain pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  );
}

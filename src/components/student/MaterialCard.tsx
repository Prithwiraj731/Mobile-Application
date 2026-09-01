"use client";

import * as React from "react";
import { FileText, Image as ImageIcon, Headphones, BookOpen, Lock, Play, Eye } from "lucide-react";
import { MaterialWithDetails } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatBytes, formatDuration } from "@/lib/utils/cn";

export interface MaterialCardProps {
  material: MaterialWithDetails;
  userPlanRank: number; // 1: Free, 2: Pro, 3: Premium
  onOpenPreview: (material: MaterialWithDetails) => void;
  onUpgradePrompt: (requiredLevel: string) => void;
}

export function MaterialCard({
  material,
  userPlanRank,
  onOpenPreview,
  onUpgradePrompt,
}: MaterialCardProps) {
  const planRankMap: Record<string, number> = { free: 1, pro: 2, premium: 3 };
  const requiredRank = planRankMap[material.access_level] || 1;
  const isLocked = userPlanRank < requiredRank;

  const typeConfig = {
    pdf: {
      icon: FileText,
      label: "PDF Note & Scanner",
      color: "text-rose-300",
      bg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
    },
    image: {
      icon: ImageIcon,
      label: "Ledger Schematic",
      color: "text-emerald-300",
      bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    },
    audio: {
      icon: Headphones,
      label: "Audio Class",
      color: "text-sky-300",
      bg: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    },
    text_note: {
      icon: BookOpen,
      label: "Revision",
      color: "text-amber-300",
      bg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    },
  };

  const currentType = typeConfig[material.type] || typeConfig.pdf;
  const IconComponent = currentType.icon;

  const handleClick = () => {
    if (isLocked) {
      onUpgradePrompt(material.access_level);
    } else {
      onOpenPreview(material);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-3xl p-5 border transition-all duration-300 cursor-pointer select-none flex flex-col justify-between ${
        isLocked
          ? "border-white/5 bg-[#171415]/70 opacity-75 hover:opacity-100 hover:border-amber-500/40 shadow-lg"
          : "bg-[#181516] hover:bg-[#201c1d] border-white/10 hover:border-orange-500/40 shadow-xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(249,115,22,0.15)] hover:scale-[1.02]"
      }`}
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wide ${currentType.bg}`}
          >
            <IconComponent className="h-3.5 w-3.5" />
            <span>{currentType.label.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {material.access_level === "free" && <Badge variant="free">Standard</Badge>}
            {material.access_level === "pro" && <Badge variant="pro">Pro Plan</Badge>}
            {material.access_level === "premium" && <Badge variant="premium">VIP Master</Badge>}

            {isLocked && (
              <div
                className="p-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30"
                title="Requires plan upgrade"
              >
                <Lock className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-1">
          <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1 drop-shadow-sm">
            {material.title}
          </h4>
          {material.description && (
            <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">
              {material.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-surface-400 font-mono">
        <div className="flex items-center gap-1.5">
          {material.file?.page_count && <span>{material.file.page_count}p</span>}
          {material.file?.duration_seconds && <span>{formatDuration(material.file.duration_seconds)}</span>}
          {material.file?.size_bytes ? <span>• {formatBytes(material.file.size_bytes)}</span> : null}
        </div>

        {isLocked ? (
          <span className="text-amber-400 font-sans font-bold text-xs">
            Unlock →
          </span>
        ) : (
          <div className="flex items-center gap-1.5 bg-white text-black font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md group-hover:bg-amber-300 transition-colors">
            {material.type === "audio" ? (
              <Play className="h-3 w-3 fill-current text-black" />
            ) : (
              <Eye className="h-3 w-3 text-black" />
            )}
            <span>Open</span>
          </div>
        )}
      </div>
    </div>
  );
}

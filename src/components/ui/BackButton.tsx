"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
  variant?: "pill" | "icon" | "ghost";
}

export function BackButton({
  fallbackHref = "/",
  label = "Back",
  className = "",
  variant = "pill",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#1c191a]/90 hover:bg-[#282425] text-surface-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-95 shadow-sm ${className}`}
        aria-label={label}
        title={label}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
    );
  }

  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={handleBack}
        className={`inline-flex items-center gap-1.5 text-xs text-surface-400 hover:text-white transition-colors duration-200 py-1.5 px-2 rounded-lg hover:bg-white/5 active:scale-95 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-semibold">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181516] hover:bg-[#231f20] text-surface-300 hover:text-white border border-white/10 hover:border-white/25 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 ${className}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 text-orange-400" />
      <span>{label}</span>
    </button>
  );
}

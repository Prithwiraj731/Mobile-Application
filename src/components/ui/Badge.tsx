import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "pro" | "premium" | "free" | "gold";
  size?: "sm" | "md" | "lg";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#1e293b] text-surface-200 border-white/10",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/25",
    info: "bg-blue-500/10 text-blue-300 border-blue-500/25",
    outline: "border-white/15 text-surface-300 bg-transparent",
    free: "bg-blue-500/10 text-blue-300 border-blue-500/25 font-mono font-medium",
    pro: "bg-blue-600/20 text-blue-300 border-blue-500/35 font-semibold",
    premium: "bg-blue-600 text-white border-blue-500 font-bold",
    gold: "bg-blue-500/20 text-blue-200 border-blue-400/40 font-bold",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

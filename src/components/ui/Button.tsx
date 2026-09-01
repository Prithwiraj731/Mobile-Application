import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl";

    const variants = {
      primary:
        "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)] border border-indigo-400/30 hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:brightness-110 active:scale-[0.98]",
      gold:
        "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-surface-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.35)] border border-yellow-200/50 hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-[0.98]",
      secondary:
        "bg-surface-850/80 hover:bg-surface-800 text-surface-100 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md hover:border-white/20 active:scale-[0.98]",
      outline:
        "border border-white/15 bg-surface-900/40 hover:bg-surface-850/60 hover:border-white/30 text-surface-200 backdrop-blur-md active:scale-[0.98]",
      danger:
        "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:brightness-110 shadow-[0_4px_16px_rgba(225,29,72,0.35)] border border-rose-400/30 active:scale-[0.98]",
      ghost: "hover:bg-white/5 text-surface-300 hover:text-white active:scale-[0.98]",
      link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300 p-0 h-auto",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

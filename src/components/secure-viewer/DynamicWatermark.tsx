"use client";

import * as React from "react";

export interface DynamicWatermarkProps {
  watermarkText: string;
  sessionTraceId?: string;
  opacity?: number;
}

export function DynamicWatermark({
  watermarkText,
  sessionTraceId,
  opacity = 0.12,
}: DynamicWatermarkProps) {
  const [liveTimestamp, setLiveTimestamp] = React.useState<string>("");
  const [jitterOffset, setJitterOffset] = React.useState({ x: 0, y: 0 });

  // Update timestamp and subtle anti-tamper jitter position every 10 seconds
  React.useEffect(() => {
    const updateTimeAndJitter = () => {
      const now = new Date();
      setLiveTimestamp(
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      // Subtle randomized jitter to trace continuous video grabs
      setJitterOffset({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 12,
      });
    };

    updateTimeAndJitter();
    const interval = setInterval(updateTimeAndJitter, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 select-none overflow-hidden"
      style={{ userSelect: "none" }}
    >
      {/* 1. Diagonal Repeating Watermark Grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="secure-watermark-pattern"
            width="420"
            height="200"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <text
              x="20"
              y="60"
              fill="currentColor"
              fontSize="12"
              fontWeight="600"
              fontFamily="monospace"
              className="text-white"
            >
              {watermarkText}
            </text>
            <text
              x="60"
              y="140"
              fill="currentColor"
              fontSize="10"
              fontWeight="500"
              fontFamily="monospace"
              className="text-indigo-300"
            >
              CONFIDENTIAL • INSTITUTIONAL USE ONLY • ID: {sessionTraceId || "ACTIVE"}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#secure-watermark-pattern)" />
      </svg>

      {/* 2. Floating Micro-Jitter Active Stamp (Bottom Right) */}
      <div
        className="absolute bottom-4 right-4 rounded border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-sm transition-transform duration-1000"
        style={{
          transform: `translate(${jitterOffset.x}px, ${jitterOffset.y}px)`,
          opacity: opacity + 0.15,
        }}
      >
        <p className="font-mono text-[10px] font-medium tracking-tight text-white/70">
          ● AUDIT TRACE: {sessionTraceId || "SEC-LIVE"} | {liveTimestamp} UTC
        </p>
      </div>
    </div>
  );
}

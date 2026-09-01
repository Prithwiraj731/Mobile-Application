"use client";

import * as React from "react";
import {
  ShieldAlert,
  Lock,
  EyeOff,
  FileKey2,
  Fingerprint,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "100% Private Cloud Storage",
      description:
        "Educational files reside in an encrypted, non-public storage bucket. No public links, no static file paths, and zero indexing by search engines.",
    },
    {
      icon: Fingerprint,
      title: "Dynamic Student Watermarking",
      description:
        "Every single note, balance sheet schematic, and tax scanner is dynamically stamped with your verified student name, email, student ID, and live timestamp.",
    },
    {
      icon: FileKey2,
      title: "Short-Lived Signed Tokens (120s)",
      description:
        "Material access links expire automatically after 120 seconds. Replay attacks and shared URL access are strictly rejected by the server.",
    },
    {
      icon: EyeOff,
      title: "Server-Side Authorization Boundary",
      description:
        "Frontend never determines access. Every request undergoes server-side verification of active enrollment, approval status, and batch clearance.",
    },
  ];

  return (
    <section id="security" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl card-dark-glass p-8 sm:p-12 shadow-2xl space-y-10">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono font-bold text-orange-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Zero-Leak Academic Architecture</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Your Study Notes & Scanners are{" "}
                <span className="text-orange-400">Strictly Protected</span>
              </h2>

              <p className="text-xs sm:text-sm text-surface-300 font-medium leading-relaxed">
                Pabir Paul&apos;s Tuition enforces strict server-side security. Educational materials are accessible only by authenticated, approved students within their active dashboard session.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0c0a0b] p-4 border border-white/10 shrink-0 font-mono text-xs space-y-1 text-surface-300 shadow-inner">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>RLS & Server Auth Active</span>
              </div>
              <p className="text-[11px] text-surface-500">Unauthenticated Access = 401 Unauthorized</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl bg-[#141112] border border-white/5 p-5 space-y-2.5 hover:border-white/20 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-surface-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Live Watermark Simulation Demo Box */}
          <div className="rounded-2xl bg-[#0c0a0b] p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-surface-400 uppercase font-bold flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-orange-400" />
                Live Student Watermark Specimen
              </span>
              <span className="text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 font-bold text-[10px]">
                ● REAL-TIME PROTECTION
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-[#181516] p-5 border border-white/5 text-center">
              <p className="text-xs text-surface-400 font-mono italic max-w-lg mx-auto">
                &ldquo;Corporate Accounting Sem 5: Amalgamation in the Nature of Merger vs Purchase (AS-14)...&rdquo;
              </p>
              {/* Overlaid simulated watermark */}
              <div className="mt-3 inline-block px-4 py-2 rounded-full bg-orange-950/60 border border-orange-500/40 text-[11px] font-mono text-orange-300 tracking-wider shadow-lg">
                Debraj Paul • student@example.com • PPT-BCOM-2026 • 2026-08-21 • Session #SEC-TRACE-BCOM
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

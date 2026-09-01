"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Mail, ShieldCheck, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#080707] border-t border-white/10 text-surface-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-[1.5px] shadow-lg shadow-orange-500/20">
                <div className="h-full w-full rounded-2xl bg-[#181516] flex items-center justify-center text-white">
                  <GraduationCap className="h-5 w-5 text-orange-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Pabir Paul&apos;s Tuition
                </span>
                <p className="text-[11px] text-surface-500 font-medium">
                  Premier Commerce, Accounting & Taxation Coaching
                </p>
              </div>
            </div>

            <p className="text-xs text-surface-400 leading-relaxed max-w-sm">
              Dedicated private coaching institute providing disciplined conceptual education, university & professional scanner series, and protected study materials for B.COM (Sem 1-8), M.COM (Sem 1-4), CA, and CMA.
            </p>

            <div className="pt-1 flex items-center gap-2 text-orange-400 font-mono text-[11px]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Zero-Leak Educational Portal • Dynamic Watermarking</span>
            </div>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Commerce Tracks
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#programs" className="hover:text-orange-400 transition-colors">
                  B.COM Semesters 1 to 4
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-orange-400 transition-colors">
                  B.COM Semesters 5 to 8
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-orange-400 transition-colors">
                  M.COM Semesters 1 to 4
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-orange-400 transition-colors">
                  CA Intermediate & Final
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-orange-400 transition-colors">
                  CMA Intermediate & Final
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Portal Access
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-orange-400 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-orange-400 transition-colors">
                  Admission Registration
                </Link>
              </li>
              <li>
                <Link href="/pending" className="hover:text-orange-400 transition-colors">
                  Check Approval Status
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-400 transition-colors">
                  Instructor Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Admissions Desk
            </h4>
            <div className="space-y-2.5 text-xs text-surface-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="font-mono text-surface-200">support@pabirpaul.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400 shrink-0" />
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-surface-500">
          <p>© 2026 Pabir Paul&apos;s Tuition. All rights reserved.</p>
          <p className="font-mono">
            Protected Educational Material • Private Supabase Cloud Storage
          </p>
        </div>
      </div>
    </footer>
  );
}

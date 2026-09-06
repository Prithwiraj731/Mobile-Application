"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "B.COM (Sem 1-8)", href: "#programs" },
    { label: "M.COM (Sem 1-4)", href: "#programs" },
    { label: "CA & CMA", href: "#programs" },
    { label: "Methodology", href: "#methodology" },
    { label: "Why PPT", href: "#about" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#09090b]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-2.5"
          : "bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/50 to-transparent backdrop-blur-md py-3.5"
      }`}
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 0px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Crest */}
        <Link href="/" className="flex items-center gap-2.5 group active:scale-[0.98] transition-transform">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-md shadow-orange-500/15">
            <div className="h-full w-full rounded-[11px] bg-[#121011] flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5 text-amber-400 group-hover:scale-105 transition-transform" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-amber-400 transition-colors">
                Pabir Paul&apos;s Tuition
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                Kolkata
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-surface-400 font-medium tracking-wide">
              B.COM • M.COM • CA & CMA Coaching
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-surface-300 hover:text-amber-400 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-surface-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all active:scale-95"
          >
            Student Login
          </Link>

          <Link
            href="/signup"
            className="btn-mango px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 rounded-lg active:scale-95 transition-all"
          >
            Login
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-surface-300 hover:text-white focus:outline-none active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#121011]/98 backdrop-blur-2xl border-b border-white/10 px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-1 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-surface-200 hover:bg-white/[0.06] hover:text-amber-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-mango w-full py-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Apply for Commerce Batch</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-surface-200 bg-white/[0.05] border border-white/10 hover:bg-white/[0.08]"
            >
              Student Portal Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

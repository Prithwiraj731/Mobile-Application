"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, X, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    { label: "Why Choose PPT", href: "#about" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0c0a0b]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Crest */}
        <Link href="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-[1.5px] shadow-lg shadow-orange-500/25">
            <div className="h-full w-full rounded-2xl bg-[#181516] flex items-center justify-center text-white">
              <GraduationCap className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-tight group-hover:text-orange-400 transition-colors">
                Pabir Paul&apos;s Tuition
              </span>
              <span className="text-[10px] font-mono font-bold bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                COMMERCE
              </span>
            </div>
            <p className="text-[11px] text-surface-400 font-medium">
              B.COM • M.COM • CA • CMA
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-bold text-surface-300 hover:text-orange-400 transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold text-surface-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95 shadow-sm"
          >
            Student Login
          </Link>

          <Link
            href="/signup"
            className="btn-mango px-5 py-2 text-xs font-black rounded-full flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <span>Admission Registration</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-bold text-surface-200 bg-white/5 border border-white/10 rounded-full"
          >
            Login
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-surface-300 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#181516]/98 backdrop-blur-2xl border-b border-white/10 px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-1.5 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-surface-300 hover:bg-white/5 hover:text-orange-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-mango w-full py-3 rounded-full text-center text-xs font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Apply for Commerce Batch</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full text-center text-xs font-bold text-surface-200 bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Student Portal Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

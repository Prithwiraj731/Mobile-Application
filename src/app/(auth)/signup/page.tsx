"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";

export default function SignupPage() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [selectedSemesterOrGroup, setSelectedSemesterOrGroup] = React.useState("Semester 1");
  const [city, setCity] = React.useState("Kolkata");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const activeProg = COMMERCE_PROGRAMS.find((p) => p.id === selectedProgram) || COMMERCE_PROGRAMS[0];

  const handleProgramChange = (prog: "BCOM" | "MCOM" | "CA" | "CMA") => {
    setSelectedProgram(prog);
    const targetProg = COMMERCE_PROGRAMS.find((p) => p.id === prog);
    if (targetProg && targetProg.semestersOrGroups.length > 0) {
      setSelectedSemesterOrGroup(targetProg.semestersOrGroups[0]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match! Please verify both password fields.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const enrollmentDetails = `${selectedProgram} - ${selectedSemesterOrGroup} (${city})`;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password,
          confirmPassword,
          address: enrollmentDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration could not be completed. Please verify your details.");
        setIsLoading(false);
        return;
      }

      // Success! Show registration confirmation screen
      setIsSuccess(true);
    } catch {
      setError("Unable to complete registration. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a0b] flex flex-col justify-center items-center p-4 sm:p-6 text-surface-100 pb-16 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-10 -left-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 -right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-[2px] shadow-2xl shadow-orange-500/30 animate-float">
              <div className="h-full w-full rounded-3xl bg-[#181516] flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Registration
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 font-medium mt-0.5">
              Pabir Paul&apos;s Tuition • B.COM, M.COM, CA & CMA Batches
            </p>
          </div>
        </div>

        {/* Dynamic Success View (Thanks for registering! Admin will approve soon) */}
        {isSuccess ? (
          <div className="rounded-3xl border border-amber-500/30 bg-[#181516]/95 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="inline-flex p-4 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-xl shadow-amber-500/20">
              <Clock className="h-12 w-12 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Application Submitted</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Thanks for registering!
              </h2>
              <p className="text-xs sm:text-sm text-surface-300 leading-relaxed max-w-md mx-auto">
                Your registration application has been submitted to <span className="text-orange-400 font-bold">Pabir Paul&apos;s Tuition</span>.
                The admin will review and approve your account soon so you can log in and access all notes, audios, PDFs, and scanner solutions.
              </p>
            </div>

            {/* Application Summary Card */}
            <div className="rounded-2xl border border-white/5 bg-[#0c0a0b] p-4 text-left text-xs font-mono space-y-2.5 text-surface-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-surface-500">APPLICANT NAME:</span>
                <span className="text-white font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-surface-500">LOGIN EMAIL:</span>
                <span className="text-orange-400 font-bold">{email}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-surface-500">PHONE NUMBER:</span>
                <span className="text-white font-bold">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-surface-500">TARGET STREAM:</span>
                <span className="text-indigo-400 font-bold">
                  {selectedProgram} • {selectedSemesterOrGroup}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-surface-500">CLEARANCE STATUS:</span>
                <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  Awaiting Admin Approval
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="btn-mango w-full py-3.5 rounded-full text-xs font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xl"
              >
                <span>Go to Student Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Signup Form Card */
          <div className="rounded-3xl border border-white/10 bg-[#181516]/95 p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-2xl">
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3.5 text-xs text-orange-300">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-400" />
                Admission Approval Process:
              </p>
              <p className="mt-0.5 text-[11px] text-surface-300 leading-relaxed">
                Fill in your details below. Once registered, admin will approve your profile so you can log in to view and download study materials.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Debraj Paul"
                  className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Phone / Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Program Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-surface-300 font-mono">
                  Select Academic Stream *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COMMERCE_PROGRAMS.map((prog) => {
                    const isSelected = selectedProgram === prog.id;
                    return (
                      <button
                        type="button"
                        key={prog.id}
                        onClick={() => handleProgramChange(prog.id)}
                        className={`py-2 px-2 rounded-2xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/30"
                            : "bg-[#0c0a0b] text-surface-400 border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {prog.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Semester & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-surface-300 font-mono">
                    {selectedProgram === "CA" || selectedProgram === "CMA"
                      ? "Group / Level"
                      : "Target Semester"}
                  </label>
                  <select
                    value={selectedSemesterOrGroup}
                    onChange={(e) => setSelectedSemesterOrGroup(e.target.value)}
                    className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    {activeProg.semestersOrGroups.map((sem) => (
                      <option key={sem} value={sem} className="bg-[#181516] text-white">
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                    City / College
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kolkata"
                    className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-3.5 py-3 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              {/* Create Password */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                  Create Password * (Min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0a0b] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-surface-300 mb-1.5 font-mono">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#0c0a0b] border rounded-2xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-orange-500/60"
                  }`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-400 mt-1 font-mono">
                    ⚠️ Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (confirmPassword.length > 0 && password !== confirmPassword)}
                className="btn-mango w-full py-3.5 rounded-full text-xs font-black flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-95 shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Submitting application...</span>
                ) : (
                  <>
                    <span>Submit Admission Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-surface-400 border-t border-white/5">
              Already registered in tuition batches?{" "}
              <Link href="/login" className="text-orange-400 hover:underline font-bold">
                Sign In here
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

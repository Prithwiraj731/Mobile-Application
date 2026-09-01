"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, ArrowRight, AlertCircle, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COMMERCE_PROGRAMS } from "@/lib/mock-data";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedProgram, setSelectedProgram] = React.useState<"BCOM" | "MCOM" | "CA" | "CMA">("BCOM");
  const [selectedSemesterOrGroup, setSelectedSemesterOrGroup] = React.useState("Semester 1");
  const [city, setCity] = React.useState("Kolkata");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

    const enrollmentDetails = `${selectedProgram} - ${selectedSemesterOrGroup} (${city})`;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber,
          address: enrollmentDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your inputs.");
        setIsLoading(false);
        return;
      }

      router.push("/pending?status=pending");
    } catch {
      // Fallback demo redirect
      router.push("/pending?status=pending");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a0b] flex flex-col justify-center items-center p-4 sm:p-6 text-surface-100 pb-16 relative overflow-hidden">
      {/* Ambient Glows */}
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
              Admission Registration
            </h1>
            <p className="text-xs sm:text-sm text-surface-400 font-medium mt-0.5">
              Pabir Paul&apos;s Tuition • B.COM, M.COM, CA & CMA Batches
            </p>
          </div>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-3xl border border-white/10 bg-[#181516]/95 p-6 sm:p-8 shadow-2xl space-y-5 backdrop-blur-2xl">
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3.5 text-xs text-orange-300">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-orange-400" />
              Tuition Admission Notice:
            </p>
            <p className="mt-0.5 text-[11px] text-surface-300 leading-relaxed">
              All applications are manually verified by Pabir Paul before full batch notes and test series unlock.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Student Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Debraj Paul"
            />

            <Input
              label="Student / Parent Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
            />

            <Input
              label="Create Password (Min. 8 characters)"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* Program Selection (B.COM, M.COM, CA, CMA) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-surface-300 font-mono">
                Select Commerce Academic Stream
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

            {/* Semester or Group Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-surface-300 font-mono">
                  {selectedProgram === "CA" || selectedProgram === "CMA" ? "Exam Level / Group" : "Target Semester"}
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

              <Input
                label="City / College Name"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kolkata / St. Xavier's"
              />
            </div>

            <Input
              label="Student Contact / WhatsApp Number"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-mango w-full py-3.5 rounded-full text-xs font-black flex items-center justify-center gap-2 mt-3 cursor-pointer active:scale-95 shadow-xl"
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
            Already enrolled in Pabir Paul&apos;s Tuition?{" "}
            <Link href="/login" className="text-orange-400 hover:underline font-bold">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

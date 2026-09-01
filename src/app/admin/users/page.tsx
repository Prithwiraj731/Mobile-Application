"use client";

import * as React from "react";
import { Users, Search, Filter, ShieldAlert, CheckCircle2, Crown, Sparkles, MoreVertical, Ban, RefreshCw, KeyRound } from "lucide-react";
import { MOCK_USERS, MOCK_PLANS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedUserForPlan, setSelectedUserForPlan] = React.useState<any | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = React.useState<string>("PRO");
  const [planDurationDays, setPlanDurationDays] = React.useState(30);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "suspended" ? ("approved" as const) : ("suspended" as const);
          setFeedback(
            nextStatus === "suspended"
              ? `Suspended access for ${u.full_name}. Active sessions revoked.`
              : `Reactivated account for ${u.full_name}.`
          );
          setTimeout(() => setFeedback(null), 4000);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleAssignPlan = () => {
    if (!selectedUserForPlan) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserForPlan.id
          ? { ...u, planCode: selectedPlanCode as "FREE" | "PRO" | "PREMIUM" }
          : u
      )
    );
    setFeedback(`Assigned ${selectedPlanCode} plan (${planDurationDays} days) to ${selectedUserForPlan.full_name}.`);
    setTimeout(() => setFeedback(null), 4000);
    setSelectedUserForPlan(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
            IDENTITY & ACCESS
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          User & Student Management
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Manage enrolled student accounts, allocate subscription tiers, suspend rogue sessions, and inspect access permissions.
        </p>
      </div>

      {feedback && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-300 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-900/80 p-4 rounded-xl border border-surface-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-950 border border-surface-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["all", "approved", "pending_approval", "suspended", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors capitalize shrink-0 ${
                statusFilter === st
                  ? "bg-rose-950/80 border border-rose-700/50 text-rose-300 font-semibold"
                  : "text-surface-400 hover:text-white hover:bg-surface-800"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Dense User Table */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Approval Status</th>
                <th className="px-5 py-3">Active Plan</th>
                <th className="px-5 py-3">Registration</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{user.full_name}</div>
                    <div className="font-mono text-[11px] text-surface-400">{user.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono uppercase text-[11px] px-2 py-0.5 rounded bg-surface-800 text-surface-300 border border-surface-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.status === "approved" && <Badge variant="success">Approved</Badge>}
                    {user.status === "pending_approval" && <Badge variant="warning">Pending</Badge>}
                    {user.status === "suspended" && <Badge variant="danger">Suspended</Badge>}
                    {user.status === "rejected" && <Badge variant="outline">Rejected</Badge>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${
                        user.planCode === "PREMIUM"
                          ? "bg-amber-950/60 text-amber-300 border-amber-700/50"
                          : user.planCode === "PRO"
                          ? "bg-indigo-950/60 text-indigo-300 border-indigo-700/50"
                          : "bg-surface-950 text-emerald-400 border-emerald-800/40"
                      }`}
                    >
                      {user.planCode || "FREE"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-surface-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedUserForPlan(user)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        <Crown className="h-3 w-3 mr-1 text-amber-400" />
                        Assign Plan
                      </Button>

                      {user.role !== "admin" && (
                        <Button
                          variant={user.status === "suspended" ? "outline" : "danger"}
                          size="sm"
                          onClick={() => handleToggleSuspend(user.id)}
                          className="text-[11px] h-7 px-2.5"
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          {user.status === "suspended" ? "Reactivate" : "Suspend"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Plan Assignment Modal */}
      <Modal
        isOpen={!!selectedUserForPlan}
        onClose={() => setSelectedUserForPlan(null)}
        title="Assign Academic Subscription Plan"
        description={`Allocate institutional subscription tier for ${selectedUserForPlan?.full_name}`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-surface-300">Select Subscription Tier</label>
            <div className="grid grid-cols-3 gap-3">
              {["FREE", "PRO", "PREMIUM"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedPlanCode(code)}
                  className={`p-3 rounded-lg border text-xs font-bold transition-colors ${
                    selectedPlanCode === code
                      ? "border-indigo-500 bg-indigo-950/60 text-white shadow-sm"
                      : "border-surface-800 bg-surface-900 text-surface-400 hover:text-white"
                  }`}
                >
                  {code} Plan
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Duration (Days)"
            type="number"
            value={planDurationDays}
            onChange={(e) => setPlanDurationDays(parseInt(e.target.value) || 30)}
            helperText="Default active duration before plan expiration"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setSelectedUserForPlan(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAssignPlan}>
              Confirm Allocation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

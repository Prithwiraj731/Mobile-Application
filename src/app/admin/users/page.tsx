"use client";

import * as React from "react";
import { Users, Search, Filter, ShieldAlert, CheckCircle2, Crown, Sparkles, RefreshCw, XCircle, Ban, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StoredUser } from "@/lib/data-store";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedUserForPlan, setSelectedUserForPlan] = React.useState<StoredUser | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = React.useState<string>("PRO");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch {
      setFeedback("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone_number && u.phone_number.includes(searchQuery));
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveUser = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
        );
        setFeedback(`Approved account for ${userName}. Student can now sign in.`);
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch {
      setFeedback("Error approving student.");
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: string, userName: string) => {
    const nextStatus = currentStatus === "suspended" ? "approved" : "suspended";
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus as any } : u))
        );
        setFeedback(
          nextStatus === "suspended"
            ? `Suspended access for ${userName}.`
            : `Reactivated account for ${userName}.`
        );
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch {
      setFeedback("Error updating status.");
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedUserForPlan) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedUserForPlan.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode: selectedPlanCode }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserForPlan.id ? { ...u, planCode: selectedPlanCode as any } : u
          )
        );
        setFeedback(`Assigned ${selectedPlanCode} tier to ${selectedUserForPlan.full_name}.`);
        setTimeout(() => setFeedback(null), 4000);
        setSelectedUserForPlan(null);
      }
    } catch {
      setFeedback("Error updating plan.");
    }
  };

  const pendingCount = users.filter((u) => u.status === "pending_approval").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              STUDENT DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Registered Users & Students ({users.length})
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            View all registered accounts, approve pending students, adjust subscription tiers, and manage portal access.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="btn-secondary px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {feedback && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-300 flex items-center gap-2.5 animate-in fade-in">
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
            placeholder="Search by student name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-950 border border-surface-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Users" },
            { id: "pending_approval", label: `Pending (${pendingCount})` },
            { id: "approved", label: "Approved" },
            { id: "suspended", label: "Suspended" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap active:scale-95 ${
                statusFilter === tab.id
                  ? tab.id === "pending_approval"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-indigo-600 text-white shadow-sm"
                  : "bg-surface-950 text-surface-400 hover:text-surface-200 border border-surface-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-300">
            <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
              <tr>
                <th className="px-5 py-3">Student / User</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Stream / Address</th>
                <th className="px-5 py-3">Pass Tier</th>
                <th className="px-5 py-3">Approval Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-surface-500">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-indigo-400" />
                    <span>Loading student records...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-surface-500">
                    No registered students found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{user.full_name}</span>
                        {user.role === "admin" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                            Faculty
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-surface-400 font-mono">{user.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-surface-300">
                      {user.phone_number || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-surface-300 max-w-xs truncate">
                      {user.address || "Standard Batch"}
                    </td>
                    <td className="px-5 py-3.5">
                      {user.planCode === "FREE" && <Badge variant="free">Free Pass</Badge>}
                      {user.planCode === "PRO" && <Badge variant="pro">Pro Plan</Badge>}
                      {user.planCode === "PREMIUM" && <Badge variant="premium">VIP Master</Badge>}
                    </td>
                    <td className="px-5 py-3.5">
                      {user.status === "approved" && <Badge variant="success">Approved</Badge>}
                      {user.status === "pending_approval" && (
                        <Badge variant="warning">Awaiting Approval</Badge>
                      )}
                      {user.status === "suspended" && <Badge variant="danger">Suspended</Badge>}
                      {user.status === "rejected" && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-surface-400 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "pending_approval" && (
                          <button
                            onClick={() => handleApproveUser(user.id, user.full_name)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {user.role !== "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUserForPlan(user)}
                              className="text-[11px] h-7 px-2"
                            >
                              Tier
                            </Button>

                            <Button
                              variant={user.status === "suspended" ? "outline" : "secondary"}
                              size="sm"
                              onClick={() =>
                                handleToggleSuspend(user.id, user.status, user.full_name)
                              }
                              className={`text-[11px] h-7 px-2 ${
                                user.status === "suspended"
                                  ? "text-emerald-400 border-emerald-800"
                                  : "text-rose-400"
                              }`}
                            >
                              {user.status === "suspended" ? "Reactivate" : "Suspend"}
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Assignment Modal */}
      <Modal
        isOpen={!!selectedUserForPlan}
        onClose={() => setSelectedUserForPlan(null)}
        title="Adjust Student Access Pass"
        description={`Allocate subscription tier for ${selectedUserForPlan?.full_name}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-surface-300">Select Pass Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {["FREE", "PRO", "PREMIUM"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedPlanCode(code)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedPlanCode === code
                      ? "border-indigo-500 bg-indigo-500/20 text-white shadow-md"
                      : "border-surface-800 bg-surface-950 text-surface-400 hover:border-surface-700"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-800">
            <Button variant="outline" size="sm" onClick={() => setSelectedUserForPlan(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAssignPlan} className="bg-indigo-600">
              Apply Tier Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

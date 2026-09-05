"use client";

import * as React from "react";
import { UserCheck, XCircle, CheckCircle2, Clock, MapPin, Phone, Mail, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { StoredUser } from "@/lib/data-store";

export default function AdminApprovalsPage() {
  const [users, setUsers] = React.useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rejectingUserId, setRejectingUserId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const fetchPendingUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users?status=pending_approval");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch {
      setActionError("Failed to fetch pending applications.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Failed to approve student.");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setActionSuccess(`Successfully approved student "${userName}". LMS clearance granted.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionError("Error approving user. Please try again.");
    }
  };

  const handleOpenRejectModal = (userId: string) => {
    setRejectingUserId(userId);
    setRejectionReason("Incomplete or unverified enrollment details.");
  };

  const handleConfirmReject = async () => {
    if (!rejectingUserId) return;
    try {
      const res = await fetch(`/api/admin/users/${rejectingUserId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || "Failed to reject application.");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== rejectingUserId));
      setRejectingUserId(null);
      setActionSuccess("Student registration marked as rejected.");
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionError("Error rejecting application.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              ENROLLMENT VERIFICATION
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Pending Student Approvals ({users.length})
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Review newly registered students. Only approved students can log in and access protected study materials.
          </p>
        </div>

        <button
          onClick={fetchPendingUsers}
          disabled={isLoading}
          className="btn-secondary px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Success Alert */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Alert */}
      {actionError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in">
          <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Applicant List */}
      {isLoading ? (
        <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-12 text-center text-xs text-surface-400">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-rose-400" />
          <span>Loading pending applications...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-12 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Pending Approvals</h3>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            All newly registered students have been processed. When a student registers on the portal, their profile will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-surface-800 bg-surface-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-surface-700 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white">{user.full_name}</h3>
                  <Badge variant="warning">Awaiting Approval</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs text-surface-300">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Mail className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="font-mono text-surface-200">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-surface-400">
                    <Phone className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{user.phone_number || "Not provided"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-surface-400">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{user.address || "Not provided"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-surface-400">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="font-mono">
                      Registered: {new Date(user.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-surface-800/80">
                <button
                  onClick={() => handleOpenRejectModal(user.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-800/40 active:scale-95 transition-all"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5 inline" />
                  Reject
                </button>

                <button
                  onClick={() => handleApprove(user.id, user.full_name)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approve Student</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={!!rejectingUserId}
        onClose={() => setRejectingUserId(null)}
        title="Reject Admission Application"
        description="Provide a reason for rejecting this student registration."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1">
              Rejection Reason
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-lg p-3 text-xs text-surface-100 placeholder:text-surface-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectingUserId(null)}
            >
              Cancel
            </Button>
            <button
              onClick={handleConfirmReject}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold active:scale-95"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

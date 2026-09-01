"use client";

import * as React from "react";
import { UserCheck, XCircle, CheckCircle2, AlertCircle, Clock, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function AdminApprovalsPage() {
  const [users, setUsers] = React.useState(MOCK_USERS);
  const [rejectingUserId, setRejectingUserId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const pendingUsers = users.filter((u) => u.status === "pending_approval");

  const handleApprove = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
    );
    setActionSuccess(`Successfully approved student account. LMS clearance granted.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleOpenRejectModal = (userId: string) => {
    setRejectingUserId(userId);
    setRejectionReason("Incomplete or invalid institutional registration details.");
  };

  const handleConfirmReject = () => {
    if (!rejectingUserId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === rejectingUserId
          ? { ...u, status: "rejected" as const, rejection_reason: rejectionReason }
          : u
      )
    );
    setRejectingUserId(null);
    setActionSuccess(`Student registration marked as rejected.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
            ENROLLMENT VERIFICATION
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Pending Student Approvals ({pendingUsers.length})
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Review newly registered applicants. Only approved students can access protected courses and materials.
        </p>
      </div>

      {/* Success Alert */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Applicant List */}
      {pendingUsers.length === 0 ? (
        <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-12 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Pending Approvals</h3>
          <p className="text-xs text-surface-400 max-w-sm mx-auto">
            All newly registered students have been processed. New registrations will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-surface-800 bg-surface-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-surface-700 transition-colors"
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
                      Registered: {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-surface-800/80">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleOpenRejectModal(user.id)}
                  className="text-xs"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(user.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Approve Student
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={!!rejectingUserId}
        onClose={() => setRejectingUserId(null)}
        title="Reject Student Registration"
        description="Provide a reason for the rejection record in audit logs and student notification."
      >
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Unverified enrollment credentials"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setRejectingUserId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

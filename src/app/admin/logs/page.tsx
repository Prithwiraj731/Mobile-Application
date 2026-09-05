"use client";

import * as React from "react";
import { ScrollText, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Lock, Clock, Filter } from "lucide-react";
import { MOCK_ACCESS_LOGS, MOCK_AUDIT_LOGS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";

export default function AdminLogsPage() {
  const [activeTab, setActiveTab] = React.useState<"access" | "audit">("access");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
            FORENSIC AUDIT TRAIL
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Security Access & Audit Logs
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Cryptographically recorded preview authorizations, watermarked session traces, and administrative decisions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-800 pb-3">
        <button
          onClick={() => setActiveTab("access")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "access"
              ? "bg-rose-950/80 border border-rose-700/50 text-rose-300 font-semibold"
              : "text-surface-400 hover:text-white hover:bg-surface-900"
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Material Access Logs ({MOCK_ACCESS_LOGS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "audit"
              ? "bg-rose-950/80 border border-rose-700/50 text-rose-300 font-semibold"
              : "text-surface-400 hover:text-white hover:bg-surface-900"
          }`}
        >
          <ScrollText className="h-4 w-4" />
          <span>Admin Audit Trail ({MOCK_AUDIT_LOGS.length})</span>
        </button>
      </div>

      {/* Access Logs Tab */}
      {activeTab === "access" && (
        <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Student / User</th>
                  <th className="px-5 py-3">Session Trace ID</th>
                  <th className="px-5 py-3">Client IP & Agent</th>
                  <th className="px-5 py-3">Watermark Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono">
                {MOCK_ACCESS_LOGS.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-surface-500 font-sans text-xs">
                      No forensic access logs recorded yet. Logs are automatically captured whenever students launch encrypted preview sessions.
                    </td>
                  </tr>
                ) : (
                  MOCK_ACCESS_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-800/40 transition-colors">
                      <td className="px-5 py-3.5 text-surface-400 text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        {log.action === "unauthorized_attempt" ? (
                          <span className="text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded text-[10px]">
                            UNAUTHORIZED ATTEMPT
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px]">
                            AUTHORIZED PREVIEW
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-sans font-medium text-white">
                        {log.user_id}
                      </td>
                      <td className="px-5 py-3.5 text-indigo-300 font-bold text-[11px]">
                        {log.session_id || "BLOCKED"}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-surface-400">
                        <div>IP: {log.ip_address}</div>
                        <div className="text-[10px] text-surface-500 truncate max-w-xs">{log.user_agent}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[10px] text-surface-300 truncate max-w-xs font-sans">
                        {log.watermark_text || "None (Authorization Rejected)"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Audit Trail Tab */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-surface-800 bg-surface-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950 border-b border-surface-800 text-[11px] font-mono uppercase text-surface-400">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Admin Actor</th>
                  <th className="px-5 py-3">Action Performed</th>
                  <th className="px-5 py-3">Target Entity</th>
                  <th className="px-5 py-3">Details / Audit Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 font-mono">
                {MOCK_AUDIT_LOGS.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-surface-500 font-sans text-xs">
                      No administrator audit actions recorded yet. Approval and account decisions will appear here.
                    </td>
                  </tr>
                ) : (
                  MOCK_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-800/40 transition-colors">
                      <td className="px-5 py-3.5 text-surface-400 text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 font-sans font-semibold text-rose-300">
                        Chief Administrator ({log.admin_id})
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-surface-800 px-2 py-0.5 rounded text-white border border-surface-700 uppercase font-semibold text-[10px]">
                          {log.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-surface-400 text-[11px]">
                        {log.target_user_id || log.target_material_id || "System"}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-surface-300 font-sans">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

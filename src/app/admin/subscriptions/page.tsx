"use client";

import * as React from "react";
import { Crown, Sparkles, Shield, Check, Users, Edit3, Plus, CheckCircle2 } from "lucide-react";
import { MOCK_PLANS, MOCK_USERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlanBadge } from "@/components/student/PlanBadge";

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = React.useState(MOCK_PLANS);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
            SUBSCRIPTION GOVERNANCE
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Subscription Plans & Access Tiers
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Configure institutional access levels, rank hierarchies, and manual student subscription allocations
        </p>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const userCount = MOCK_USERS.filter((u) => u.planCode === plan.code).length;
          return (
            <div
              key={plan.id}
              className="rounded-xl border border-surface-800 bg-surface-900 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <PlanBadge planCode={plan.code} />
                  <span className="font-mono text-xs text-surface-400">
                    Policy Rank: <strong className="text-white">{plan.rank}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-surface-400 mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="pt-4 border-t border-surface-800/80 flex items-center justify-between text-xs font-mono text-surface-300">
                  <span>Enrolled Scholars:</span>
                  <span className="font-bold text-white">{userCount} Students</span>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enforced by RLS
                </span>
                <Button variant="secondary" size="sm" className="text-xs h-7 px-2.5">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit Tier
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

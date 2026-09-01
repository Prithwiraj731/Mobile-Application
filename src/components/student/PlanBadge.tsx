import * as React from "react";
import { Shield, Crown, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface PlanBadgeProps {
  planCode: string;
  className?: string;
  size?: "sm" | "md";
}

export function PlanBadge({ planCode, className, size = "sm" }: PlanBadgeProps) {
  const code = (planCode || "FREE").toUpperCase();

  if (code === "PREMIUM") {
    return (
      <Badge variant="premium" size={size} className={className}>
        <Crown className="h-3 w-3" />
        <span>VIP PASS</span>
      </Badge>
    );
  }

  if (code === "PRO") {
    return (
      <Badge variant="pro" size={size} className={className}>
        <Award className="h-3 w-3" />
        <span>PRO SCHOLAR</span>
      </Badge>
    );
  }

  return (
    <Badge variant="free" size={size} className={className}>
      <Shield className="h-3 w-3" />
      <span>STANDARD PASS</span>
    </Badge>
  );
}

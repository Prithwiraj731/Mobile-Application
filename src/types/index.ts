import { Database, UserRole, UserStatus, MaterialType, AccessLevel, MaterialStatus } from "./database.types";

export * from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];
export type StudentSubscription = Database["public"]["Tables"]["student_subscriptions"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type StudentCourseEnrollment = Database["public"]["Tables"]["student_course_enrollments"]["Row"];
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Topic = Database["public"]["Tables"]["topics"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type MaterialFile = Database["public"]["Tables"]["material_files"]["Row"];
export type MaterialAccessLog = Database["public"]["Tables"]["material_access_logs"]["Row"];
export type AdminAuditLog = Database["public"]["Tables"]["admin_audit_logs"]["Row"];
export type DeviceSession = Database["public"]["Tables"]["device_sessions"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export interface AuthUserSession {
  id: string;
  email: string;
  profile: Profile;
  activeSubscription?: (StudentSubscription & { plan: SubscriptionPlan }) | null;
  enrolledCourseIds: string[];
}

export interface MaterialWithDetails extends Material {
  topic?: Topic & {
    chapter?: Chapter & {
      subject?: Subject & {
        course?: Course;
      };
    };
  };
  file?: MaterialFile | null;
  isLocked?: boolean;
  lockReason?: string;
}

export interface PreviewAuthorizationResult {
  allowed: boolean;
  material?: Material;
  file?: MaterialFile;
  signedUrl?: string;
  watermarkText?: string;
  sessionTraceId?: string;
  reason?: string;
  requiredPlanRank?: number;
  userPlanRank?: number;
}

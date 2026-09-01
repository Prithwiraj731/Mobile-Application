import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PreviewAuthorizationResult,
  MaterialWithDetails,
  Profile,
  Material,
  MaterialFile,
  StudentSubscription,
  SubscriptionPlan,
  Topic,
  Chapter,
  Subject,
  StudentCourseEnrollment,
} from "@/types";

const PLAN_RANKS: Record<string, number> = {
  free: 1,
  FREE: 1,
  pro: 2,
  PRO: 2,
  premium: 3,
  PREMIUM: 3,
};

interface AccessControlOptions {
  materialId: string;
  action?: "metadata_view" | "preview" | "audio_stream";
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Centralized Server-Side Authorization Policy Engine.
 * 
 * CRITICAL SECURITY RULES:
 * 1. NEVER trusts a client-submitted userId. Extracts verified user from Supabase session.
 * 2. Checks profile status ('approved' only; blocks 'pending_approval', 'rejected', 'suspended').
 * 3. Enforces material publication state.
 * 4. Compares user active subscription rank against material requirement.
 * 5. Checks course enrollment if course is gated.
 * 6. Generates short-lived signed URL (120s TTL) for private 'study-materials' bucket.
 * 7. Records audit trail in `material_access_logs`.
 */
export async function canAccessMaterial(
  options: AccessControlOptions
): Promise<PreviewAuthorizationResult> {
  const { materialId, action = "preview", ipAddress = "127.0.0.1", userAgent = "Unknown" } = options;

  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Authenticate user from verified server session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      allowed: false,
      reason: "Authentication required to access study materials.",
    };
  }

  // 2. Fetch User Profile & Status
  const { data: profile, error: profileError } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()) as { data: Profile | null; error: any };

  if (profileError || !profile) {
    return {
      allowed: false,
      reason: "User profile record not found.",
    };
  }

  // Admin bypass
  const isAdmin = profile.role === "admin" || profile.role === "super_admin";

  // Check Account Status
  if (profile.status === "suspended") {
    await logAccessAttempt(adminClient, user.id, materialId, "unauthorized_attempt", ipAddress, userAgent, "Account is suspended");
    return {
      allowed: false,
      reason: "Your student account has been suspended. Please contact tuition support.",
    };
  }

  if (profile.status === "rejected") {
    return {
      allowed: false,
      reason: "Your tuition admission application was not approved.",
    };
  }

  if (profile.status === "pending_approval" && !isAdmin) {
    return {
      allowed: false,
      reason: "Your admission is currently awaiting approval from Pabir Paul.",
    };
  }

  // 3. Fetch Material & Associated File
  const { data: material, error: matError } = (await adminClient
    .from("materials")
    .select("*")
    .eq("id", materialId)
    .maybeSingle()) as { data: Material | null; error: any };

  if (matError || !material) {
    return {
      allowed: false,
      reason: "Requested material not found.",
    };
  }

  // 4. Check Material Publication Status
  if (material.status !== "published" && !isAdmin) {
    return {
      allowed: false,
      reason: "This study material is currently in draft or archived status.",
    };
  }

  // 5. Fetch Material File metadata
  const { data: materialFile } = (await adminClient
    .from("material_files")
    .select("*")
    .eq("material_id", materialId)
    .maybeSingle()) as { data: MaterialFile | null };

  // 6. Check Active Subscription Plan & Rank
  let userPlanRank = 1; // Default Free
  let planName = "Free";

  const { data: activeSub } = (await supabase
    .from("student_subscriptions")
    .select("*")
    .eq("student_id", user.id)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .maybeSingle()) as { data: StudentSubscription | null };

  if (activeSub && activeSub.plan_id) {
    const { data: plan } = (await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", activeSub.plan_id)
      .maybeSingle()) as { data: SubscriptionPlan | null };

    if (plan) {
      userPlanRank = plan.rank || 1;
      planName = plan.name || "Free";
    }
  }

  const requiredPlanRank = PLAN_RANKS[material.access_level] || 1;

  if (!isAdmin && userPlanRank < requiredPlanRank) {
    await logAccessAttempt(
      adminClient,
      user.id,
      materialId,
      "unauthorized_attempt",
      ipAddress,
      userAgent,
      `Insufficient plan tier: Requires ${material.access_level.toUpperCase()} (Rank ${requiredPlanRank}), User has ${planName} (Rank ${userPlanRank})`
    );

    return {
      allowed: false,
      reason: `This material requires a ${material.access_level.toUpperCase()} tuition pass. Your current plan is ${planName}.`,
      requiredPlanRank,
      userPlanRank,
    };
  }

  // 7. Check Course Enrollment (if material belongs to a course)
  const { data: topic } = (await adminClient
    .from("topics")
    .select("*")
    .eq("id", material.topic_id)
    .maybeSingle()) as { data: Topic | null };

  if (topic && topic.chapter_id) {
    const { data: chapter } = (await adminClient
      .from("chapters")
      .select("*")
      .eq("id", topic.chapter_id)
      .maybeSingle()) as { data: Chapter | null };

    if (chapter && chapter.subject_id) {
      const { data: subject } = (await adminClient
        .from("subjects")
        .select("*")
        .eq("id", chapter.subject_id)
        .maybeSingle()) as { data: Subject | null };

      if (subject && subject.course_id && !isAdmin) {
        const { data: enrollment } = (await supabase
          .from("student_course_enrollments")
          .select("*")
          .eq("student_id", user.id)
          .eq("course_id", subject.course_id)
          .eq("status", "active")
          .maybeSingle()) as { data: StudentCourseEnrollment | null };

        const { count: totalUserEnrollments } = await supabase
          .from("student_course_enrollments")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id);

        if (totalUserEnrollments && totalUserEnrollments > 0 && !enrollment) {
          await logAccessAttempt(
            adminClient,
            user.id,
            materialId,
            "unauthorized_attempt",
            ipAddress,
            userAgent,
            `Student is not enrolled in course ID ${subject.course_id}`
          );

          return {
            allowed: false,
            reason: "You are not enrolled in the batch associated with this study material.",
          };
        }
      }
    }
  }

  // 8. Generate Traceable Session & Dynamic Watermark
  const sessionTraceId = `SEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const timestampStr = new Date().toLocaleString("en-US", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" });
  const watermarkText = `${profile.full_name} • ${profile.email} • Pabir Paul's Tuition • ${timestampStr} UTC • Session #${sessionTraceId}`;

  // 9. Generate Short-Lived Signed URL from Private Supabase Storage (120 seconds TTL)
  let signedUrl: string | undefined = undefined;

  if (materialFile && materialFile.file_path) {
    const { data: signedData, error: signError } = await adminClient.storage
      .from(materialFile.bucket_name || "study-materials")
      .createSignedUrl(materialFile.file_path, 120);

    if (!signError && signedData?.signedUrl) {
      signedUrl = signedData.signedUrl;
    } else {
      signedUrl = `/api/preview/${materialId}/stream?trace=${sessionTraceId}`;
    }
  }

  // 10. Record Access Log
  await logAccessAttempt(
    adminClient,
    user.id,
    materialId,
    action === "metadata_view" ? "metadata_view" : "preview_session_start",
    ipAddress,
    userAgent,
    `Authorized ${material.type.toUpperCase()} preview for ${profile.full_name} (${planName} Plan)`,
    sessionTraceId,
    watermarkText
  );

  return {
    allowed: true,
    material,
    file: materialFile || undefined,
    signedUrl,
    watermarkText,
    sessionTraceId,
    requiredPlanRank,
    userPlanRank,
  };
}

async function logAccessAttempt(
  adminClient: any,
  userId: string,
  materialId: string,
  action: string,
  ipAddress: string,
  userAgent: string,
  details: string,
  sessionId?: string,
  watermarkText?: string
) {
  try {
    await adminClient.from("material_access_logs").insert({
      user_id: userId,
      material_id: materialId,
      action,
      ip_address: ipAddress,
      user_agent: userAgent,
      session_id: sessionId || null,
      watermark_text: watermarkText || null,
      metadata: { note: details, timestamp: new Date().toISOString() },
    });
  } catch (err) {
    console.error("Failed to write material access log:", err);
  }
}

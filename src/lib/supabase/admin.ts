import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * STRICTLY SERVER-ONLY Supabase Admin Client.
 * Powered by SUPABASE_SERVICE_ROLE_KEY for privileged operations:
 * - Admin audit logging
 * - Account approval / suspension
 * - Generating short-lived signed URLs for private 'study-materials' bucket
 * 
 * NEVER import this file into Client Components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-securelearn-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined in environment.");
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey || "mock-service-role-key", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "admin" | "super_admin";
export type UserStatus = "pending_approval" | "approved" | "rejected" | "suspended";
export type MaterialType = "pdf" | "image" | "audio" | "text_note";
export type AccessLevel = "free" | "pro" | "premium";
export type MaterialStatus = "draft" | "published" | "archived";
export type SubscriptionStatus = "active" | "expired" | "cancelled";
export type EnrollmentStatus = "active" | "completed" | "revoked";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          address: string | null;
          role: UserRole;
          status: UserStatus;
          avatar_url: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone_number?: string | null;
          address?: string | null;
          role?: UserRole;
          status?: UserStatus;
          avatar_url?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          address?: string | null;
          role?: UserRole;
          status?: UserStatus;
          avatar_url?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          code: string;
          rank: number;
          description: string | null;
          price_cents: number;
          duration_days: number;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          rank?: number;
          description?: string | null;
          price_cents?: number;
          duration_days?: number;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          rank?: number;
          description?: string | null;
          price_cents?: number;
          duration_days?: number;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      student_subscriptions: {
        Row: {
          id: string;
          student_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          starts_at: string;
          expires_at: string;
          assigned_by_admin_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          starts_at?: string;
          expires_at: string;
          assigned_by_admin_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          plan_id?: string;
          status?: SubscriptionStatus;
          starts_at?: string;
          expires_at?: string;
          assigned_by_admin_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          code: string;
          description: string | null;
          thumbnail_url: string | null;
          is_published: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          code: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          code?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          is_published?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_course_enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          status: EnrollmentStatus;
          enrolled_at: string;
          expires_at: string | null;
          assigned_by_admin_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          enrolled_at?: string;
          expires_at?: string | null;
          assigned_by_admin_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          status?: EnrollmentStatus;
          enrolled_at?: string;
          expires_at?: string | null;
          assigned_by_admin_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          slug: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          slug: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          slug: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          slug: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          chapter_id: string;
          title: string;
          slug: string;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          title: string;
          slug: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      materials: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          description: string | null;
          type: MaterialType;
          access_level: AccessLevel;
          status: MaterialStatus;
          order_index: number;
          content_text: string | null;
          created_by_admin_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          title: string;
          description?: string | null;
          type: MaterialType;
          access_level?: AccessLevel;
          status?: MaterialStatus;
          order_index?: number;
          content_text?: string | null;
          created_by_admin_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          title?: string;
          description?: string | null;
          type?: MaterialType;
          access_level?: AccessLevel;
          status?: MaterialStatus;
          order_index?: number;
          content_text?: string | null;
          created_by_admin_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      material_files: {
        Row: {
          id: string;
          material_id: string;
          bucket_name: string;
          file_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          checksum_sha256: string | null;
          page_count: number | null;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          material_id: string;
          bucket_name?: string;
          file_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes?: number;
          checksum_sha256?: string | null;
          page_count?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          material_id?: string;
          bucket_name?: string;
          file_path?: string;
          original_filename?: string;
          mime_type?: string;
          size_bytes?: number;
          checksum_sha256?: string | null;
          page_count?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      material_access_logs: {
        Row: {
          id: string;
          user_id: string | null;
          material_id: string | null;
          action: string;
          ip_address: string | null;
          user_agent: string | null;
          session_id: string | null;
          watermark_text: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          material_id?: string | null;
          action: string;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          watermark_text?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          material_id?: string | null;
          action?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          watermark_text?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          target_user_id: string | null;
          target_material_id: string | null;
          action: string;
          ip_address: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          target_user_id?: string | null;
          target_material_id?: string | null;
          action: string;
          ip_address?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          target_user_id?: string | null;
          target_material_id?: string | null;
          action?: string;
          ip_address?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      device_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          device_name: string | null;
          browser: string | null;
          os: string | null;
          ip_address: string | null;
          last_active_at: string;
          is_revoked: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          device_name?: string | null;
          browser?: string | null;
          os?: string | null;
          ip_address?: string | null;
          last_active_at?: string;
          is_revoked?: boolean;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          device_name?: string | null;
          browser?: string | null;
          os?: string | null;
          ip_address?: string | null;
          last_active_at?: string;
          is_revoked?: boolean;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "info" | "success" | "warning" | "security_alert";
          is_read: boolean;
          link_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: "info" | "success" | "warning" | "security_alert";
          is_read?: boolean;
          link_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: "info" | "success" | "warning" | "security_alert";
          is_read?: boolean;
          link_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

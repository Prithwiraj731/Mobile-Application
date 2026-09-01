-- ============================================================================
-- SECURE LEARNING PLATFORM - INITIAL SCHEMA MIGRATION
-- Database: Supabase PostgreSQL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked 1:1 with auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    address TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected', 'suspended')),
    avatar_url TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraints & indexes on profiles
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_key ON public.profiles (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_key ON public.profiles (phone_number) WHERE phone_number IS NOT NULL AND phone_number <> '';
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles (status);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    rank INTEGER NOT NULL DEFAULT 1, -- 1: Free, 2: Pro, 3: Premium
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    duration_days INTEGER NOT NULL DEFAULT 30,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. STUDENT SUBSCRIPTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    assigned_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS student_subscriptions_student_idx ON public.student_subscriptions (student_id, status);
CREATE INDEX IF NOT EXISTS student_subscriptions_expiry_idx ON public.student_subscriptions (expires_at);

-- ----------------------------------------------------------------------------
-- 4. COURSES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. STUDENT COURSE ENROLLMENTS TABLE (Course/Batch Assignment)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'revoked')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    assigned_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT student_course_unique UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS student_enrollments_student_idx ON public.student_course_enrollments (student_id, status);
CREATE INDEX IF NOT EXISTS student_enrollments_course_idx ON public.student_course_enrollments (course_id);

-- ----------------------------------------------------------------------------
-- 6. SUBJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT subject_course_slug_unique UNIQUE (course_id, slug)
);

CREATE INDEX IF NOT EXISTS subjects_course_order_idx ON public.subjects (course_id, order_index);

-- ----------------------------------------------------------------------------
-- 7. CHAPTERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chapter_subject_slug_unique UNIQUE (subject_id, slug)
);

CREATE INDEX IF NOT EXISTS chapters_subject_order_idx ON public.chapters (subject_id, order_index);

-- ----------------------------------------------------------------------------
-- 8. TOPICS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT topic_chapter_slug_unique UNIQUE (chapter_id, slug)
);

CREATE INDEX IF NOT EXISTS topics_chapter_order_idx ON public.topics (chapter_id, order_index);

-- ----------------------------------------------------------------------------
-- 9. MATERIALS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'image', 'audio', 'text_note')),
    access_level TEXT NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'pro', 'premium')),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    order_index INTEGER NOT NULL DEFAULT 0,
    content_text TEXT,
    created_by_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS materials_topic_idx ON public.materials (topic_id, status, access_level);
CREATE INDEX IF NOT EXISTS materials_access_idx ON public.materials (access_level, status);

-- ----------------------------------------------------------------------------
-- 10. MATERIAL FILES TABLE (Private Object Storage References)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    bucket_name TEXT NOT NULL DEFAULT 'study-materials',
    file_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    checksum_sha256 TEXT,
    page_count INTEGER,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS material_files_material_idx ON public.material_files (material_id);

-- ----------------------------------------------------------------------------
-- 11. MATERIAL ACCESS LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'metadata_view', 'preview_session_start', 'page_view', 'audio_play', 'unauthorized_attempt'
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    watermark_text TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS access_logs_user_mat_time_idx ON public.material_access_logs (user_id, material_id, created_at DESC);
CREATE INDEX IF NOT EXISTS access_logs_created_at_idx ON public.material_access_logs (created_at DESC);

-- ----------------------------------------------------------------------------
-- 12. ADMIN AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'approve_student', 'reject_student', 'suspend_student', 'assign_subscription', 'upload_material', 'publish_material', 'archive_material'
    ip_address TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_admin_time_idx ON public.admin_audit_logs (admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.admin_audit_logs (action);

-- ----------------------------------------------------------------------------
-- 13. DEVICE SESSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_name TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS device_sessions_user_active_idx ON public.device_sessions (user_id, is_revoked, expires_at);

-- ----------------------------------------------------------------------------
-- 14. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'security_alert')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx ON public.notifications (user_id, is_read);

-- ----------------------------------------------------------------------------
-- AUTH.USERS -> PUBLIC.PROFILES TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_plan_id UUID;
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone_number,
        address,
        role,
        status
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        new.raw_user_meta_data->>'phone_number',
        new.raw_user_meta_data->>'address',
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        CASE 
            WHEN COALESCE(new.raw_user_meta_data->>'role', 'student') IN ('admin', 'super_admin') THEN 'approved'
            ELSE 'pending_approval'
        END
    );

    -- If registered as student, auto-assign default Free Plan
    IF COALESCE(new.raw_user_meta_data->>'role', 'student') = 'student' THEN
        SELECT id INTO default_plan_id FROM public.subscription_plans WHERE is_default = true OR code = 'FREE' LIMIT 1;
        IF default_plan_id IS NOT NULL THEN
            INSERT INTO public.student_subscriptions (
                student_id,
                plan_id,
                status,
                starts_at,
                expires_at,
                notes
            )
            VALUES (
                new.id,
                default_plan_id,
                'active',
                NOW(),
                NOW() + INTERVAL '365 days',
                'Default Free plan assigned on registration'
            );
        END IF;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

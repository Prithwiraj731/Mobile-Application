-- ============================================================================
-- SECURE LEARNING PLATFORM - ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SECURITY HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Check if current authenticated user has an admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current user is an approved student
CREATE OR REPLACE FUNCTION public.is_approved_student()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'student'
          AND status = 'approved'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get the highest plan rank of the user's active subscriptions
CREATE OR REPLACE FUNCTION public.current_user_plan_rank()
RETURNS integer AS $$
DECLARE
    max_rank integer := 1;
BEGIN
    SELECT COALESCE(MAX(sp.rank), 1) INTO max_rank
    FROM public.student_subscriptions ss
    JOIN public.subscription_plans sp ON ss.plan_id = sp.id
    WHERE ss.student_id = auth.uid()
      AND ss.status = 'active'
      AND ss.expires_at > NOW();
      
    RETURN COALESCE(max_rank, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile or admin can view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own details"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (
        -- If student updating own profile, cannot modify role or status
        (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND status = (SELECT status FROM public.profiles WHERE id = auth.uid()))
        OR public.is_admin()
    );

CREATE POLICY "Admins can insert or delete profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public/Students can view active plans"
    ON public.subscription_plans FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full access to subscription plans"
    ON public.subscription_plans FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. STUDENT SUBSCRIPTIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Students can view their own subscriptions"
    ON public.student_subscriptions FOR SELECT
    USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins have full access to student subscriptions"
    ON public.student_subscriptions FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. COURSES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Approved students and public can view published courses"
    ON public.courses FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins have full access to courses"
    ON public.courses FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. STUDENT COURSE ENROLLMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Students can view their own course enrollments"
    ON public.student_course_enrollments FOR SELECT
    USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins have full access to enrollments"
    ON public.student_course_enrollments FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. SUBJECTS, CHAPTERS, TOPICS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view subjects of published courses"
    ON public.subjects FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = subjects.course_id AND (c.is_published = true OR public.is_admin())));

CREATE POLICY "Admins manage subjects"
    ON public.subjects FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can view chapters"
    ON public.chapters FOR SELECT
    USING (true);

CREATE POLICY "Admins manage chapters"
    ON public.chapters FOR ALL
    USING (public.is_admin());

CREATE POLICY "Users can view topics"
    ON public.topics FOR SELECT
    USING (true);

CREATE POLICY "Admins manage topics"
    ON public.topics FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. MATERIALS POLICIES (Plan-Gated Database Level Defense)
-- ----------------------------------------------------------------------------
CREATE POLICY "Access control for materials"
    ON public.materials FOR SELECT
    USING (
        public.is_admin()
        OR (
            status = 'published'
            AND public.is_approved_student()
            AND (
                access_level = 'free'
                OR (access_level = 'pro' AND public.current_user_plan_rank() >= 2)
                OR (access_level = 'premium' AND public.current_user_plan_rank() >= 3)
            )
        )
    );

CREATE POLICY "Admins manage materials"
    ON public.materials FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. MATERIAL FILES POLICIES
-- ----------------------------------------------------------------------------
-- Direct file metadata is restricted to admins; student signed preview URLs are issued by the secure server
CREATE POLICY "Admins can view and manage material files"
    ON public.material_files FOR ALL
    USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 9. ACCESS & AUDIT LOGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view all access logs; students view own"
    ON public.material_access_logs FOR SELECT
    USING (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "Server and users can record access logs"
    ON public.material_access_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins view audit logs"
    ON public.admin_audit_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins insert audit logs"
    ON public.admin_audit_logs FOR INSERT
    WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 10. SESSIONS & NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users manage own device sessions"
    ON public.device_sessions FOR ALL
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users view and manage own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage notifications"
    ON public.notifications FOR ALL
    USING (public.is_admin());

-- ============================================================================
-- SECURE LEARNING PLATFORM - STORAGE BUCKET CONFIGURATION & POLICIES
-- ============================================================================

-- Create private storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'study-materials',
        'study-materials',
        false, -- STRICTLY PRIVATE BUCKET
        52428800, -- 50MB limit
        ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'text/plain']::text[]
    ),
    (
        'profile-images',
        'profile-images',
        false,
        5242880, -- 5MB limit
        ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- STORAGE RLS POLICIES
-- ----------------------------------------------------------------------------

-- 1. Study Materials: Only Admins have direct storage management.
-- Students access content strictly via short-lived signed URLs created by the backend authorization policy engine.
CREATE POLICY "Admins have full access to study materials bucket"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'study-materials'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role IN ('admin', 'super_admin')
        )
    );

-- 2. Profile Images: Authenticated users can upload and view avatars
CREATE POLICY "Authenticated users can upload own profile picture"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Authenticated users can view profile pictures"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'profile-images'
        AND auth.uid() IS NOT NULL
    );

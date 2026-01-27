-- SQL Fix: Synchronize existing users to the perfiles table
-- This ensures that users who existed before the trigger was created are also available for assignment.
INSERT INTO public.perfiles (id, email, nombre)
SELECT id,
    email,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
    )
FROM auth.users ON CONFLICT (id) DO NOTHING;
-- Also ensure the RLS policy is correct
DROP POLICY IF EXISTS "Profiles are viewable by all authenticated users" ON perfiles;
CREATE POLICY "Profiles are viewable by all authenticated users" ON perfiles FOR
SELECT USING (true);
-- Simplified for testing if needed, but authenticated is better
-- Re-applying the authenticated one for security
ALTER POLICY "Profiles are viewable by all authenticated users" ON perfiles USING (auth.role() = 'authenticated');
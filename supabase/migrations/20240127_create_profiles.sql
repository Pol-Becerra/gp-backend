-- Migration: Create perfiles table and sync with auth.users
-- 1. Create the table
CREATE TABLE IF NOT EXISTS perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Enable RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
-- 3. RLS Policies
CREATE POLICY "Profiles are viewable by all authenticated users" ON perfiles FOR
SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON perfiles FOR
UPDATE USING (auth.uid() = id);
-- 4. Sync Function
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.perfiles (id, email, nombre)
VALUES (
        new.id,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            split_part(new.email, '@', 1)
        )
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 5. Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 6. Initial Sync (optional/manual - run this if there are existing users)
-- INSERT INTO public.perfiles (id, email, nombre)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
-- FROM auth.users
-- ON CONFLICT (id) DO NOTHING;
-- SigMotion: security, teams, and storage fixes
-- Run after 001_initial_schema.sql in the Supabase SQL Editor. Safe to re-run.

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so policies can call them without
-- recursing into org_members RLS)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_org_member(org UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = org AND user_id = (SELECT auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(org UUID, roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_id = org AND user_id = (SELECT auth.uid()) AND role = ANY (roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.shares_org_with(other UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members me
    JOIN public.org_members them ON them.org_id = me.org_id
    WHERE me.user_id = (SELECT auth.uid()) AND them.user_id = other
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.org_members (org_id, user_id, role)
  SELECT i.org_id, NEW.id, i.role
  FROM public.org_invites i
  WHERE lower(i.email) = lower(NEW.email)
  ON CONFLICT (org_id, user_id) DO NOTHING;

  DELETE FROM public.org_invites WHERE lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$$;

-- Creates an organization and makes the caller its owner in one step.
CREATE OR REPLACE FUNCTION public.create_organization(org_name TEXT, org_slug TEXT)
RETURNS public.organizations
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_org public.organizations;
  uid UUID := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM public.org_members WHERE user_id = uid) THEN
    RAISE EXCEPTION 'You already belong to an organization';
  END IF;

  INSERT INTO public.organizations (name, slug)
  VALUES (org_name, org_slug)
  RETURNING * INTO new_org;

  INSERT INTO public.org_members (org_id, user_id, role)
  VALUES (new_org.id, uid, 'owner');

  RETURN new_org;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- Profiles: backfill, let teammates see each other, enable PostgREST embed
-- from org_members -> profiles
-- ---------------------------------------------------------------------------

INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Org peers can view profiles" ON public.profiles;
CREATE POLICY "Org peers can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.shares_org_with(id));

ALTER TABLE public.org_members
  DROP CONSTRAINT IF EXISTS org_members_user_id_profiles_fkey;
ALTER TABLE public.org_members
  ADD CONSTRAINT org_members_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ---------------------------------------------------------------------------
-- Organizations
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Owners can update org" ON public.organizations;
DROP POLICY IF EXISTS "Authenticated users can create org" ON public.organizations;

CREATE POLICY "Owners can update org" ON public.organizations
  FOR UPDATE TO authenticated
  USING (public.has_org_role(id, ARRAY['owner']))
  WITH CHECK (public.has_org_role(id, ARRAY['owner']));

-- ---------------------------------------------------------------------------
-- Org members (old FOR ALL policy queried org_members from inside its own
-- policy, which Postgres rejects as infinite recursion)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Admins can add members" ON public.org_members;
DROP POLICY IF EXISTS "Admins can update members" ON public.org_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.org_members;

CREATE POLICY "Admins can add members" ON public.org_members
  FOR INSERT TO authenticated
  WITH CHECK (public.has_org_role(org_id, ARRAY['owner', 'admin']) AND role <> 'owner');

CREATE POLICY "Admins can update members" ON public.org_members
  FOR UPDATE TO authenticated
  USING (public.has_org_role(org_id, ARRAY['owner', 'admin']) AND role <> 'owner')
  WITH CHECK (role <> 'owner');

CREATE POLICY "Admins can remove members" ON public.org_members
  FOR DELETE TO authenticated
  USING (public.has_org_role(org_id, ARRAY['owner', 'admin']) AND role <> 'owner');

-- ---------------------------------------------------------------------------
-- Signatures / links / clicks: public access goes through the server
-- (service role), never directly through the anon key
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Public slug readable" ON public.signatures;
DROP POLICY IF EXISTS "Anyone can read links for redirect" ON public.tracked_links;
DROP POLICY IF EXISTS "Service can insert clicks" ON public.click_events;

-- Stable per-signature key so edits update links in place. Old short links
-- are never deleted because they live on in already-sent emails.
ALTER TABLE public.tracked_links ADD COLUMN IF NOT EXISTS link_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tracked_links_signature_key
  ON public.tracked_links(signature_id, link_key);

-- ---------------------------------------------------------------------------
-- Bulk import jobs: allow personal (non-org) jobs
-- ---------------------------------------------------------------------------

ALTER TABLE public.bulk_import_jobs
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.bulk_import_jobs ALTER COLUMN org_id DROP NOT NULL;

DROP POLICY IF EXISTS "Org members manage bulk jobs" ON public.bulk_import_jobs;
CREATE POLICY "Owners manage bulk jobs" ON public.bulk_import_jobs
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (org_id IS NOT NULL AND public.is_org_member(org_id)))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- Org invites
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins manage invites" ON public.org_invites;
CREATE POLICY "Admins manage invites" ON public.org_invites
  FOR ALL TO authenticated
  USING (public.has_org_role(org_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_org_role(org_id, ARRAY['owner', 'admin']));

-- ---------------------------------------------------------------------------
-- Storage: public bucket for signature images. Users may only write inside
-- a folder named after their user id.
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'signatures-public',
  'signatures-public',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users upload own signature images" ON storage.objects;
DROP POLICY IF EXISTS "Users update own signature images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own signature images" ON storage.objects;

CREATE POLICY "Users upload own signature images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'signatures-public'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users update own signature images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'signatures-public'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users delete own signature images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'signatures-public'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

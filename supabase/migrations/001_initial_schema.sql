-- SigMotion Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Org members
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Signatures
CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id TEXT NOT NULL DEFAULT 'nav-left',
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  html_output TEXT NOT NULL DEFAULT '',
  public_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracked links
CREATE TABLE IF NOT EXISTS tracked_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signature_id UUID NOT NULL REFERENCES signatures(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Click events
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES tracked_links(id) ON DELETE CASCADE,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulk import jobs
CREATE TABLE IF NOT EXISTS bulk_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  csv_data JSONB NOT NULL DEFAULT '[]',
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Org invites
CREATE TABLE IF NOT EXISTS org_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_signatures_org ON signatures(org_id);
CREATE INDEX IF NOT EXISTS idx_signatures_owner ON signatures(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_signatures_slug ON signatures(public_slug);
CREATE INDEX IF NOT EXISTS idx_tracked_links_short ON tracked_links(short_id);
CREATE INDEX IF NOT EXISTS idx_click_events_link ON click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_created ON click_events(created_at);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Org members helper
CREATE OR REPLACE FUNCTION is_org_member(org UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_members WHERE org_id = org AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Members can view org" ON organizations FOR SELECT USING (is_org_member(id));
CREATE POLICY "Owners can update org" ON organizations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM org_members WHERE org_id = id AND user_id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Authenticated users can create org" ON organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Org members policies
CREATE POLICY "Members can view org members" ON org_members FOR SELECT USING (is_org_member(org_id));
CREATE POLICY "Admins can manage members" ON org_members FOR ALL USING (
  EXISTS (SELECT 1 FROM org_members om WHERE om.org_id = org_members.org_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin'))
);

-- Signatures policies
CREATE POLICY "Users can view own signatures" ON signatures FOR SELECT USING (
  owner_user_id = auth.uid() OR (org_id IS NOT NULL AND is_org_member(org_id))
);
CREATE POLICY "Public slug readable" ON signatures FOR SELECT USING (true);
CREATE POLICY "Users can insert signatures" ON signatures FOR INSERT WITH CHECK (
  owner_user_id = auth.uid()
);
CREATE POLICY "Users can update own signatures" ON signatures FOR UPDATE USING (
  owner_user_id = auth.uid() OR (org_id IS NOT NULL AND is_org_member(org_id))
);
CREATE POLICY "Users can delete own signatures" ON signatures FOR DELETE USING (
  owner_user_id = auth.uid()
);

-- Tracked links policies
CREATE POLICY "Signature owners manage links" ON tracked_links FOR ALL USING (
  EXISTS (SELECT 1 FROM signatures s WHERE s.id = signature_id AND (s.owner_user_id = auth.uid() OR (s.org_id IS NOT NULL AND is_org_member(s.org_id))))
);
CREATE POLICY "Anyone can read links for redirect" ON tracked_links FOR SELECT USING (true);

-- Click events — insert via service role; read by signature owners
CREATE POLICY "Signature owners view clicks" ON click_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM tracked_links tl
    JOIN signatures s ON s.id = tl.signature_id
    WHERE tl.id = link_id AND (s.owner_user_id = auth.uid() OR (s.org_id IS NOT NULL AND is_org_member(s.org_id)))
  )
);
CREATE POLICY "Service can insert clicks" ON click_events FOR INSERT WITH CHECK (true);

-- Bulk jobs policies
CREATE POLICY "Org members manage bulk jobs" ON bulk_import_jobs FOR ALL USING (is_org_member(org_id));

-- Org invites policies
CREATE POLICY "Admins manage invites" ON org_invites FOR ALL USING (
  EXISTS (SELECT 1 FROM org_members om WHERE om.org_id = org_invites.org_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin'))
);

-- Storage buckets (run in Supabase Dashboard > Storage)
-- Create bucket: signatures-public (public)
-- Create bucket: uploads-private (private)

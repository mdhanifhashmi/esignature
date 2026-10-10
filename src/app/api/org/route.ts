import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { nanoid } from "nanoid";

type Client = Awaited<ReturnType<typeof createClient>>;

async function loadMembers(supabase: Client, orgId: string) {
  const { data } = await supabase
    .from("org_members")
    .select("id, role, user_id, profiles(full_name)")
    .eq("org_id", orgId);
  return data ?? [];
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, organizations(id, name, slug)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership?.organizations) {
    return NextResponse.json({ org: null, members: [] });
  }

  return NextResponse.json({
    org: membership.organizations,
    members: await loadMembers(supabase, membership.org_id),
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!name) {
    return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
  }

  const { data: org, error } = await supabase.rpc("create_organization", {
    org_name: name,
    org_slug: `${slugify(name) || "team"}-${nanoid(4)}`,
  });

  if (error || !org) {
    return NextResponse.json({ error: error?.message ?? "Failed to create organization" }, { status: 400 });
  }

  return NextResponse.json({ org, members: await loadMembers(supabase, org.id) });
}

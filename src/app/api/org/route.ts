import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { nanoid } from "nanoid";
import { getDefaultConfig, renderSignatureHtml } from "@/lib/signature/renderHtml";
import type { SignatureConfig } from "@/types/signature";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, organizations(name, slug)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const member = membership as { org_id: string; organizations: { name: string; slug: string } } | null;

  if (!member) {
    return NextResponse.json({ org: null, members: [] });
  }

  const { data: members } = await supabase
    .from("org_members")
    .select("id, role, user_id, profiles(full_name)")
    .eq("org_id", member.org_id);

  return NextResponse.json({
    org: member.organizations,
    members: members ?? [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json();
  const slug = `${slugify(name)}-${nanoid(4)}`;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name, slug })
    .select()
    .single();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 });
  }

  await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: user.id,
    role: "owner",
  });

  return NextResponse.json({ org });
}

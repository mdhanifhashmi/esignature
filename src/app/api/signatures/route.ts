import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import type { Json } from "@/types/database";
import { renderSignatureHtml } from "@/lib/signature/renderHtml";
import { normalizeConfig, renderAndStoreHtml } from "@/lib/signature/persist";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ signatures: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("signatures")
    .select("*")
    .eq("owner_user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signatures: data });
}

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to save signatures" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const config = normalizeConfig(body?.config);
  if (!config) {
    return NextResponse.json({ error: "Invalid signature config" }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 100) : "My Signature";
  const publicSlug = `${slugify(name) || "signature"}-${nanoid(6)}`;

  const { data: signature, error } = await supabase
    .from("signatures")
    .insert({
      owner_user_id: user.id,
      template_id: config.templateId,
      name,
      config: config as unknown as Json,
      html_output: renderSignatureHtml(config),
      public_slug: publicSlug,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const html = await renderAndStoreHtml(supabase, signature.id, config);
  return NextResponse.json({ ...signature, html_output: html });
}

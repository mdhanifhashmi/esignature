import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import type { Json } from "@/types/database";
import type { SignatureConfig } from "@/types/signature";
import { renderSignatureHtml } from "@/lib/signature/renderHtml";
import { APP_URL } from "@/lib/constants";

async function createTrackedLinks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  signatureId: string,
  config: SignatureConfig
) {
  const trackedLinkMap: Record<string, string> = {};

  const links = [
    ...config.socialLinks.filter((l) => l.enabled && l.url),
    ...(config.website ? [{ label: "website", url: config.website }] : []),
  ];

  for (const link of links) {
    const shortId = nanoid(8);
    await supabase.from("tracked_links").insert({
      signature_id: signatureId,
      label: link.label,
      destination_url: link.url,
      short_id: shortId,
    });
    trackedLinkMap[link.label.toLowerCase()] = `${APP_URL}/r/${shortId}`;
  }

  return trackedLinkMap;
}

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

  const body = await request.json();
  const config = body.config as SignatureConfig;
  const name = body.name ?? "My Signature";
  const publicSlug = `${slugify(name)}-${nanoid(6)}`;

  const { data: signature, error } = await supabase
    .from("signatures")
    .insert({
      owner_user_id: user.id,
      template_id: config.templateId,
      name,
      config: config as unknown as Json,
      html_output: body.html_output ?? renderSignatureHtml(config),
      public_slug: publicSlug,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const trackedLinkMap = await createTrackedLinks(supabase, signature.id, config);
  const htmlWithTracking = renderSignatureHtml(config, {
    trackedLinkMap,
    logoGifUrl: config.logoGifUrl,
    profileGifUrl: config.profileGifUrl,
  });

  await supabase
    .from("signatures")
    .update({ html_output: htmlWithTracking })
    .eq("id", signature.id);

  return NextResponse.json({ ...signature, html_output: htmlWithTracking });
}

import { nanoid } from "nanoid";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { SignatureConfig } from "@/types/signature";
import { APP_URL } from "@/lib/constants";
import {
  CONTACT_WEBSITE_LINK_KEY,
  getDefaultConfig,
  renderSignatureHtml,
  sanitizeConfig,
  socialLinkKey,
} from "@/lib/signature/renderHtml";

type Client = SupabaseClient<Database>;

export function normalizeConfig(input: unknown): SignatureConfig | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  return sanitizeConfig({ ...getDefaultConfig(), ...(input as Partial<SignatureConfig>) });
}

async function syncTrackedLinks(
  supabase: Client,
  signatureId: string,
  config: SignatureConfig
): Promise<Record<string, string>> {
  const desired = [
    ...config.socialLinks
      .filter((l) => l.enabled && l.url)
      .map((l) => ({ key: socialLinkKey(l.id), label: l.label, url: l.url })),
    ...(config.website
      ? [{ key: CONTACT_WEBSITE_LINK_KEY, label: "Website (contact)", url: config.website }]
      : []),
  ];

  const { data: existing } = await supabase
    .from("tracked_links")
    .select("id, link_key, label, destination_url, short_id")
    .eq("signature_id", signatureId);

  const byKey = new Map((existing ?? []).filter((l) => l.link_key).map((l) => [l.link_key!, l]));
  const trackedLinkMap: Record<string, string> = {};

  for (const link of desired) {
    const current = byKey.get(link.key);
    if (current) {
      if (current.destination_url !== link.url || current.label !== link.label) {
        await supabase
          .from("tracked_links")
          .update({ destination_url: link.url, label: link.label })
          .eq("id", current.id);
      }
      trackedLinkMap[link.key] = `${APP_URL}/r/${current.short_id}`;
      continue;
    }

    const shortId = nanoid(8);
    const { error } = await supabase.from("tracked_links").insert({
      signature_id: signatureId,
      link_key: link.key,
      label: link.label,
      destination_url: link.url,
      short_id: shortId,
    });
    if (!error) trackedLinkMap[link.key] = `${APP_URL}/r/${shortId}`;
  }

  return trackedLinkMap;
}

/** Re-renders a signature with tracked links and stores the result. */
export async function renderAndStoreHtml(
  supabase: Client,
  signatureId: string,
  config: SignatureConfig
): Promise<string> {
  const trackedLinkMap = await syncTrackedLinks(supabase, signatureId, config);
  const html = renderSignatureHtml(config, { trackedLinkMap });
  await supabase.from("signatures").update({ html_output: html }).eq("id", signatureId);
  return html;
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import { renderSignatureHtml } from "@/lib/signature/renderHtml";
import { normalizeConfig, renderAndStoreHtml } from "@/lib/signature/persist";
import type { Json } from "@/types/database";
import type { SignatureConfig } from "@/types/signature";

const MAX_ROWS = 200;

interface CsvRow {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

function rowToConfig(row: CsvRow, baseConfig: SignatureConfig): SignatureConfig | null {
  const socialLinks = baseConfig.socialLinks.map((link) => {
    if (link.type === "linkedin" && row.linkedin) return { ...link, url: row.linkedin, enabled: true };
    if (link.type === "website" && row.website) return { ...link, url: row.website, enabled: true };
    return { ...link };
  });

  return normalizeConfig({
    ...baseConfig,
    fullName: row.name ?? "",
    jobTitle: row.title ?? "",
    company: row.company ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    website: row.website ?? "",
    socialLinks,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const rows: CsvRow[] = Array.isArray(body?.rows) ? body.rows : [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV has no rows" }, { status: 400 });
  }
  if (rows.length > MAX_ROWS) {
    return NextResponse.json({ error: `Import up to ${MAX_ROWS} rows at a time` }, { status: 400 });
  }

  const baseConfig = normalizeConfig(body.templateConfig ?? {})!;
  const results: { name: string; status: "success" | "error"; id?: string; error?: string }[] = [];

  for (const row of rows) {
    if (!row?.name) {
      results.push({ name: "Unknown", status: "error", error: "Missing name" });
      continue;
    }

    try {
      const config = rowToConfig(row, baseConfig);
      if (!config) throw new Error("Invalid row");

      const { data, error } = await supabase
        .from("signatures")
        .insert({
          owner_user_id: user.id,
          template_id: config.templateId,
          name: `${row.name} - ${row.company || "Signature"}`.slice(0, 100),
          config: config as unknown as Json,
          html_output: renderSignatureHtml(config),
          public_slug: `${slugify(row.name) || "signature"}-${nanoid(6)}`,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      await renderAndStoreHtml(supabase, data.id, config);
      results.push({ name: row.name, status: "success", id: data.id });
    } catch (err) {
      results.push({
        name: row.name,
        status: "error",
        error: err instanceof Error ? err.message : "Failed",
      });
    }
  }

  await supabase.from("bulk_import_jobs").insert({
    user_id: user.id,
    status: "completed",
    csv_data: rows as unknown as Json,
    results: { results } as unknown as Json,
  });

  return NextResponse.json({ results });
}

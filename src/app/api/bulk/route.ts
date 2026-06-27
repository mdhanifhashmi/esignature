import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";
import { getDefaultConfig, renderSignatureHtml } from "@/lib/signature/renderHtml";
import type { SignatureConfig } from "@/types/signature";
import JSZip from "jszip";

interface CsvRow {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

function rowToConfig(row: CsvRow, baseConfig: SignatureConfig): SignatureConfig {
  const socialLinks = [...baseConfig.socialLinks];
  if (row.linkedin) {
    const li = socialLinks.find((l) => l.type === "linkedin");
    if (li) {
      li.url = row.linkedin;
      li.enabled = true;
    }
  }
  if (row.website) {
    const web = socialLinks.find((l) => l.type === "website");
    if (web) {
      web.url = row.website;
      web.enabled = true;
    }
  }

  return {
    ...baseConfig,
    fullName: row.name ?? "",
    jobTitle: row.title ?? "",
    company: row.company ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    website: row.website ?? "",
    socialLinks,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows, templateConfig } = await request.json() as {
    rows: CsvRow[];
    templateConfig?: SignatureConfig;
  };

  const baseConfig = templateConfig ?? getDefaultConfig();
  const results: { name: string; status: "success" | "error"; id?: string; error?: string }[] = [];

  for (const row of rows) {
    if (!row.name) {
      results.push({ name: "Unknown", status: "error", error: "Missing name" });
      continue;
    }

    try {
      const config = rowToConfig(row, baseConfig);
      const html = renderSignatureHtml(config);
      const publicSlug = `${slugify(row.name)}-${nanoid(6)}`;

      const { data, error } = await supabase
        .from("signatures")
        .insert({
          owner_user_id: user.id,
          template_id: config.templateId,
          name: `${row.name} - ${row.company ?? "Signature"}`,
          config: config as unknown as import("@/types/database").Json,
          html_output: html,
          public_slug: publicSlug,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
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
    org_id: user.id,
    status: "completed",
    csv_data: rows as unknown as import("@/types/database").Json,
    results: { results } as unknown as import("@/types/database").Json,
  }).then(() => {}, () => {});

  return NextResponse.json({ results });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: signatures } = await supabase
    .from("signatures")
    .select("name, html_output")
    .eq("owner_user_id", user.id);

  const zip = new JSZip();
  for (const sig of signatures ?? []) {
    const filename = `${sig.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html`;
    zip.file(filename, sig.html_output);
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(content), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=signatures.zip",
    },
  });
}

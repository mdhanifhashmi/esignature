import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: signatures } = await supabase
    .from("signatures")
    .select("id, name, html_output")
    .eq("owner_user_id", user.id);

  const zip = new JSZip();
  for (const sig of signatures ?? []) {
    const base = sig.name.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "signature";
    zip.file(`${base}-${sig.id.slice(0, 8)}.html`, sig.html_output);
  }

  const content = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(content), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=signatures.zip",
    },
  });
}

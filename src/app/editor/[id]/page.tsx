import { SignatureEditor } from "@/components/editor/signature-editor";
import { getDefaultConfig } from "@/lib/signature/renderHtml";
import type { SignatureConfig } from "@/types/signature";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditorByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let config: SignatureConfig = getDefaultConfig();
  let name = "My Signature";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("signatures")
        .select("name, config")
        .eq("id", id)
        .single();

      if (data) {
        config = data.config as unknown as SignatureConfig;
        name = data.name;
      } else {
        notFound();
      }
    } catch {
      // Allow offline editing without Supabase
    }
  }

  return <SignatureEditor initialConfig={config} signatureId={id} signatureName={name} />;
}

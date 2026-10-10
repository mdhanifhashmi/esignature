import { SignatureEditor } from "@/components/editor/signature-editor";
import { normalizeConfig } from "@/lib/signature/persist";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function EditorByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/editor/${id}`);

  const { data } = await supabase
    .from("signatures")
    .select("name, config, html_output")
    .eq("id", id)
    .maybeSingle();

  const config = data ? normalizeConfig(data.config) : null;
  if (!data || !config) notFound();

  return (
    <SignatureEditor
      initialConfig={config}
      signatureId={id}
      signatureName={data.name}
      initialHtml={data.html_output}
    />
  );
}

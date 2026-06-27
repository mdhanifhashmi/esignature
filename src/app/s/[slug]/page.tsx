import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { APP_NAME } from "@/lib/constants";

export default async function PublicSignaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("signatures")
    .select("name, html_output")
    .eq("public_slug", slug)
    .single();

  if (!data) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-sm text-slate-500">
          Signature preview — {data.name} · {APP_NAME}
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div dangerouslySetInnerHTML={{ __html: data.html_output }} />
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const supabase = await createServiceClient();

    const { data: link } = await supabase
      .from("tracked_links")
      .select("id, destination_url")
      .eq("short_id", id)
      .single();

    if (link) {
      await supabase.from("click_events").insert({
        link_id: link.id,
        user_agent: request.headers.get("user-agent"),
      });

      return NextResponse.redirect(link.destination_url, 302);
    }
  } catch {
    // Fall through to 404
  }

  return NextResponse.redirect(new URL("/", request.url));
}

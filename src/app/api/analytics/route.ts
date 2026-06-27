import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: signatures } = await supabase
    .from("signatures")
    .select("id")
    .eq("owner_user_id", user.id);

  const signatureIds = (signatures as { id: string }[] | null)?.map((s) => s.id) ?? [];

  if (signatureIds.length === 0) {
    return NextResponse.json({
      totalClicks: 0,
      clicksByLink: [],
      clicksByDay: [],
    });
  }

  const { data: links } = await supabase
    .from("tracked_links")
    .select("id, label")
    .in("signature_id", signatureIds);

  const linkIds = (links as { id: string; label: string }[] | null)?.map((l) => l.id) ?? [];

  if (linkIds.length === 0) {
    return NextResponse.json({
      totalClicks: 0,
      clicksByLink: [],
      clicksByDay: [],
    });
  }

  const { data: clicks } = await supabase
    .from("click_events")
    .select("link_id, created_at")
    .in("link_id", linkIds)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const linkMap = new Map((links as { id: string; label: string }[] | null)?.map((l) => [l.id, l.label]) ?? []);
  const clicksByLinkMap = new Map<string, number>();
  const clicksByDayMap = new Map<string, number>();

  for (const click of (clicks as { link_id: string; created_at: string }[] | null) ?? []) {
    const label = linkMap.get(click.link_id) ?? "Unknown";
    clicksByLinkMap.set(label, (clicksByLinkMap.get(label) ?? 0) + 1);

    const day = click.created_at.split("T")[0];
    clicksByDayMap.set(day, (clicksByDayMap.get(day) ?? 0) + 1);
  }

  return NextResponse.json({
    totalClicks: clicks?.length ?? 0,
    clicksByLink: Array.from(clicksByLinkMap.entries()).map(([label, count]) => ({
      label,
      clicks: count,
    })),
    clicksByDay: Array.from(clicksByDayMap.entries())
      .map(([date, count]) => ({ date, clicks: count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await request.json();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role, organizations(name)")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single();

  const member = membership as { org_id: string; role: string; organizations: { name: string } } | null;

  if (!member) {
    return NextResponse.json({ error: "No organization found" }, { status: 404 });
  }

  const { error } = await supabase.from("org_invites").insert({
    org_id: member.org_id,
    email,
    role: "member",
    invited_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const orgName = member.organizations?.name ?? APP_NAME;
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? `${APP_NAME} <onboarding@resend.dev>`,
      to: email,
      subject: `You're invited to join ${orgName} on ${APP_NAME}`,
      html: `<p>You've been invited to join <strong>${orgName}</strong> on ${APP_NAME}.</p>
             <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/signup">Sign up to get started</a></p>`,
    });
  }

  return NextResponse.json({ success: true });
}

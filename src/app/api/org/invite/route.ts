import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { APP_NAME, APP_URL } from "@/lib/constants";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const { data: member } = await supabase
    .from("org_members")
    .select("org_id, role, organizations(name)")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .maybeSingle();

  if (!member) {
    return NextResponse.json({ error: "Only team owners and admins can invite" }, { status: 403 });
  }

  const { error } = await supabase.from("org_invites").upsert(
    { org_id: member.org_id, email, role: "member", invited_by: user.id },
    { onConflict: "org_id,email", ignoreDuplicates: true }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const orgName = escapeHtml(member.organizations?.name ?? APP_NAME);
    const { error: sendError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? `${APP_NAME} <onboarding@resend.dev>`,
      to: email,
      subject: `You're invited to join ${member.organizations?.name ?? APP_NAME} on ${APP_NAME}`,
      html: `<p>You've been invited to join <strong>${orgName}</strong> on ${APP_NAME}.</p>
             <p><a href="${APP_URL}/signup">Sign up with this email address</a> and you'll be added to the team automatically.</p>`,
    });
    if (sendError) {
      return NextResponse.json(
        { error: `Invite saved, but the email failed to send: ${sendError.message}` },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { buildAnimatedGif, optimizeGif, type AnimationPreset } from "@/lib/animation/gifBuilder";
import { createClient } from "@/lib/supabase/server";
import { ANIMATION_PRESETS, STORAGE_BUCKET } from "@/lib/constants";
import { nanoid } from "nanoid";

const LOGO_PRESETS = new Set<string>(ANIMATION_PRESETS.logo.map((p) => p.id));
const PROFILE_PRESETS = new Set<string>(ANIMATION_PRESETS.profile.map((p) => p.id));

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate animations" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Only animate images the user uploaded to their own storage folder, so this
  // endpoint can't be used to make the server fetch arbitrary URLs.
  const ownPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${user.id}/`;
  const isOwnImage = (url: unknown): url is string =>
    typeof url === "string" && url.startsWith(ownPrefix) && !url.includes("..");

  const { logoUrl, profileUrl } = body;
  if ((logoUrl && !isOwnImage(logoUrl)) || (profileUrl && !isOwnImage(profileUrl))) {
    return NextResponse.json(
      { error: "Re-upload your images while signed in, then generate animations" },
      { status: 400 }
    );
  }

  const logoAnimation = (LOGO_PRESETS.has(body.logoAnimation) ? body.logoAnimation : "pulse") as AnimationPreset;
  const profileAnimation = (PROFILE_PRESETS.has(body.profileAnimation) ? body.profileAnimation : "ringPulse") as AnimationPreset;

  async function store(gif: Buffer, kind: string): Promise<string> {
    const path = `${user!.id}/gifs/${nanoid()}-${kind}.gif`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, gif, { contentType: "image/gif", upsert: false });
    if (error) throw new Error(error.message);
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  try {
    const result: { logoGifUrl?: string; profileGifUrl?: string } = {};

    if (logoUrl) {
      const gif = await buildAnimatedGif(logoUrl, logoAnimation, { width: 240, height: 80 });
      result.logoGifUrl = await store(await optimizeGif(gif), "logo");
    }

    if (profileUrl) {
      const gif = await buildAnimatedGif(profileUrl, profileAnimation, {
        width: 160,
        height: 160,
        isProfile: true,
      });
      result.profileGifUrl = await store(await optimizeGif(gif), "profile");
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Animation generation failed" },
      { status: 500 }
    );
  }
}

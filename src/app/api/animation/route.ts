import { NextResponse } from "next/server";
import { buildAnimatedGif, optimizeGif } from "@/lib/animation/gifBuilder";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { logoUrl, profileUrl, logoAnimation, profileAnimation } = await request.json();
    const result: { logoGifUrl?: string; profileGifUrl?: string } = {};

    const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

    if (logoUrl) {
      const gifBuffer = await buildAnimatedGif(logoUrl, logoAnimation ?? "pulse", {
        width: 240,
        height: 80,
      });
      const optimized = await optimizeGif(gifBuffer);

      if (supabaseConfigured) {
        const supabase = await createClient();
        const path = `gifs/${nanoid()}-logo.gif`;
        const { error } = await supabase.storage
          .from("signatures-public")
          .upload(path, optimized, { contentType: "image/gif", upsert: true });

        if (!error) {
          const { data } = supabase.storage.from("signatures-public").getPublicUrl(path);
          result.logoGifUrl = data.publicUrl;
        }
      }

      if (!result.logoGifUrl) {
        result.logoGifUrl = `data:image/gif;base64,${optimized.toString("base64")}`;
      }
    }

    if (profileUrl) {
      const gifBuffer = await buildAnimatedGif(profileUrl, profileAnimation ?? "ringPulse", {
        width: 160,
        height: 160,
        isProfile: true,
      });
      const optimized = await optimizeGif(gifBuffer);

      if (supabaseConfigured) {
        const supabase = await createClient();
        const path = `gifs/${nanoid()}-profile.gif`;
        const { error } = await supabase.storage
          .from("signatures-public")
          .upload(path, optimized, { contentType: "image/gif", upsert: true });

        if (!error) {
          const { data } = supabase.storage.from("signatures-public").getPublicUrl(path);
          result.profileGifUrl = data.publicUrl;
        }
      }

      if (!result.profileGifUrl) {
        result.profileGifUrl = `data:image/gif;base64,${optimized.toString("base64")}`;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Animation generation failed" },
      { status: 500 }
    );
  }
}

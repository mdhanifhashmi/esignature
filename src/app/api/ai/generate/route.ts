import { NextResponse } from "next/server";
import { generateSignatureSuggestion } from "@/lib/ai/generateSignature";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const suggestion = await generateSignatureSuggestion(body);
    return NextResponse.json(suggestion);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI generation failed" },
      { status: 500 }
    );
  }
}

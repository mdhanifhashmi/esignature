import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiSuggestion } from "@/types/signature";

const FALLBACK_SUGGESTION: AiSuggestion = {
  tagline: "Building the future, one email at a time.",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  textColor: "#1e293b",
  templateId: "nav-left",
  logoAnimation: "pulse",
  profileAnimation: "ringPulse",
  socialLinkOrder: ["website", "linkedin", "twitter"],
};

const clip = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

export async function generateSignatureSuggestion(input: {
  fullName: string;
  jobTitle: string;
  company: string;
  industry?: string;
  tone?: string;
}): Promise<AiSuggestion> {
  const fullName = clip(input.fullName, 80);
  const jobTitle = clip(input.jobTitle, 80);
  const company = clip(input.company, 80);
  const industry = clip(input.industry, 60) || "general";
  const tone = clip(input.tone, 30) || "professional";

  const fallback = {
    ...FALLBACK_SUGGESTION,
    tagline: `${jobTitle} at ${company}`.slice(0, 60),
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are an email signature design expert. Given this professional info, return ONLY valid JSON (no markdown) with signature design suggestions.

Input:
- Name: ${fullName}
- Title: ${jobTitle}
- Company: ${company}
- Industry: ${industry}
- Tone: ${tone}

Return JSON with these exact keys:
{
  "tagline": "short professional tagline under 60 chars",
  "primaryColor": "#hex brand color",
  "secondaryColor": "#hex muted color",
  "textColor": "#hex text color",
  "templateId": one of "nav-left" | "nav-bottom" | "card" | "minimal",
  "logoAnimation": one of "pulse" | "fadeLoop" | "slideReveal" | "subtleRotate",
  "profileAnimation": one of "ringPulse" | "zoomLoop" | "fadeLoop",
  "socialLinkOrder": ["website", "linkedin", etc]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(text) as Partial<AiSuggestion>;
    return { ...fallback, ...parsed, tagline: clip(parsed.tagline, 60) || fallback.tagline };
  } catch (error) {
    console.error("Gemini suggestion failed, using fallback:", error);
    return fallback;
  }
}

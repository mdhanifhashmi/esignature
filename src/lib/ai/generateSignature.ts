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

export async function generateSignatureSuggestion(input: {
  fullName: string;
  jobTitle: string;
  company: string;
  industry?: string;
  tone?: string;
}): Promise<AiSuggestion> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      ...FALLBACK_SUGGESTION,
      tagline: `${input.jobTitle} at ${input.company}`.slice(0, 60),
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an email signature design expert. Given this professional info, return ONLY valid JSON (no markdown) with signature design suggestions.

Input:
- Name: ${input.fullName}
- Title: ${input.jobTitle}
- Company: ${input.company}
- Industry: ${input.industry ?? "general"}
- Tone: ${input.tone ?? "professional"}

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
    return JSON.parse(text) as AiSuggestion;
  } catch {
    return {
      ...FALLBACK_SUGGESTION,
      tagline: `${input.jobTitle} at ${input.company}`.slice(0, 60),
    };
  }
}

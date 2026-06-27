import type { TemplateId } from "@/types/signature";

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  category: "classic" | "modern" | "bold" | "minimal";
  featured?: boolean;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: "purple", name: "Royal Purple", primary: "#9333ea", secondary: "#a78bfa", text: "#1e1b4b" },
  { id: "ocean", name: "Ocean Blue", primary: "#0284c7", secondary: "#38bdf8", text: "#0c4a6e" },
  { id: "emerald", name: "Emerald", primary: "#059669", secondary: "#34d399", text: "#064e3b" },
  { id: "sunset", name: "Sunset", primary: "#ea580c", secondary: "#fb923c", text: "#431407" },
  { id: "rose", name: "Rose", primary: "#e11d48", secondary: "#fb7185", text: "#4c0519" },
  { id: "midnight", name: "Midnight", primary: "#4338ca", secondary: "#818cf8", text: "#1e1b4b" },
  { id: "coral", name: "Coral", primary: "#db2777", secondary: "#f472b6", text: "#500724" },
  { id: "forest", name: "Forest", primary: "#047857", secondary: "#6ee7b7", text: "#022c22" },
];

export const SIGNATURE_TEMPLATES: TemplateDefinition[] = [
  { id: "nav-left", label: "Nav Left", description: "Profile left, content center, logo right", category: "classic", featured: true },
  { id: "nav-bottom", label: "Nav Bottom", description: "Content row with nav bar underneath", category: "classic", featured: true },
  { id: "card", label: "Card", description: "Bordered card with logo and nav footer", category: "modern", featured: true },
  { id: "minimal", label: "Minimal", description: "Clean text-focused, no images required", category: "minimal" },
  { id: "banner", label: "Banner", description: "Bold top accent stripe with content below", category: "bold", featured: true },
  { id: "split", label: "Split", description: "Two-column split with accent divider", category: "modern" },
  { id: "corporate", label: "Corporate", description: "Logo header, centered professional layout", category: "classic" },
  { id: "creative", label: "Creative", description: "Left accent bar with dynamic spacing", category: "bold", featured: true },
  { id: "stack", label: "Stack", description: "Vertically stacked centered elements", category: "minimal" },
  { id: "compact", label: "Compact", description: "Dense horizontal layout for small footers", category: "minimal" },
  { id: "sidebar", label: "Sidebar", description: "Wide left sidebar with contact block", category: "modern" },
  { id: "gradient", label: "Gradient Bar", description: "Gradient header band with clean body", category: "bold" },
];

export function getTemplateById(id: TemplateId): TemplateDefinition | undefined {
  return SIGNATURE_TEMPLATES.find((t) => t.id === id);
}

export function getPaletteById(id: string): ColorPalette | undefined {
  return COLOR_PALETTES.find((p) => p.id === id);
}

export function applyPalette(palette: ColorPalette) {
  return {
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    textColor: palette.text,
  };
}

/** Demo configs for hero carousel */
export const HERO_TEMPLATE_DEMOS = [
  { templateId: "nav-left" as TemplateId, paletteId: "purple", name: "Sarah M.", role: "Marketing Lead" },
  { templateId: "banner" as TemplateId, paletteId: "ocean", name: "James K.", role: "Sales Director" },
  { templateId: "creative" as TemplateId, paletteId: "sunset", name: "Elena R.", role: "CEO & Founder" },
  { templateId: "card" as TemplateId, paletteId: "emerald", name: "Marcus T.", role: "Product Designer" },
  { templateId: "corporate" as TemplateId, paletteId: "midnight", name: "Aisha P.", role: "VP Engineering" },
  { templateId: "gradient" as TemplateId, paletteId: "rose", name: "David L.", role: "Consultant" },
];

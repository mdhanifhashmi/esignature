import { SignatureEditor } from "@/components/editor/signature-editor";
import { getDefaultConfig } from "@/lib/signature/renderHtml";
import { getPaletteById } from "@/lib/signature/templates";
import type { SignatureConfig, TemplateId } from "@/types/signature";

const VALID_TEMPLATES: TemplateId[] = [
  "nav-left", "nav-bottom", "card", "minimal", "banner", "split",
  "corporate", "creative", "stack", "compact", "sidebar", "gradient",
];

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; palette?: string }>;
}) {
  const params = await searchParams;
  const config: SignatureConfig = getDefaultConfig();

  if (params.template && VALID_TEMPLATES.includes(params.template as TemplateId)) {
    config.templateId = params.template as TemplateId;
  }

  if (params.palette) {
    const palette = getPaletteById(params.palette);
    if (palette) {
      config.primaryColor = palette.primary;
      config.secondaryColor = palette.secondary;
      config.textColor = palette.text;
    }
  }

  return <SignatureEditor initialConfig={config} />;
}

"use client";

import { SIGNATURE_TEMPLATES } from "@/lib/signature/templates";
import { SignatureTemplateVisual } from "@/components/signature/signature-template-visual";
import type { TemplateId } from "@/types/signature";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplatePickerProps {
  selectedId: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  onSelect: (id: TemplateId) => void;
}

export function TemplatePicker({
  selectedId,
  primaryColor,
  secondaryColor,
  textColor,
  onSelect,
}: TemplatePickerProps) {
  const categories = ["classic", "modern", "bold", "minimal"] as const;

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const templates = SIGNATURE_TEMPLATES.filter((t) => t.category === cat);
        if (templates.length === 0) return null;
        return (
          <div key={cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">{cat}</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {templates.map((template) => {
                const isSelected = selectedId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onSelect(template.id)}
                    className={cn(
                      "group relative rounded-xl border p-2 text-left transition-all",
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/15 ring-2 ring-purple-500/20"
                        : "border-purple-100 hover:border-purple-300 hover:shadow-md"
                    )}
                  >
                    {isSelected && (
                      <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    {template.featured && !isSelected && (
                      <span className="absolute right-2 top-2 z-10 rounded bg-fuchsia-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        Popular
                      </span>
                    )}
                    <SignatureTemplateVisual
                      templateId={template.id}
                      primary={primaryColor}
                      secondary={secondaryColor}
                      text={textColor}
                      compact
                      className="pointer-events-none"
                    />
                    <p className="mt-2 text-xs font-semibold text-purple-950">{template.label}</p>
                    <p className="text-[10px] text-purple-500 line-clamp-1">{template.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

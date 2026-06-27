"use client";

import { COLOR_PALETTES, applyPalette } from "@/lib/signature/templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPalettePickerProps {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  onChange: (colors: { primaryColor: string; secondaryColor: string; textColor: string }) => void;
}

export function ColorPalettePicker({
  primaryColor,
  secondaryColor,
  textColor,
  onChange,
}: ColorPalettePickerProps) {
  const activePalette = COLOR_PALETTES.find(
    (p) => p.primary === primaryColor && p.secondary === secondaryColor
  );

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-sm font-medium text-purple-950">Color Themes</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {COLOR_PALETTES.map((palette) => {
            const isActive = activePalette?.id === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => onChange(applyPalette(palette))}
                className={cn(
                  "group relative flex flex-col items-center gap-1 rounded-xl border p-2 transition-all",
                  isActive
                    ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10"
                    : "border-purple-100 hover:border-purple-300 hover:bg-purple-50/50"
                )}
              >
                <div
                  className="h-8 w-8 rounded-full shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}
                />
                <span className="text-[10px] font-medium text-purple-700">{palette.name.split(" ")[0]}</span>
                {isActive && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-purple-950">Custom Colors</p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { key: "primaryColor" as const, label: "Primary", value: primaryColor },
              { key: "secondaryColor" as const, label: "Secondary", value: secondaryColor },
              { key: "textColor" as const, label: "Text", value: textColor },
            ] as const
          ).map((c) => (
            <div key={c.key}>
              <label className="mb-1 block text-xs text-purple-600">{c.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={c.value}
                  onChange={(e) =>
                    onChange({
                      primaryColor: c.key === "primaryColor" ? e.target.value : primaryColor,
                      secondaryColor: c.key === "secondaryColor" ? e.target.value : secondaryColor,
                      textColor: c.key === "textColor" ? e.target.value : textColor,
                    })
                  }
                  className="h-9 w-full cursor-pointer rounded-lg border border-purple-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

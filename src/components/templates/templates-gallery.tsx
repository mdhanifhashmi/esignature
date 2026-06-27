"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SIGNATURE_TEMPLATES, COLOR_PALETTES } from "@/lib/signature/templates";
import { SignatureTemplateVisual } from "@/components/signature/signature-template-visual";
import { FadeIn, FadeInItem } from "@/components/landing/fade-in";
import type { TemplateId } from "@/types/signature";

export function TemplatesGallery() {
  return (
    <div className="mx-auto max-w-6xl">
      <FadeIn className="text-center">
        <span className="inline-block rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm">
          {SIGNATURE_TEMPLATES.length} Pro Templates
        </span>
        <h1 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl">
          Pick a Template,{" "}
          <span className="text-gradient-purple">Make It Yours</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-purple-700/80">
          Every template supports custom colors, animated logos, and interactive nav bars.
        </p>
      </FadeIn>

      <FadeIn className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-medium text-purple-600">Color themes:</span>
        {COLOR_PALETTES.map((p) => (
          <div key={p.id} className="flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-xs font-medium text-purple-700">
            <span className="h-4 w-4 rounded-full" style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }} />
            {p.name}
          </div>
        ))}
      </FadeIn>

      <FadeIn className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger>
        {SIGNATURE_TEMPLATES.map((template) => {
          const palette = COLOR_PALETTES[0];
          return (
            <FadeInItem key={template.id}>
              <Card className="card-glow overflow-hidden border-purple-100 bg-white/90 transition-all hover:border-purple-300">
                <CardContent className="p-4">
                  <SignatureTemplateVisual
                    templateId={template.id as TemplateId}
                    primary={palette.primary}
                    secondary={palette.secondary}
                    text={palette.text}
                  />
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-purple-950">{template.label}</h3>
                      {template.featured && (
                        <span className="rounded bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold text-fuchsia-700">Popular</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-purple-500">{template.description}</p>
                  </div>
                  <Link href={`/editor?template=${template.id}`} className="mt-4 block">
                    <Button variant="outline" className="w-full border-purple-200">Use Template</Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeInItem>
          );
        })}
      </FadeIn>
    </div>
  );
}

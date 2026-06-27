"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, LayoutTemplate, Sparkles } from "lucide-react";
import { SignatureTemplateVisual } from "@/components/signature/signature-template-visual";
import {
  HERO_TEMPLATE_DEMOS,
  COLOR_PALETTES,
  SIGNATURE_TEMPLATES,
  getPaletteById,
} from "@/lib/signature/templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroTemplateShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(0);

  const demo = HERO_TEMPLATE_DEMOS[activeIndex];
  const palette = getPaletteById(demo.paletteId) ?? COLOR_PALETTES[selectedPalette];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_TEMPLATE_DEMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const templateMeta = SIGNATURE_TEMPLATES.find((t) => t.id === demo.templateId);

  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      {/* Floating decorative objects */}
      <motion.div
        className="absolute -left-8 top-8 z-20 rounded-2xl border border-purple-200 bg-white px-3 py-2 shadow-lg shadow-purple-500/10"
        animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
          <LayoutTemplate className="h-4 w-4 text-purple-500" />
          {SIGNATURE_TEMPLATES.length} Templates
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-4 top-24 z-20 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
        animate={{ y: [0, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles className="mr-1 inline h-3 w-3" />
        Animated
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 z-20 flex items-center gap-1.5 rounded-xl border border-purple-100 bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Palette className="h-4 w-4 text-purple-500" />
        <span className="text-xs font-medium text-purple-700">{COLOR_PALETTES.length} Color Themes</span>
      </motion.div>

      {/* Orbit rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[110%] w-[110%] rounded-full border border-dashed border-purple-300/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main showcase card */}
      <div className="relative pt-8">
        <div className="animate-pulse-glow absolute -inset-3 rounded-3xl bg-gradient-to-br from-purple-500/25 via-fuchsia-400/15 to-violet-500/25 blur-xl" />

        <div className="relative overflow-hidden rounded-2xl border border-purple-200/60 bg-white/90 p-5 shadow-2xl shadow-purple-500/15 backdrop-blur-sm">
          {/* Template + palette header */}
          <div className="mb-4 flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={demo.templateId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="flex items-center gap-2"
              >
                <span
                  className="rounded-lg px-2 py-1 text-xs font-bold text-white"
                  style={{ background: palette.primary }}
                >
                  {templateMeta?.label}
                </span>
                <span className="text-xs text-purple-500">{palette.name}</span>
              </motion.div>
            </AnimatePresence>
            <span className="text-[10px] text-purple-400">
              {activeIndex + 1} / {HERO_TEMPLATE_DEMOS.length}
            </span>
          </div>

          {/* Template preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${demo.templateId}-${demo.paletteId}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <SignatureTemplateVisual
                templateId={demo.templateId}
                primary={palette.primary}
                secondary={palette.secondary}
                text={palette.text}
                name={demo.name}
                role={demo.role}
                company="SigMotion"
              />
            </motion.div>
          </AnimatePresence>

          {/* Color palette swatches */}
          <div className="mt-4 border-t border-purple-100 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-purple-400">
              Custom colors
            </p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTES.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => {
                    setSelectedPalette(i);
                    setActiveIndex(i % HERO_TEMPLATE_DEMOS.length);
                  }}
                  className={cn(
                    "group relative h-7 w-7 rounded-full ring-2 ring-offset-2 transition-all",
                    palette.id === p.id ? "ring-purple-500" : "ring-transparent"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          {/* Template thumbnails strip */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {HERO_TEMPLATE_DEMOS.map((d, i) => {
              const p = getPaletteById(d.paletteId)!;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 rounded-lg border p-1 transition-all ${
                    i === activeIndex ? "border-purple-500 shadow-md shadow-purple-500/20" : "border-purple-100 opacity-70"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <SignatureTemplateVisual
                    templateId={d.templateId}
                    primary={p.primary}
                    secondary={p.secondary}
                    text={p.text}
                    name="Demo"
                    role="Role"
                    compact
                    className="w-24"
                  />
                </motion.button>
              );
            })}
          </div>

          <Link href={`/editor?template=${demo.templateId}&palette=${palette.id}`} className="mt-4 block">
            <Button className="w-full shadow-md shadow-purple-500/20">
              Use This Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Background stack cards */}
      {[1, 2].map((offset) => (
        <motion.div
          key={offset}
          className="absolute inset-x-4 rounded-2xl border border-purple-100 bg-white/40"
          style={{
            top: `${offset * 12}px`,
            zIndex: -offset,
            height: "100%",
          }}
          animate={{
            y: [offset * 4, offset * 8, offset * 4],
            rotate: [offset * -1.5, offset * 1.5, offset * -1.5],
          }}
          transition={{ duration: 5 + offset, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

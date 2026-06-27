"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { renderSignatureHtml, getDefaultConfig } from "@/lib/signature/renderHtml";
import { FadeIn, FadeInItem } from "@/components/landing/fade-in";
import { motion } from "framer-motion";

const examples = [
  { name: "Sarah Chen", title: "Product Designer", company: "DesignCo", color: "#9333ea" },
  { name: "Marcus Johnson", title: "Sales Director", company: "GrowthLabs", color: "#7c3aed" },
  { name: "Elena Rodriguez", title: "CEO & Founder", company: "StartupXYZ", color: "#a855f7" },
];

export function Examples() {
  return (
    <section className="bg-mesh-purple relative px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm">
            Live Examples
          </span>
          <h2 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl">
            Top User <span className="text-gradient-purple">Examples</span>
          </h2>
          <p className="mt-4 text-purple-700/70">
            See how professionals use SigMotion to enhance their branding.
          </p>
        </FadeIn>

        <FadeIn className="mt-14 grid gap-6 md:grid-cols-3" stagger>
          {examples.map((ex) => {
            const config = {
              ...getDefaultConfig(),
              fullName: ex.name,
              jobTitle: ex.title,
              company: ex.company,
              email: `${ex.name.split(" ")[0].toLowerCase()}@${ex.company.toLowerCase()}.com`,
              primaryColor: ex.color,
              secondaryColor: "#a78bfa",
              website: `https://${ex.company.toLowerCase()}.com`,
              tagline: "Making every email count",
            };
            const html = renderSignatureHtml(config);

            return (
              <FadeInItem key={ex.name}>
                <motion.div
                  className="card-glow overflow-hidden rounded-2xl border border-purple-200/60 bg-white p-6 shadow-lg shadow-purple-500/5"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                    <span className="text-xs font-medium text-purple-400">Animated preview</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </motion.div>
              </FadeInItem>
            );
          })}
        </FadeIn>

        <FadeIn className="mt-10 text-center">
          <Link href="/editor">
            <Button size="lg" className="shadow-lg shadow-purple-500/25">
              Try For Free
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

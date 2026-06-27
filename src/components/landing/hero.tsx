"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Zap, LayoutTemplate } from "lucide-react";
import { MotionBackground } from "@/components/landing/motion-background";
import { HeroTemplateShowcase } from "@/components/landing/hero-template-showcase";
import { MotionDiv } from "@/components/landing/fade-in";
import { SIGNATURE_TEMPLATES } from "@/lib/signature/templates";

export function Hero() {
  return (
    <section className="bg-mesh-purple relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
      <MotionBackground />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div className="text-center lg:text-left">
            <MotionDiv delay={0}>
              <Badge className="mb-4 border-purple-200 bg-white/80 text-purple-700 shadow-sm backdrop-blur-sm">
                <Zap className="mr-1 h-3 w-3 text-purple-500" />
                100% Free — No subscription required
              </Badge>
            </MotionDiv>

            <MotionDiv delay={0.1}>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl">
                <span className="text-purple-950">Stand Out In</span>
                <br />
                <span className="text-gradient-purple">Every Inbox</span>
              </h1>
            </MotionDiv>

            <MotionDiv delay={0.2}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-purple-700/80 lg:mx-0">
                Pick from {SIGNATURE_TEMPLATES.length} pro templates, customize colors, add animated logos
                and interactive nav bars — powered by AI.
              </p>
            </MotionDiv>

            <MotionDiv delay={0.25}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Badge className="border border-purple-200 bg-white/60 text-purple-700">
                  <LayoutTemplate className="mr-1 h-3 w-3" /> 12 Templates
                </Badge>
                <Badge className="border border-purple-200 bg-white/60 text-purple-700">
                  8 Color Themes
                </Badge>
                <Badge className="border border-purple-200 bg-white/60 text-purple-700">
                  Custom Colors
                </Badge>
              </div>
            </MotionDiv>

            <MotionDiv delay={0.3}>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/editor">
                  <Button size="lg" className="shadow-lg shadow-purple-500/25">
                    Get Started, FREE
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="border-purple-200 bg-white/60 text-purple-800 backdrop-blur-sm hover:bg-white">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </MotionDiv>

            <MotionDiv delay={0.35}>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-purple-600 lg:justify-start">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-purple-400 text-purple-400" />
                  ))}
                </div>
                <span>Trusted by professionals worldwide</span>
              </div>
            </MotionDiv>
          </div>

          {/* Right — animated template showcase */}
          <MotionDiv delay={0.4} className="relative">
            <HeroTemplateShowcase />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Zap } from "lucide-react";
import { MotionBackground } from "@/components/landing/motion-background";
import { HeroSignaturePreview } from "@/components/landing/hero-signature-preview";
import { MotionDiv } from "@/components/landing/fade-in";

export function Hero() {
  return (
    <section className="bg-mesh-purple relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <MotionBackground />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <MotionDiv delay={0}>
            <Badge className="mb-6 border-purple-200 bg-white/80 text-purple-700 shadow-sm backdrop-blur-sm">
              <Zap className="mr-1 h-3 w-3 text-purple-500" />
              100% Free — No subscription required
            </Badge>
          </MotionDiv>

          <MotionDiv delay={0.1}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-purple-950">Stand Out In</span>
              <br />
              <span className="text-gradient-purple">Every Inbox</span>
            </h1>
          </MotionDiv>

          <MotionDiv delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-700/80">
              The only AI-generated email signature with an interactive nav bar, logo animation,
              and profile animation. Boost replies, drive traffic — all free.
            </p>
          </MotionDiv>

          <MotionDiv delay={0.3}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/editor">
                <Button size="lg" className="shadow-lg shadow-purple-500/25">
                  Get Started, FREE
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="border-purple-200 bg-white/60 text-purple-800 backdrop-blur-sm hover:bg-white hover:text-purple-900">
                  See How It Works
                </Button>
              </Link>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.35}>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-purple-600">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-purple-400 text-purple-400" />
                ))}
              </div>
              <span>Trusted by professionals worldwide</span>
            </div>
          </MotionDiv>
        </div>

        <HeroSignaturePreview />
      </div>
    </section>
  );
}

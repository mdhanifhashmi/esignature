"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6">
      <div className="animate-gradient absolute inset-0 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-violet-700" />
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
      </div>

      <FadeIn className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          className="text-3xl font-bold text-white sm:text-4xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Enhance Your Branding Effortlessly
        </motion.h2>
        <p className="mt-4 text-lg text-purple-100">
          Create stylish, AI-crafted email signatures with animated logos and interactive nav bars.
        </p>
        <Link href="/editor">
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 bg-white text-purple-700 shadow-xl hover:bg-purple-50 hover:text-purple-900"
          >
            Try Now — It&apos;s Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </FadeIn>
    </section>
  );
}

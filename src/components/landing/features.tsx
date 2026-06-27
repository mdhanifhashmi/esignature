"use client";

import { Sparkles, BarChart3, Users, Shield, Zap, Smartphone } from "lucide-react";
import { FadeIn, FadeInItem } from "@/components/landing/fade-in";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI Logo Animation",
    description: "Make your logo stand out with smooth, AI-powered animation presets.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Zap,
    title: "Interactive Design",
    description: "Engaging nav bar elements that enhance email visibility and interaction.",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description: "Track link clicks across your team with privacy-first redirect tracking.",
    gradient: "from-violet-500 to-purple-700",
  },
  {
    icon: Users,
    title: "Bulk Create Signatures",
    description: "Generate multiple signatures for your entire team from a CSV import.",
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Deliverability Optimized",
    description: "Clean HTML, no tracking pixels, hosted on trusted CDN domains.",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Perfectly optimized signatures for all screen sizes and devices.",
    gradient: "from-violet-600 to-purple-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-white px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl">
            Everything You Need to{" "}
            <span className="text-gradient-purple">Supercharge</span> Your Emails
          </h2>
          <p className="mt-4 text-purple-600/80">
            Stunning animated email signatures — completely free.
          </p>
        </FadeIn>

        <FadeIn className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger>
          {features.map((feature) => (
            <FadeInItem key={feature.title}>
              <motion.div
                className="card-glow group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 transition-all duration-300"
                whileHover={{ y: -6 }}
              >
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg shadow-purple-500/20`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-purple-950">{feature.title}</h3>
                <p className="mt-2 text-sm text-purple-600/80">{feature.description}</p>
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-purple-100/50 transition-transform duration-300 group-hover:scale-150" />
              </motion.div>
            </FadeInItem>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, MousePointerClick, Mail } from "lucide-react";

const tips = [
  "Add your logo & profile photo, then generate animated GIFs in the Animation step.",
  "Use AI Suggest on step 1 to auto-fill colors, tagline, and template.",
  "Enable click tracking by saving your signature — links get wrapped automatically.",
];

export function DashboardWelcome() {
  const tip = tips[new Date().getDate() % tips.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lg shadow-purple-500/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-200" />
            <h2 className="text-lg font-bold">Welcome to SigMotion</h2>
          </div>
          <p className="mt-1 text-sm text-purple-100">{tip}</p>
        </div>
        <div className="flex gap-4">
          {[
            { icon: Mail, label: "Signatures", value: "Free" },
            { icon: MousePointerClick, label: "Analytics", value: "Live" },
            { icon: TrendingUp, label: "Hosting", value: "CDN" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white/15 px-4 py-2 text-center backdrop-blur-sm">
              <stat.icon className="mx-auto h-4 w-4 text-purple-200" />
              <p className="mt-1 text-xs text-purple-200">{stat.label}</p>
              <p className="text-sm font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

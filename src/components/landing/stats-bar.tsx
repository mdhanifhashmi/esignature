"use client";

import { motion } from "framer-motion";
import { TrendingUp, MousePointerClick, Users, Zap } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "3×", label: "More link clicks", sub: "vs static signatures" },
  { icon: MousePointerClick, value: "42%", label: "Higher reply rate", sub: "with animated branding" },
  { icon: Users, value: "1000+", label: "Email clients", sub: "Gmail, Outlook & more" },
  { icon: Zap, value: "$0", label: "Forever free", sub: "No subscription needed" },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-purple-100 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-3 inline-flex rounded-xl bg-purple-100 p-3">
                <stat.icon className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-3xl font-extrabold text-gradient-purple">{stat.value}</p>
              <p className="mt-1 font-semibold text-purple-950">{stat.label}</p>
              <p className="text-xs text-purple-500">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

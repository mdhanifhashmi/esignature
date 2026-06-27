"use client";

import { motion } from "framer-motion";
import { Shield, Mail, Smartphone, Lock } from "lucide-react";

const clients = ["Gmail", "Outlook", "Apple Mail", "Yahoo", "Thunderbird", "Mobile"];

const trustItems = [
  { icon: Shield, text: "No tracking pixels" },
  { icon: Lock, text: "Clean HTML only" },
  { icon: Mail, text: "CDN-hosted GIFs" },
  { icon: Smartphone, text: "Mobile optimized" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-purple-100 bg-purple-50/50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Works with
          </span>
          {clients.map((client, i) => (
            <motion.span
              key={client}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-full border border-purple-200 bg-white px-4 py-1.5 text-sm font-medium text-purple-800 shadow-sm"
            >
              {client}
            </motion.span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-purple-600">
              <item.icon className="h-4 w-4 text-purple-500" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

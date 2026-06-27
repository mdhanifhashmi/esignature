"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/landing/fade-in";

const rows = [
  { feature: "Animated logo & profile GIFs", sigmotion: true, others: true },
  { feature: "Interactive nav bar", sigmotion: true, others: true },
  { feature: "AI signature builder", sigmotion: true, others: "Limited" },
  { feature: "Click analytics", sigmotion: true, others: "Coming soon" },
  { feature: "Bulk CSV import", sigmotion: true, others: false },
  { feature: "Price", sigmotion: "Free", others: "Paid subscription" },
  { feature: "Team workspaces", sigmotion: true, others: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-green-500" />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-red-400" />;
  return <span className="text-sm font-medium text-purple-600">{value}</span>;
}

export function Comparison() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
            Why SigMotion
          </span>
          <h2 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl">
            Everything They Charge For —{" "}
            <span className="text-gradient-purple">Free</span>
          </h2>
          <p className="mt-4 text-purple-600/80">
            Same animated signature technology. No monthly subscription required.
          </p>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-purple-100 shadow-xl shadow-purple-500/5"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-950 text-white">
                <th className="px-6 py-4 text-left font-medium">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-purple-200">SigMotion</th>
                <th className="px-6 py-4 text-center font-medium text-purple-300">Others</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-purple-50/50" : "bg-white"}>
                  <td className="px-6 py-4 font-medium text-purple-950">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.sigmotion === "string" ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {row.sigmotion}
                      </span>
                    ) : (
                      <Cell value={row.sigmotion} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Cell value={row.others as boolean | string} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <FadeIn className="mt-8 text-center">
          <Link href="/editor">
            <Button size="lg">
              Start Free — No Credit Card
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

"use client";

import { FadeIn, FadeInItem } from "@/components/landing/fade-in";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Select Your Signature Template",
    description:
      "Use the intuitive editor to create a personalized, professional signature with AI-enhanced layout and branding options.",
    color: "from-purple-500 to-violet-600",
  },
  {
    step: "02",
    title: "Customize for Your Brand",
    description:
      "Add your logo, links, banners, and team details to match your brand identity and drive engagement.",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    step: "03",
    title: "Sync Across Platforms",
    description:
      "Easily integrate your signature with Gmail, Outlook, and any email client that supports HTML signatures.",
    color: "from-violet-600 to-purple-700",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-purple-950 px-4 py-24 sm:px-6">
      {/* Background motion */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="animate-float absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-900/50 px-4 py-1 text-sm font-medium text-purple-200">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Three Steps to a{" "}
            <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Standout Signature
            </span>
          </h2>
          <p className="mt-4 text-purple-300/80">
            Effortlessly create, sync, and deploy AI-powered email signatures.
          </p>
        </FadeIn>

        <FadeIn className="mt-14 grid gap-8 md:grid-cols-3" stagger>
          {steps.map((item, index) => (
            <FadeInItem key={item.step}>
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-900/40 p-8 backdrop-blur-sm"
                whileHover={{ scale: 1.03, borderColor: "rgba(168,85,247,0.5)" }}
              >
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-gradient-to-r from-purple-500 to-transparent md:block" />
                )}
                <span className={`inline-block bg-gradient-to-r ${item.color} bg-clip-text text-5xl font-black text-transparent`}>
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-purple-300/70">{item.description}</p>
                <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${item.color}`} />
              </motion.div>
            </FadeInItem>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

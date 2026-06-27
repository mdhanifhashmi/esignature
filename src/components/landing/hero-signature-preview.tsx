"use client";

import { motion } from "framer-motion";
import { Mail, Link2, Globe } from "lucide-react";

export function HeroSignaturePreview() {
  return (
    <motion.div
      className="relative mx-auto mt-16 max-w-lg"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow behind card */}
      <div className="animate-pulse-glow absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/30 via-fuchsia-500/20 to-violet-500/30 blur-2xl" />

      <div className="animate-nav-pulse relative overflow-hidden rounded-2xl border border-purple-200/60 bg-white p-6 shadow-2xl shadow-purple-500/10">
        {/* Shimmer overlay */}
        <div className="animate-shimmer pointer-events-none absolute inset-0 z-10 opacity-30" />

        <div className="relative flex items-start gap-4">
          {/* Animated profile avatar */}
          <motion.div
            className="relative shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-500 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-lg font-bold text-purple-700">
                SM
              </div>
            </div>
            <motion.span
              className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-purple-950">Sarah Mitchell</p>
            <p className="text-sm text-purple-600">Head of Marketing</p>
            <p className="text-sm font-semibold text-purple-700">SigMotion Inc.</p>
            <p className="mt-1 text-xs italic text-purple-400">Making every email unforgettable ✨</p>
            <p className="mt-1 text-xs text-purple-500">sarah@sigmotion.com</p>
          </div>

          {/* Animated logo */}
          <motion.div
            className="shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600 px-3 py-2 text-xs font-bold text-white"
            animate={{ rotate: [0, -2, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            LOGO
          </motion.div>
        </div>

        {/* Interactive nav bar */}
        <motion.div
          className="mt-4 flex items-center gap-2 rounded-xl bg-purple-50 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: Globe, label: "Web", color: "bg-purple-500" },
            { icon: Link2, label: "LinkedIn", color: "bg-violet-600" },
            { icon: Mail, label: "Email", color: "bg-fuchsia-500" },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              className={`flex items-center gap-1.5 rounded-lg ${item.color} px-3 py-1.5 text-xs font-medium text-white`}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        <p className="mt-3 text-center text-[10px] text-purple-300">
          Hover your mouse — interactive nav bar
        </p>
      </div>

      {/* Floating badges */}
      <motion.div
        className="absolute -left-6 top-8 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-lg shadow-purple-200"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🎬 Logo Animation
      </motion.div>
      <motion.div
        className="absolute -right-4 bottom-12 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        AI Powered ✨
      </motion.div>
    </motion.div>
  );
}

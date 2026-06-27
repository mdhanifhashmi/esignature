"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      className="glass-purple sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-bold text-purple-950">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Sparkles className="h-5 w-5 text-purple-600" />
          </motion.div>
          <span className="text-gradient-purple">{APP_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-purple-700 md:flex">
          {[
            { href: "/live-test", label: "Live Test" },
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it Works" },
            { href: "#faq", label: "FAQ" },
            { href: "/templates", label: "Templates" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-purple-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-purple-700 hover:bg-purple-50 hover:text-purple-900">
              Log in
            </Button>
          </Link>
          <Link href="/editor">
            <Button size="sm" className="shadow-md shadow-purple-500/20">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

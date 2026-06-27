"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-purple-950 px-4 py-14 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-900/50 to-purple-950" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="h-5 w-5 text-purple-400" />
                {APP_NAME}
              </div>
              <p className="mt-3 text-sm text-purple-300/70">
                AI-powered animated email signatures — free forever at launch.
              </p>
            </div>
            <div>
              <p className="font-semibold text-purple-200">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-purple-400">
                <li><Link href="/editor" className="transition-colors hover:text-white">Editor</Link></li>
                <li><Link href="/templates" className="transition-colors hover:text-white">Templates</Link></li>
                <li><Link href="/guides/gmail" className="transition-colors hover:text-white">Install Guides</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-purple-200">Guides</p>
              <ul className="mt-3 space-y-2 text-sm text-purple-400">
                <li><Link href="/guides/gmail" className="transition-colors hover:text-white">Gmail</Link></li>
                <li><Link href="/guides/outlook" className="transition-colors hover:text-white">Outlook</Link></li>
                <li><Link href="/guides/apple-mail" className="transition-colors hover:text-white">Apple Mail</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-purple-200">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-purple-400">
                <li><Link href="/terms" className="transition-colors hover:text-white">Terms of Use</Link></li>
                <li><Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="transition-colors hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t border-purple-800/50 pt-8 text-center text-sm text-purple-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}

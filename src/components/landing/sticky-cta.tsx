"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-200 bg-white/90 p-4 backdrop-blur-lg md:hidden"
        >
          <Link href="/editor" className="block">
            <Button size="lg" className="w-full shadow-lg shadow-purple-500/25">
              Create Free Signature
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

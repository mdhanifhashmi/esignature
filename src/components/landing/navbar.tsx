import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <Sparkles className="h-5 w-5 text-blue-600" />
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/live-test" className="hover:text-slate-900">Live Test</Link>
          <Link href="#features" className="hover:text-slate-900">Features</Link>
          <Link href="#how-it-works" className="hover:text-slate-900">How it Works</Link>
          <Link href="#faq" className="hover:text-slate-900">FAQ</Link>
          <Link href="/templates" className="hover:text-slate-900">Templates</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/editor">
            <Button size="sm">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

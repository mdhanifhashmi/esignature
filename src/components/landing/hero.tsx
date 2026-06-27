import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Badge className="mb-6 border-blue-200 bg-blue-50 text-blue-700">
          100% Free — No subscription required
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Stand Out In Every Inbox
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          The only AI-generated email signature with an interactive nav bar, logo animation,
          and profile animation. Boost replies, drive traffic, and stand out — all free.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/editor">
            <Button size="lg">
              Get Started, FREE
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg">See How It Works</Button>
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span>Trusted by professionals worldwide</span>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-blue-600 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Enhance Your Branding Effortlessly
        </h2>
        <p className="mt-4 text-blue-100">
          Create stylish, AI-crafted email signatures with animated logos and interactive nav bars.
        </p>
        <Link href="/editor">
          <Button size="lg" variant="secondary" className="mt-8">
            Try Now — It&apos;s Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

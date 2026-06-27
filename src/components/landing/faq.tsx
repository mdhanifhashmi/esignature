"use client";

import { FadeIn, FadeInItem } from "@/components/landing/fade-in";

const faqs = [
  {
    q: "Is SigMotion really free?",
    a: "Yes! SigMotion is 100% free at launch. We host your animated signatures on our CDN at no cost. We may introduce optional paid tiers for enterprise features in the future.",
  },
  {
    q: "Does this affect email deliverability?",
    a: "Not at all. SigMotion uses clean, standard HTML/CSS with hosted GIF assets. We never use tracking pixels or JavaScript that could trigger spam filters.",
  },
  {
    q: "Does this work with Gmail and Outlook?",
    a: "Yes! Animated GIFs work in Gmail, Outlook web, Apple Mail, and most mobile clients. Outlook desktop shows the first frame as a static fallback — we design for that.",
  },
  {
    q: "How do animations work in email?",
    a: "We convert your logo and profile photo into optimized animated GIFs hosted on our CDN. Email clients load them like any other image — no subscription required.",
  },
  {
    q: "Can I track link clicks?",
    a: "Yes. SigMotion wraps your links with redirect URLs to track clicks without using tracking pixels, preserving deliverability.",
  },
  {
    q: "Can I create signatures for my whole team?",
    a: "Absolutely. Create an organization, invite team members, and use bulk CSV import to generate signatures for everyone at once.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-white px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold text-purple-950 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <FadeIn className="mt-12 space-y-4" stagger>
          {faqs.map((faq) => (
            <FadeInItem key={faq.q}>
              <details className="group rounded-2xl border border-purple-100 bg-purple-50/30 p-6 open:border-purple-200 open:bg-purple-50 open:shadow-md open:shadow-purple-500/5 transition-all">
                <summary className="cursor-pointer list-none text-lg font-medium text-purple-950 marker:hidden">
                  <span className="flex items-center justify-between">
                    {faq.q}
                    <span className="ml-4 text-purple-400 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-purple-700/80">{faq.a}</p>
              </details>
            </FadeInItem>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

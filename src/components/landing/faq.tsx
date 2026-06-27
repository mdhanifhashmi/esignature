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
    <section id="faq" className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
        </div>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-slate-200 p-6 open:bg-slate-50"
            >
              <summary className="cursor-pointer text-lg font-medium text-slate-900">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

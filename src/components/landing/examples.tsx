import Link from "next/link";
import { Button } from "@/components/ui/button";
import { renderSignatureHtml, getDefaultConfig } from "@/lib/signature/renderHtml";

const examples = [
  {
    name: "Sarah Chen",
    title: "Product Designer",
    company: "DesignCo",
    color: "#7c3aed",
  },
  {
    name: "Marcus Johnson",
    title: "Sales Director",
    company: "GrowthLabs",
    color: "#059669",
  },
  {
    name: "Elena Rodriguez",
    title: "CEO & Founder",
    company: "StartupXYZ",
    color: "#dc2626",
  },
];

export function Examples() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Top User Examples</h2>
          <p className="mt-4 text-slate-600">
            See how professionals use SigMotion to enhance their branding.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {examples.map((ex) => {
            const config = {
              ...getDefaultConfig(),
              fullName: ex.name,
              jobTitle: ex.title,
              company: ex.company,
              email: `${ex.name.split(" ")[0].toLowerCase()}@${ex.company.toLowerCase()}.com`,
              primaryColor: ex.color,
              website: `https://${ex.company.toLowerCase()}.com`,
              tagline: "Making every email count",
            };
            const html = renderSignatureHtml(config);

            return (
              <div key={ex.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/editor">
            <Button>Try For Free</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

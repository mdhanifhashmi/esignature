import { Sparkles, BarChart3, Users, Shield, Zap, Smartphone } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Logo Animation",
    description: "Make your logo stand out with smooth, AI-powered animation presets.",
  },
  {
    icon: Zap,
    title: "Interactive Design",
    description: "Engaging nav bar elements that enhance email visibility and interaction.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description: "Track link clicks across your team with privacy-first redirect tracking.",
  },
  {
    icon: Users,
    title: "Bulk Create Signatures",
    description: "Generate multiple signatures for your entire team from a CSV import.",
  },
  {
    icon: Shield,
    title: "Deliverability Optimized",
    description: "Clean HTML, no tracking pixels, hosted on trusted CDN domains.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Perfectly optimized signatures for all screen sizes and devices.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Highlight Features</h2>
          <p className="mt-4 text-slate-600">
            Everything you need to create stunning animated email signatures — completely free.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 p-6 transition-shadow hover:shadow-md"
            >
              <feature.icon className="h-8 w-8 text-blue-600" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

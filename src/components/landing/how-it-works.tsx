const steps = [
  {
    step: "01",
    title: "Select Your Signature Template",
    description:
      "Use the intuitive editor to create a personalized, professional signature with AI-enhanced layout and branding options.",
  },
  {
    step: "02",
    title: "Customize for Your Brand",
    description:
      "Add your logo, links, banners, and team details to match your brand identity and drive engagement.",
  },
  {
    step: "03",
    title: "Sync Across Platforms",
    description:
      "Easily integrate your signature with Gmail, Outlook, and any email client that supports HTML signatures.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-slate-600">
            Effortlessly create, sync, and deploy AI-powered email signatures.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative rounded-xl bg-white p-8 shadow-sm">
              <span className="text-4xl font-bold text-blue-100">{item.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

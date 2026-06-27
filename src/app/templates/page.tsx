import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATE_OPTIONS } from "@/lib/constants";

const templates = TEMPLATE_OPTIONS.map((t) => ({
  ...t,
  preview: t.id,
}));

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Pro Templates</h1>
          <p className="mt-4 text-slate-600">
            Professionally designed signature templates — pick one and customize in the editor.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{template.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
                  {template.label} layout
                </div>
                <p className="mb-4 text-sm text-slate-600">{template.description}</p>
                <Link href={`/editor?template=${template.id}`}>
                  <Button className="w-full" variant="outline">Use Template</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Templates",
  description: "Professional email signature templates with animated logos and interactive nav bars.",
};

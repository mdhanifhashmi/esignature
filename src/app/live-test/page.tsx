import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { renderSignatureHtml, getDefaultConfig } from "@/lib/signature/renderHtml";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const demoConfig = {
  ...getDefaultConfig(),
  fullName: "Jane Smith",
  jobTitle: "Head of Marketing",
  company: "Acme Corp",
  email: "jane@acme.com",
  phone: "+1 (555) 123-4567",
  website: "https://acme.com",
  tagline: "Building brands that stand out",
  primaryColor: "#2563eb",
};

const compatibility = [
  { client: "Gmail (web & mobile)", gif: "Full animation", hover: "Links only" },
  { client: "Outlook.com", gif: "Full animation", hover: "Partial" },
  { client: "Outlook Desktop (Windows)", gif: "First frame only", hover: "Links only" },
  { client: "Apple Mail", gif: "Full animation", hover: "Full support" },
  { client: "Yahoo Mail", gif: "Full animation", hover: "Links only" },
];

export default function LiveTestPage() {
  const html = renderSignatureHtml(demoConfig);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Live Deliverability Test</h1>
        <p className="mt-2 text-slate-600">
          Preview how your signature renders. No JavaScript, no tracking pixels — clean HTML only.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Signature Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Client Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2">Client</th>
                  <th className="pb-2">GIF Animation</th>
                  <th className="pb-2">Interactivity</th>
                </tr>
              </thead>
              <tbody>
                {compatibility.map((row) => (
                  <tr key={row.client} className="border-b border-slate-50">
                    <td className="py-2 font-medium">{row.client}</td>
                    <td className="py-2 text-slate-600">{row.gif}</td>
                    <td className="py-2 text-slate-600">{row.hover}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/editor" className="text-blue-600 hover:underline">
            Create your own signature →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Live Test",
  description: "Test email signature deliverability and client compatibility.",
};

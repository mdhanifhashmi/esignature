import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

const guides = {
  gmail: {
    title: "Install in Gmail",
    steps: [
      "Open Gmail and click the gear icon → See all settings.",
      "Scroll to the Signature section and click Create new.",
      "Name your signature, then click the Insert image icon.",
      "Switch to the Web Address (URL) tab for hosted GIF images, or paste HTML via a browser extension.",
      "For HTML: use a tool like \"Insert HTML by Mailmeteor\" or paste via Gmail's rich editor.",
      "Alternatively, copy your SigMotion HTML and paste directly if your Gmail supports it.",
      "Select your new signature under \"For new emails use\" and save changes.",
      "Send a test email to verify animations display correctly.",
    ],
  },
  outlook: {
    title: "Install in Outlook",
    steps: [
      "Open Outlook on the web (outlook.com) and go to Settings → Mail → Compose and reply.",
      "Under Email signature, click New signature.",
      "Paste your SigMotion HTML into the signature editor.",
      "For animated GIFs, use Insert picture → From URL and paste your hosted GIF URLs.",
      "Save your signature and set it as default for new messages.",
      "Note: Outlook desktop for Windows shows only the first GIF frame — this is expected.",
      "Send a test email to yourself to verify the signature.",
    ],
  },
  "apple-mail": {
    title: "Install in Apple Mail",
    steps: [
      "Open Mail → Settings (or Preferences) → Signatures.",
      "Select your email account and click the + button to create a new signature.",
      "Drag your animated GIF directly into the signature box, or paste HTML.",
      "Apple Mail has excellent GIF support — animations will play automatically.",
      "Uncheck \"Always match my default message font\" for best results.",
      "Close settings and compose a new email to test.",
    ],
  },
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client } = await params;
  const guide = guides[client as keyof typeof guides];

  if (!guide) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Guide not found</h1>
          <Link href="/"><Button className="mt-4">Go Home</Button></Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">{guide.title}</h1>
        <p className="mt-2 text-slate-600">
          Follow these steps to install your SigMotion animated signature.
        </p>
        <ol className="mt-8 space-y-4">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {i + 1}
              </span>
              <p className="pt-1 text-slate-700">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex gap-4">
          <Link href="/editor"><Button>Create Signature</Button></Link>
          <Link href="/guides/gmail"><Button variant="outline">Other Guides</Button></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

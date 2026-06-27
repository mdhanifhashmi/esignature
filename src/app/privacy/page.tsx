import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { APP_NAME } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose prose-slate">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <p>
          {APP_NAME} respects your privacy. We collect account information (email, name) and
          signature data you provide. We do not use tracking pixels in email signatures.
        </p>
        <h2>Data We Collect</h2>
        <ul>
          <li>Account info: email, name, profile photo</li>
          <li>Signature content: logos, contact details, social links</li>
          <li>Analytics: click counts on tracked links (no IP storage by default)</li>
        </ul>
        <h2>Data Storage</h2>
        <p>
          Data is stored securely on Supabase (PostgreSQL) with row-level security. Assets are
          hosted on Supabase Storage CDN.
        </p>
        <h2>Your Rights</h2>
        <p>
          You may delete your account and all associated data at any time by contacting support
          or deleting signatures from your dashboard.
        </p>
        <Link href="/" className="text-blue-600">← Back to home</Link>
      </main>
      <Footer />
    </>
  );
}

export const metadata = { title: "Privacy Policy" };

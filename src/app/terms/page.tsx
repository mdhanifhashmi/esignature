import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { APP_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose prose-slate">
        <h1>Terms of Use</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <p>
          By using {APP_NAME}, you agree to these terms. {APP_NAME} provides free email signature
          creation and hosting services. You retain ownership of your content. We may modify or
          discontinue the service with reasonable notice.
        </p>
        <h2>Acceptable Use</h2>
        <p>
          You may not use {APP_NAME} for spam, illegal content, or to impersonate others.
          Animated signatures must comply with your email provider&apos;s policies.
        </p>
        <h2>Service Availability</h2>
        <p>
          We strive for 99.9% uptime but do not guarantee uninterrupted service. Hosted GIF
          assets require an active account.
        </p>
        <Link href="/" className="text-blue-600">← Back to home</Link>
      </main>
      <Footer />
    </>
  );
}

export const metadata = { title: "Terms of Use" };

import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { APP_NAME } from "@/lib/constants";

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 prose prose-slate">
        <h1>Cookie Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        <p>
          {APP_NAME} uses essential cookies for authentication and session management via Supabase Auth.
          We do not use advertising or third-party tracking cookies.
        </p>
        <h2>Essential Cookies</h2>
        <ul>
          <li><strong>Auth session</strong> — keeps you signed in</li>
          <li><strong>CSRF protection</strong> — secures form submissions</li>
        </ul>
        <Link href="/" className="text-blue-600">← Back to home</Link>
      </main>
      <Footer />
    </>
  );
}

export const metadata = { title: "Cookie Policy" };

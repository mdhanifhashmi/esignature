import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-bold text-slate-900">{APP_NAME}</p>
            <p className="mt-2 text-sm text-slate-600">
              AI-powered animated email signatures — free forever at launch.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Product</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><Link href="/editor" className="hover:text-slate-900">Editor</Link></li>
              <li><Link href="/templates" className="hover:text-slate-900">Templates</Link></li>
              <li><Link href="/guides/gmail" className="hover:text-slate-900">Install Guides</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Guides</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><Link href="/guides/gmail" className="hover:text-slate-900">Gmail</Link></li>
              <li><Link href="/guides/outlook" className="hover:text-slate-900">Outlook</Link></li>
              <li><Link href="/guides/apple-mail" className="hover:text-slate-900">Apple Mail</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Legal</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              <li><Link href="/terms" className="hover:text-slate-900">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-slate-900">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

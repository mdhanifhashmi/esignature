import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  BarChart3,
  Upload,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/dashboard", label: "Signatures", icon: LayoutDashboard },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/bulk", label: "Bulk Import", icon: Upload },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">{APP_NAME}</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" type="submit">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-blue-600" />
              {APP_NAME}
            </Link>
            <Link href="/editor">
              <Button size="sm"><Plus className="h-4 w-4" /> New</Button>
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

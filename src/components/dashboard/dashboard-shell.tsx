"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  BarChart3,
  Upload,
  LogOut,
  Plus,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Signatures", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/bulk", label: "Bulk Import", icon: Upload },
];

export function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mesh-purple">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-purple-200/50 bg-white/70 backdrop-blur-xl md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-purple-100 px-4">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}>
            <Sparkles className="h-5 w-5 text-purple-600" />
          </motion.div>
          <span className="font-bold text-gradient-purple">{APP_NAME}</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/25"
                      : "text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                  )}
                  whileHover={{ x: active ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-purple-100 p-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-purple-600 hover:bg-purple-50">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <p className="truncate px-3 text-xs text-purple-400">{userEmail}</p>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" className="w-full justify-start text-purple-600 hover:bg-purple-50" type="submit">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="glass-purple border-b border-purple-200/50 px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-purple-950">
              <Sparkles className="h-5 w-5 text-purple-600" />
              {APP_NAME}
            </Link>
            <Link href="/editor">
              <Button size="sm"><Plus className="h-4 w-4" /> New</Button>
            </Link>
          </div>
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
                      active ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

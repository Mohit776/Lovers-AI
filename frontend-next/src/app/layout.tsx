"use client";

import "./globals.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutGrid, ClipboardList, Settings, Sparkles, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Opportunities", icon: LayoutGrid },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin", label: "Admin", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar w-64 h-screen flex flex-col sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="w-4.5 h-4.5 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Lovers AI</span>
        </div>
        <p className="text-[11px] text-white/35 pl-0.5 leading-relaxed">
          AI-powered opportunity discovery
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 pt-2 pb-1">
          Navigation
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`sidebar-link ${isActive ? "active" : ""}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="p-4 m-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-semibold text-white/70">AI-Powered</span>
        </div>
        <p className="text-[11px] text-white/35 leading-relaxed">
          Opportunities are auto-discovered and extracted using Groq AI.
        </p>
      </div>
    </aside>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Lovers AI — Opportunity Tracker</title>
        <meta name="description" content="AI-powered opportunity discovery and tracking" />
      </head>
      <body className="bg-[#f8f7ff] text-slate-900 min-h-screen flex">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}

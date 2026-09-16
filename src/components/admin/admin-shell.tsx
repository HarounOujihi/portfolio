"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const GROUPS: { label: string; items: { href: string; label: string; exact?: boolean }[] }[] = [
  {
    label: "Content",
    items: [
      { href: "/admin", label: "Overview", exact: true },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/experience", label: "Experience" },
      { href: "/admin/conversations", label: "Conversations" },
      { href: "/admin/evals", label: "Evals" },
      { href: "/admin/manage/articles", label: "Articles" },
      { href: "/admin/manage/technologies", label: "Technologies" },
      { href: "/admin/manage/skills", label: "Skills" },
      { href: "/admin/manage/education", label: "Education" },
      { href: "/admin/manage/certifications", label: "Certifications" },
      { href: "/admin/profile", label: "Profile" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/analytics", label: "Analytics" },
      { href: "/admin/stats", label: "Signals" },
      { href: "/admin/job-match", label: "Job matches" },
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/export", label: "Export (JSON)" },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {GROUPS.map((group) => (
        <div key={group.label} className="mt-6 first:mt-0">
          <p className="px-3 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">{group.label}</p>
          <div className="mt-2 flex flex-col">
            {group.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-3 text-sm transition-colors ${
                    active ? "bg-white font-semibold text-neutral-950" : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function SidebarFooter({ email }: { email: string }) {
  return (
    <div className="mt-auto space-y-3 px-3 pb-6">
      <p className="truncate text-xs text-neutral-400">{email}</p>
      <Link
        href="/"
        target="_blank"
        className="flex h-10 items-center justify-center rounded-full border border-white/20 text-sm text-neutral-200 hover:border-white/50"
      >
        View site ↗
      </Link>
    </div>
  );
}

/** Admin shell — persistent left sidebar on desktop, toggleable drawer on mobile. */
export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-neutral-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/10 bg-neutral-950 pt-6 md:flex">
        <p className="px-4 text-base font-bold tracking-tight">
          Portfolio <span className="text-neutral-400">admin</span>
        </p>
        <nav aria-label="Admin" className="mt-6 flex-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <SidebarFooter email={email} />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="md:pl-60">
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-neutral-950/80 px-5 pt-[env(safe-area-inset-top)] backdrop-blur md:hidden">
          <p className="text-base font-bold tracking-tight">
            Portfolio <span className="text-neutral-400">admin</span>
          </p>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open admin menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </SheetTrigger>
            <SheetContent side="left" className="w-full overflow-y-auto px-5 pt-[env(safe-area-inset-top)] pb-6 sm:max-w-xs">
              <SheetTitle className="text-base font-bold">Admin menu</SheetTitle>
              <nav aria-label="Admin mobile" className="mt-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
              <SidebarFooter email={email} />
            </SheetContent>
          </Sheet>
        </div>
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

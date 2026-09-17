"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TrackedLink } from "@/components/tracked-link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/engineering", label: "Engineering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Client header — active states via usePathname; CV URL comes from the DB. */
export function SiteHeader({ cvUrl, admin }: { cvUrl: string; admin?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Haroun Oujihi
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-11 items-center rounded-full px-4 transition-colors ${
                  active
                    ? "bg-brand-soft font-medium text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                {item.label}
                {active && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 40 6"
                    className="absolute -bottom-0.5 left-1/2 w-8 -translate-x-1/2"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,6 C10,0 30,0 40,6" fill="none" stroke="var(--brand)" strokeWidth="2" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {admin && (
            <Link
              href="/admin"
              className="hidden h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-neutral-200 transition-colors hover:border-[var(--brand)] hover:text-neutral-100 sm:flex"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
              </svg>
              Admin
            </Link>
          )}
          <TrackedLink
            href={cvUrl}
            eventType="CV_DOWNLOAD"
            entityId="cv-header"
            download
            className="hidden h-11 items-center rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90 sm:flex"
          >
            Download CV
          </TrackedLink>

          <SiteMobileMenu cvUrl={cvUrl} pathname={pathname} admin={admin} />
        </div>
      </div>
    </header>
  );
}

function SiteMobileMenu({
  cvUrl,
  pathname,
  admin,
}: {
  cvUrl: string;
  pathname: string;
  admin?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 md:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto px-6 pt-[env(safe-area-inset-top)] pb-6 sm:max-w-sm">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav aria-label="Mobile" className="mt-4 flex flex-col">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 items-center border-b border-white/5 py-3 text-lg font-medium ${
                  active ? "text-[var(--brand)]" : "text-neutral-200"
                }`}
              >
                {item.label}
                {active && <span aria-hidden="true" className="ml-auto text-[var(--brand)]">●</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 flex flex-col gap-3 pb-6">
          {admin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 font-medium text-neutral-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
              </svg>
              Administration
            </Link>
          )}
          <TrackedLink
            href={cvUrl}
            eventType="CV_DOWNLOAD"
            entityId="cv-mobile-menu"
            download
            onNavigate={() => setOpen(false)}
            className="flex h-12 items-center justify-center rounded-full bg-[var(--brand)] font-medium text-neutral-950"
          >
            Download CV
          </TrackedLink>
          <div className="flex justify-center gap-5 text-sm text-neutral-400">
            <a href="https://github.com/HarounOujihi" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              GitHub
            </a>
            <a href="https://linkedin.com/in/haroun-oujihi" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              LinkedIn
            </a>
            <a href="mailto:haroun.oujihi@hotmail.com" onClick={() => setOpen(false)}>
              Email
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

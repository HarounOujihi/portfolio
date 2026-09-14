"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TrackedLink } from "@/components/tracked-link";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/engineering", label: "Engineering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Mobile drawer — receives the live CV URL from the database. */
export function SiteMobileMenu({ cvUrl }: { cvUrl: string }) {
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
      <SheetContent side="right" className="w-full pt-[env(safe-area-inset-top)] sm:max-w-sm">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav aria-label="Mobile" className="mt-4 flex flex-col">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center border-b border-white/5 py-3 text-lg font-medium text-neutral-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3 pb-6">
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
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

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Haroun Oujihi
        </Link>

        {/* Desktop nav — active link: brand color + curved underline (design-system §1.5) */}
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
          <a
            href="/haroun-oujihi-cv.pdf"
            download
            className="hidden h-11 items-center rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-neutral-950 transition-opacity hover:opacity-90 sm:flex"
          >
            Download CV
          </a>

          {/* Mobile menu — full-height sheet, big staggered links, active marker */}
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
                {NAV.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.span
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i, duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-14 items-baseline gap-4 border-b border-white/10 py-3 ${
                          active ? "text-[var(--brand)]" : "text-neutral-200"
                        }`}
                      >
                        <span className="text-xs font-medium text-neutral-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-3xl font-semibold tracking-tight">{item.label}</span>
                        {active && (
                          <span aria-hidden="true" className="ml-auto text-[var(--brand)]">
                            ●
                          </span>
                        )}
                      </Link>
                    </motion.span>
                  );
                })}
              </nav>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.3 }}
                  className="mt-auto flex flex-col gap-3 pb-6"
                >
                  <a
                    href="/haroun-oujihi-cv.pdf"
                    download
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-[var(--brand)] font-medium text-neutral-950"
                  >
                    Download CV
                  </a>
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
                </motion.div>
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

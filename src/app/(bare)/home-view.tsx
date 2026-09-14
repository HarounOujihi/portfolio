"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DemoMarquee, DemoWorkCard } from "@/components/demo/demo-bits";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/tracked-link";
import { trackEvent } from "@/lib/track";

interface Profile {
  fullName: string;
  headline: string;
  shortBio: string;
  availability: string;
  email: string;
  avatarUrl: string;
}

interface Work {
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  tags: string[];
  img: string;
  big: boolean;
}

interface Props {
  profile: Profile;
  tech: string[];
  work: Work[];
  stats: { value: string; label: string }[];
  pipeline: string[];
}

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

const PAGE_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/engineering", label: "Engineering" },
  { href: "/about", label: "About" },
];

const SECTION_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#signals", label: "Signals" },
  { href: "#ai", label: "AI in production" },
  { href: "#contact", label: "Contact" },
];

export function HomeView({ profile, tech, work, stats, pipeline }: Props) {
  const bigWork = work.find((w) => w.big)!;
  const smallWork = work.filter((w) => !w.big);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="min-h-[100dvh] bg-neutral-950 text-neutral-100">
      {/* ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 85% -10%, rgba(2,111,215,0.22), transparent 60%), radial-gradient(40rem 30rem at -10% 30%, rgba(2,111,215,0.10), transparent 60%)",
        }}
      />

      {/* top bar */}
      <nav aria-label="Home" className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Haroun Oujihi
          </Link>
          <div className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
            {SECTION_LINKS.map((s) => (
              <a key={s.href} href={s.href} className="hover:text-white">
                {s.label}
              </a>
            ))}
            <span aria-hidden="true" className="text-white/20">|</span>
            {PAGE_LINKS.map((p) => (
              <Link key={p.href} href={p.href} className="hover:text-white">
                {p.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-neutral-950"
            >
              Let&apos;s talk
            </a>

            {/* Mobile menu — sections + site pages (design-system §4) */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Sections</p>
                <nav aria-label="Home sections" className="mt-2 flex flex-col">
                  {SECTION_LINKS.map((s, i) => (
                    <motion.span
                      key={s.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.25, ease: "easeOut" }}
                    >
                      <a
                        href={s.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-12 items-center gap-4 border-b border-white/5 py-2.5 text-lg font-medium text-neutral-200"
                      >
                        <span className="text-xs text-[var(--brand)]">{String(i + 1).padStart(2, "0")}</span>
                        {s.label}
                      </a>
                    </motion.span>
                  ))}
                </nav>

                <p className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">Explore</p>
                <nav aria-label="Site pages" className="mt-2 flex flex-col">
                  {PAGE_LINKS.map((p, i) => (
                    <motion.span
                      key={p.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + 0.05 * i, duration: 0.25, ease: "easeOut" }}
                    >
                      <Link
                        href={p.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-12 items-center border-b border-white/5 py-2.5 text-lg font-medium text-neutral-200"
                      >
                        {p.label}
                      </Link>
                    </motion.span>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.25 }}
                  className="mt-8 flex flex-col gap-3 pb-6"
                >
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-white font-semibold text-neutral-950"
                  >
                    Let&apos;s talk
                  </a>
                  <TrackedLink
                    href="/haroun-oujihi-cv.pdf"
                    download
                    eventType="CV_DOWNLOAD"
                    entityId="cv-mobile-menu"
                    onNavigate={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-white/20 font-medium text-neutral-200"
                  >
                    Download CV
                  </TrackedLink>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* HERO — oversized editorial typography */}
      <header className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-neutral-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {profile.availability}
        </motion.p>

        <h1 className="mt-8 font-bold uppercase leading-[0.82] tracking-tighter">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="block text-[clamp(4rem,15vw,12rem)]"
          >
            HAROUN
          </motion.span>
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
            aria-hidden="true"
            className="text-stroke block text-[clamp(4rem,15vw,12rem)]"
          >
            OUJIHI
            <span className="sr-only">OUJIHI</span>
          </motion.span>
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}>
            <p className="max-w-xl text-xl leading-relaxed text-neutral-300">{profile.headline}</p>
            <p className="mt-4 max-w-xl text-neutral-400">{profile.shortBio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="flex h-12 items-center rounded-full bg-white px-7 font-semibold text-neutral-950 transition-transform hover:-translate-y-0.5"
              >
                See the work ↓
              </a>
              <a
                href={`mailto:${profile.email}`}
                onClick={() => trackEvent("CONTACT_CLICK", { entityType: "link", entityId: "hero-email" })}
                className="flex h-12 items-center rounded-full border border-white/20 px-7 font-medium text-neutral-200 transition-colors hover:border-white/50"
              >
                {profile.email}
              </a>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }} className="relative mx-auto w-64 sm:w-72 lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-2 rotate-[3deg] rounded-[2rem] border border-white/10 bg-white/[0.04]"
            />
            <Image
              src={profile.avatarUrl}
              alt="Portrait of Haroun Oujihi"
              width={520}
              height={520}
              priority
              sizes="(min-width: 1024px) 18rem, 60vw"
              className="relative aspect-square w-full -rotate-2 rounded-[2rem] object-cover grayscale"
            />
          </motion.div>
        </div>
      </header>

      <DemoMarquee items={tech} />

      {/* 01 — WORK: editorial bento */}
      <section id="work" aria-labelledby="work-h" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">01 / Selected work</p>
          <h2 id="work-h" className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">
            Work that shipped
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <DemoWorkCard work={bigWork} priority />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5">
            <DemoWorkCard work={smallWork[0]!} />
          </Reveal>
          {smallWork.slice(1).map((w, i) => (
            <Reveal key={w.slug} delay={0.05 * i} className="md:col-span-6">
              <DemoWorkCard work={w} />
            </Reveal>
          ))}
          <Reveal delay={0.1} className="md:col-span-6">
            <Link
              href="/projects"
              className="group flex h-full min-h-56 flex-col justify-between rounded-3xl border border-dashed border-white/20 p-7 transition-colors hover:border-white/50"
            >
              <p className="text-lg font-semibold">All projects, filters and case studies →</p>
              <p className="text-sm text-neutral-400">The full catalog with architecture deep-dives.</p>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 02 — SIGNALS: stats */}
      <section id="signals" aria-labelledby="signals-h" className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">02 / Signals</p>
            <h2 id="signals-h" className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">
              The short version
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.06 * i}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                  <p className="text-5xl font-bold tracking-tighter text-white">{s.value}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — AI IN PRODUCTION: pipeline strip */}
      <section id="ai" aria-labelledby="ai-h" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">03 / Applied AI</p>
          <h2 id="ai-h" className="mt-3 max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl">
            From paper invoices to matched purchase orders — in production
          </h2>
          <p className="mt-5 max-w-2xl text-neutral-400">
            OCR and extraction before generation, schema validation as the router, multi-model cost
            control, per-tenant rollout flags. The AI layer sits on an ERP data model worth querying.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ol className="mt-12 grid gap-3 sm:grid-cols-5">
            {pipeline.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-col sm:items-start sm:gap-6"
              >
                <span className="text-sm font-bold text-[var(--brand)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-neutral-200">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 rounded-3xl border border-[var(--brand)]/40 bg-[var(--color-brand-soft)] p-7 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight">ERP AI agent</h3>
              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-neutral-300">
                New
              </span>
            </div>
            <p className="mt-3 max-w-2xl leading-relaxed text-neutral-300">
              An agentic layer on top of the multi-tenant ERP — beyond answering questions, toward
              executing workflows across inventory, purchasing, sales, and finance.
            </p>
            <Link
              href="/projects/soldx-studio"
              className="mt-5 inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium text-neutral-100 transition-colors hover:border-white/60"
            >
              See the platform it runs on →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 04 — CONTACT */}
      <section id="contact" aria-labelledby="contact-h" className="border-t border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-28 text-center sm:px-8">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">04 / Contact</p>
            <h2 id="contact-h" className="mx-auto mt-4 max-w-3xl text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
              Have a role in mind?
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex h-14 items-center rounded-full bg-white px-9 font-semibold text-neutral-950 transition-transform hover:-translate-y-0.5"
              >
                {profile.email}
              </a>
              <Link
                href="/contact"
                className="flex h-14 items-center rounded-full border border-white/20 px-9 font-medium text-neutral-200 transition-colors hover:border-white/50"
              >
                Send a message →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
              <a
                href="https://github.com/HarounOujihi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/haroun-oujihi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Haroun Oujihi</p>
          <div className="flex gap-5">
            <a href="https://github.com/HarounOujihi" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
            <a href="https://linkedin.com/in/haroun-oujihi" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
            <TrackedLink href="/haroun-oujihi-cv.pdf" eventType="CV_DOWNLOAD" entityId="cv-footer" download className="hover:text-white">
              CV
            </TrackedLink>
          </div>
        </div>
      </footer>
    </main>
  );
}

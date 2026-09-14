"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { trackEvent } from "@/lib/track";
import { DemoMarquee, DemoWorkCard } from "@/components/demo/demo-bits";
import { Reveal } from "@/components/reveal";

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

export function HomeView({ profile, tech, work, stats, pipeline }: Props) {
  const bigWork = work.find((w) => w.big)!;
  const smallWork = work.filter((w) => !w.big);

  return (
    <main className="min-h-[100dvh] bg-neutral-950 text-neutral-100">
      {/* ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 85% -10%, rgba(2,111,215,0.22), transparent 60%), radial-gradient(40rem 30rem at -10% 30%, rgba(2,111,215,0.10), transparent 60%)",
        }}
      />

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

      {/* 03 — APPLIED AI: pipeline strip */}
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
          <Link
            href="/projects/soldx-studio"
            className="mt-8 inline-flex h-12 items-center rounded-full border border-white/20 px-7 font-medium text-neutral-200 transition-colors hover:border-white/50"
          >
            Step through the pipeline →
          </Link>
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
                onClick={() => trackEvent("CONTACT_CLICK", { entityType: "link", entityId: "contact-section" })}
                className="flex h-14 items-center rounded-full bg-white px-9 font-semibold text-neutral-950 transition-transform hover:-translate-y-0.5"
              >
                {profile.email}
              </a>
              <Link
                href="/contact"
                onClick={() => trackEvent("CONTACT_CLICK", { entityType: "link", entityId: "contact-form-link" })}
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
                onClick={() => trackEvent("GITHUB_CLICK", { entityType: "link", entityId: "home-contact" })}
                className="hover:text-white"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/haroun-oujihi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("LINKEDIN_CLICK", { entityType: "link", entityId: "home-contact" })}
                className="hover:text-white"
              >
                LinkedIn ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

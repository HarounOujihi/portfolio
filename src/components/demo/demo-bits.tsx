"use client";

import Link from "next/link";
import { motion } from "motion/react";

/** Infinite tech marquee — CSS animation, duplicated track, reduced-motion safe. */
export function DemoMarquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-white/[0.03] py-5">
      <div className="animate-marquee-x flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-medium text-neutral-300">
            {t}
            <span className="text-[var(--brand)]">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export interface DemoWork {
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  tags: string[];
  img: string;
  big?: boolean;
}

/** Bento work card — whole card links to the case study. */
export function DemoWorkCard({
  work,
  priority = false,
  className = "",
}: {
  work: DemoWork;
  priority?: boolean;
  className?: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] ${className}`}
    >
      <Link href={`/projects/${work.slug}`} className="flex h-full flex-col">
        <div className={`relative overflow-hidden ${work.big ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.img}
            alt={`${work.name} — ${work.kind}`}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-neutral-200">
            {work.kind}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">{work.name}</h3>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-neutral-400">{work.blurb}</p>
          <div className="flex flex-wrap gap-1.5">
            {work.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-neutral-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

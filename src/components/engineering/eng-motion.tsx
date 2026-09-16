"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CountUp } from "@/components/motion/count-up";

/** Eval pass-rate ring — the stroke draws to the pass rate when scrolled into view. */
export function EvalGauge({ passed, judged }: { passed: number; judged: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const rate = judged ? passed / judged : 0;
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const pct = judged ? Math.round(rate * 100) : 0;

  return (
    <div ref={ref} className="relative h-28 w-28 shrink-0" role="img" aria-label={`${pct}% pass rate`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - rate) } : {}}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold tracking-tight">
          <CountUp value={pct} suffix="%" duration={1.4} />
        </span>
      </div>
    </div>
  );
}

/** One live metric — counts up when visible. */
export function MetricStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="rounded-(--radius-card) border border-white/15 p-4">
      <p className="text-2xl font-bold tracking-tight">
        <CountUp value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs leading-snug text-neutral-400">{label}</p>
    </div>
  );
}

/** ADR card — staggers in via its MotionStagger parent. */
export function AdrCard({ index, choice, because }: { index: string; choice: string; because: string }) {
  return (
    <motion.li
      className="rounded-(--radius-card) border border-white/15 p-5"
      variants={staggerItem}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--brand)]">{index}</p>
      <h3 className="mt-1.5 font-semibold">{choice}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{because}</p>
    </motion.li>
  );
}

export function MotionStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.ul>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export { motion };

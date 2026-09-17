"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Counts 0 → value when scrolled into view (reduced-motion users see the final value instantly). */
export function CountUp({ value, suffix = "", duration = 1.2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Live metric card — the number counts up when scrolled into view. */
export function MetricStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="rounded-(--radius-card) border border-white/15 p-4">
      <p className="min-h-8 text-2xl font-bold tracking-tight tabular-nums">
        <CountUp value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs leading-snug text-neutral-400">{label}</p>
    </div>
  );
}

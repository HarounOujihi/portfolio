import type { ReactNode } from "react";

/**
 * Scroll reveal — server-rendered and visible by default.
 * A tiny bootstrap script (layout) adds .reveal-hidden to [data-reveal] elements,
 * then .reveal-in as they intersect. No JS → content simply shows (never hidden).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={className}>
      {children}
    </div>
  );
}

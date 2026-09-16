import type { ReactNode } from "react";

/** ADR card — revealed on scroll via the global [data-reveal] observer. */
export function AdrCard({ index, choice, because }: { index: string; choice: string; because: string }) {
  return (
    <li data-reveal className="rounded-(--radius-card) border border-white/15 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--brand)]">{index}</p>
      <h3 className="mt-1.5 font-semibold">{choice}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{because}</p>
    </li>
  );
}

/** Stagger container — children carry their own data-reveal + delays. */
export function RevealList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul className={className}>
      {children}
    </ul>
  );
}

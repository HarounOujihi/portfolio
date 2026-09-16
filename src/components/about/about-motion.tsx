import type { ReactNode } from "react";

export interface PillItem {
  name: string;
  note?: string;
}

/**
 * Skill category — header + pill cloud, each pill revealed on scroll via
 * the global [data-reveal] observer (server-rendered, visible without JS).
 */
export function SkillGroup({ label, items }: { label: string; items: PillItem[] }) {
  return (
    <div>
      <h3 data-reveal className="text-sm font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li
            key={item.name}
            data-reveal
            style={{ transitionDelay: `${i * 40}ms` }}
            title={item.note}
            className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-3.5 text-sm"
          >
            <span className="font-medium">{item.name}</span>
            {item.note && <span className="text-xs text-neutral-400">{item.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Generic reveal wrapper for section content. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}

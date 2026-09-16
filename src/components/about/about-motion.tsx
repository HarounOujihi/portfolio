"use client";

import { motion } from "motion/react";

export interface PillItem {
  name: string;
  note?: string;
}

/** Staggered pill cloud for skill groups. */
export function StaggerPills({ items }: { items: PillItem[] }) {
  return (
    <motion.ul
      className="mt-3 flex flex-wrap gap-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.035 } } }}
    >
      {items.map((item) => (
        <motion.li
          key={item.name}
          variants={{
            hidden: { opacity: 0, y: 10, scale: 0.95 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
          }}
          title={item.note}
          className="flex h-9 items-center gap-2 rounded-full border border-white/15 px-3.5 text-sm"
        >
          <span className="font-medium">{item.name}</span>
          {item.note && <span className="text-xs text-neutral-400">{item.note}</span>}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** One skill category — header + pill cloud animate as a group. */
export function SkillGroup({ label, items }: { label: string; items: PillItem[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.h3 variants={groupItem} className="text-sm font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </motion.h3>
      <StaggerPills items={items} />
    </motion.div>
  );
}

/** Section header reveal + content stagger container. */
export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}

export const groupItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export { motion };

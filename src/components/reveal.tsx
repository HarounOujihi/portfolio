"use client";

import { motion } from "motion/react";

/**
 * Scroll-triggered reveal (fade + rise, once) — the site's standard micro-interaction.
 * Server Components can wrap children with it; MotionConfig reducedMotion="user"
 * disables it for reduced-motion users.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

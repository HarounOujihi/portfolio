"use client";

import { MotionConfig } from "motion/react";

/** Global motion defaults — respects the user's reduced-motion preference everywhere. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

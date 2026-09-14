/**
 * Hero bottom curve — design-system §1.1 animated variant (owner-requested pattern):
 * filled area in the INCOMING section's background + a brand-colored stroke line
 * that draws itself along the curve (CSS only — pathLength normalized).
 * Static under prefers-reduced-motion. Decorative: aria-hidden.
 */
export function AnimatedCurve({
  fill,
  className = "",
}: {
  fill: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full ${className}`}
    >
      <path d="M0,120 C360,0 1080,0 1440,120 L1440,120 L0,120 Z" fill={fill} />
      <path
        d="M0,120 C360,0 1080,0 1440,120"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.5"
        pathLength={1}
        className="curve-line"
      />
    </svg>
  );
}

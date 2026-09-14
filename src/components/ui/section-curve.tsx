/**
 * Curved section divider — design-system §1.1.
 * `fill` is the background color of the INCOMING section (the side the curve bulges into).
 * Decorative only: aria-hidden.
 */
export function SectionCurve({
  fill,
  flip = false,
  className = "",
}: {
  fill: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-12 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path d="M0,96 C360,0 1080,0 1440,96 L1440,96 L0,96 Z" fill={fill} />
    </svg>
  );
}

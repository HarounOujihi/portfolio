"use client";

import type { EventType } from "@/lib/track";
import { trackEvent } from "@/lib/track";

/** Anchor wrapper that reports a click event, then follows the link normally. */
export function TrackedLink({
  href,
  eventType,
  entityId,
  children,
  className,
  external = false,
  download = false,
  ariaLabel,
  onNavigate,
}: {
  href: string;
  eventType: EventType;
  entityId?: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={() => {
        trackEvent(eventType, { entityType: "link", entityId: entityId ?? href });
        onNavigate?.();
      }}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      {children}
    </a>
  );
}

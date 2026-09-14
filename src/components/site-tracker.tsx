"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/track";

/**
 * Auto-tracks a PAGE_VIEW on every route change across the public site,
 * capturing the external referrer once per browser session.
 */
export function SiteTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const referrer = first.current && document.referrer ? document.referrer.slice(0, 300) : undefined;
    trackEvent("PAGE_VIEW", { entityId: pathname, referrer });
    first.current = false;
  }, [pathname]);

  return null;
}

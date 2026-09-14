"use client";

import { useEffect } from "react";
import { trackEvent, type EventType } from "@/lib/track";

/** Fires a typed event once when the tracked section/page mounts. */
export function PageViewTracker({
  eventType,
  entityId,
}: {
  eventType: EventType;
  entityId?: string;
}) {
  useEffect(() => {
    trackEvent(eventType, { entityType: eventType === "PROJECT_VIEW" ? "project" : eventType === "ARTICLE_VIEW" ? "article" : undefined, entityId });
  }, [eventType, entityId]);

  return null;
}

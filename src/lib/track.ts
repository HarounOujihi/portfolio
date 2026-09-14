"use client";

/**
 * Anonymous, session-scoped event tracking (Phase 11).
 * - No cookies, no personal data, no consent banner required.
 * - The session id is a random UUID in localStorage — device-scoped, never
 *   tied to identity. Analytics must never break the page.
 */

const SID_KEY = "portfolio.sid";

function sessionId(): string {
  let id = localStorage.getItem(SID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SID_KEY, id);
  }
  return id;
}

export type EventType =
  | "PAGE_VIEW"
  | "CV_DOWNLOAD"
  | "PROJECT_VIEW"
  | "ARTICLE_VIEW"
  | "AI_OPEN"
  | "AI_QUESTION"
  | "JOB_MATCH_RUN"
  | "CONTACT_CLICK"
  | "CONTACT_SUBMIT"
  | "GITHUB_CLICK"
  | "LINKEDIN_CLICK";

export function trackEvent(
  eventType: EventType,
  opts?: { entityType?: string; entityId?: string; referrer?: string }
): void {
  try {
    const payload = JSON.stringify({
      eventType,
      sessionId: sessionId(),
      entityType: opts?.entityType,
      entityId: opts?.entityId,
      referrer: opts?.referrer,
    });
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/events", blob)) return;
    fetch("/api/events", {
      method: "POST",
      body: payload,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  } catch {
    // ignore — analytics must never break the page
  }
}

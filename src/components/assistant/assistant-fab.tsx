"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

/** Floating "Ask AI" bubble — visible on all public pages, links to /assistant. */
export function AssistantFab() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === "/assistant") return null;

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("AI_OPEN", { entityId: "fab" });
        router.push("/assistant");
      }}
      aria-label="Ask AI about Haroun's work"
      className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
        <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
      </svg>
      Ask AI
    </button>
  );
}

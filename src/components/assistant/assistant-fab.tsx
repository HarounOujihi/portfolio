"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track";

const CHIP_KEY = "ai-fab-intro-dismissed";

/**
 * Floating "Ask me" bubble — every public page except /assistant.
 * Deliberately attention-grabbing so visitors recognize it as an AI assistant:
 * spring entrance, pulsing halo, twinkling sparkles, and a dismissible intro chip.
 */
export function AssistantFab() {
  const router = useRouter();
  const pathname = usePathname();
  const [chip, setChip] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CHIP_KEY)) return;
    const t = setTimeout(() => setChip(true), 1400);
    return () => clearTimeout(t);
  }, []);

  if (pathname === "/assistant") return null;

  function dismissChip() {
    setChip(false);
    localStorage.setItem(CHIP_KEY, "1");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {chip && (
        <div
          className="animate-chip-enter relative mr-1 max-w-56 rounded-2xl rounded-br-sm border border-white/10 bg-neutral-900/95 p-3.5 pr-8 text-sm text-neutral-200 shadow-xl shadow-black/40 backdrop-blur"
          role="status"
        >
          <button
            type="button"
            onClick={dismissChip}
            aria-label="Dismiss"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-200"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="animate-sparkle inline-block" aria-hidden="true">✦</span>
            My AI assistant knows my work
          </p>
          <p className="mt-1 text-xs text-neutral-400">Trained on my portfolio — answers with sources.</p>
          <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-white/10 bg-neutral-900" aria-hidden="true" />
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          trackEvent("AI_OPEN", { entityId: "fab" });
          dismissChip();
          router.push("/assistant");
        }}
        aria-label="Ask me about Haroun's work — AI assistant"
        className="animate-fab-enter group relative flex h-14 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
      >
        {/* pulsing halo — the "AI is alive" cue */}
        <span className="animate-halo pointer-events-none absolute inset-0 rounded-full bg-[var(--brand)]/50" aria-hidden="true" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="animate-sparkle relative">
          <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
        </svg>
        <span className="relative">Ask me</span>
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track";

const CHIP_KEY = "ai-fab-intro";
/** How long a dismissal keeps the chip away before it resurfaces. */
const RESURFACE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** Context-aware teaser — the chip speaks the language of the page it sits on. */
const CHIP_BY_SECTION: { match: (path: string) => boolean; title: string; sub: string }[] = [
  {
    match: (p) => p.startsWith("/projects"),
    title: "13 projects — ask me about any of them",
    sub: "AppliBtp, SoldX, Printaura… I answer with sources.",
  },
  {
    match: (p) => p.startsWith("/experience"),
    title: "14 years, 7 companies — ask me anything",
    sub: "From vb.NET POS to lead AI-era full stack.",
  },
  {
    match: (p) => p.startsWith("/engineering"),
    title: "Curious how any of this works?",
    sub: "I can explain the architecture behind each ADR.",
  },
  {
    match: (p) => p === "/",
    title: "My AI assistant knows my work",
    sub: "Trained on my portfolio — answers with sources.",
  },
];

function chipFor(pathname: string) {
  return CHIP_BY_SECTION.find((c) => c.match(pathname)) ?? CHIP_BY_SECTION[CHIP_BY_SECTION.length - 1];
}

function shouldShowChip(): boolean {
  try {
    const raw = localStorage.getItem(CHIP_KEY);
    if (!raw) return true;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return true;
    return Date.now() - dismissedAt > RESURFACE_AFTER_MS;
  } catch {
    return true;
  }
}

/**
 * Floating "Ask me" bubble — every public page except /assistant.
 * Attention strategy: spring entrance + pulsing halo + sparkle twinkle always;
 * a context-aware intro chip that resurfaces weekly after dismissal (never nags mid-session).
 */
export function AssistantFab() {
  const router = useRouter();
  const pathname = usePathname();
  const [chip, setChip] = useState(false);

  useEffect(() => {
    if (!shouldShowChip()) return;
    const t = setTimeout(() => setChip(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // re-evaluate per navigation so the chip text matches the page
  useEffect(() => {
    if (chip) return;
    if (!shouldShowChip()) return;
    const t = setTimeout(() => setChip(true), 1400);
    return () => clearTimeout(t);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (pathname === "/assistant") return null;

  function dismissChip() {
    setChip(false);
    try {
      localStorage.setItem(CHIP_KEY, String(Date.now()));
    } catch {
      /* private mode — chip simply reappears next visit */
    }
  }

  const chipContent = chipFor(pathname);

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
            {chipContent.title}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{chipContent.sub}</p>
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
        className="animate-fab-enter group relative flex h-14 items-center gap-2 overflow-hidden rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 shadow-xl shadow-black/30 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
      >
        {/* pulsing halo — the "AI is alive" cue */}
        <span className="animate-halo pointer-events-none absolute inset-0 rounded-full bg-[var(--brand)]/50" aria-hidden="true" />
        {/* periodic shine sweep — quiet attention without nagging */}
        <span className="animate-shine pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="animate-sparkle relative">
          <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
        </svg>
        <span className="relative">Ask me</span>
      </button>
    </div>
  );
}

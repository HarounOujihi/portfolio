"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/track";

const MODES = [
  { key: "GENERAL", label: "General" },
  { key: "RECRUITER", label: "Recruiter" },
  { key: "ENGINEERING", label: "Engineering" },
] as const;

type Mode = (typeof MODES)[number]["key"];

interface Msg {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

const SID_KEY = "portfolio.assistant.sid";

function currentSessionId(): string {
  let id = localStorage.getItem(SID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SID_KEY, id);
  }
  return id;
}

/** Chat body — session, mode, sources; custom fetch (no SDK dependency). */
export function ChatPanel() {
  const [mode, setMode] = useState<Mode>("GENERAL");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sidRef = useRef<string>("");

  function sessionId(): string {
    if (!sidRef.current) sidRef.current = currentSessionId();
    return sidRef.current;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("prompt") as HTMLInputElement | null;
    const text = input?.value.trim();
    if (!text || busy) return;
    if (input) input.value = "";

    trackEvent("AI_QUESTION", { entityType: "mode", entityId: mode });
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: "…" }]);
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          sessionId: sessionId(),
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = (await res.json()) as { answer?: string; error?: string; sources?: string[] };
      const answer = data.answer ?? data.error ?? "Something went wrong — please try again.";
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", text: answer, sources: data.sources }]);
    } catch {
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", text: "Connection issue — please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mode switcher */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            aria-pressed={mode === m.key}
            className={`flex h-9 items-center rounded-full px-4 text-xs font-medium transition-colors ${
              mode === m.key
                ? "bg-white text-neutral-950"
                : "border border-white/20 text-neutral-400 hover:border-white/50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-neutral-400">
            <p className="font-medium text-neutral-200">Ask me about my work.</p>
            <p className="mt-2">
              Try: &ldquo;Which ERP systems have you built?&rdquo;, &ldquo;What AI has he shipped in
              production?&rdquo;, &ldquo;Tell me about your React Native work.&rdquo; — every answer cites its sources.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--brand)] text-neutral-950"
                  : "border border-white/10 bg-white/[0.04] text-neutral-200"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.sources.map((src) => (
                    <a
                      key={src}
                      href={src}
                      className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-neutral-300 hover:border-white/50"
                    >
                      {src.replace("/projects/", "").replace("/experience", "experience")} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <p className="text-sm text-neutral-500" role="status">
            Thinking…
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Composer — 44px input row */}
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 p-4">
        <input
          name="prompt"
          className="h-11 flex-1 rounded-full border border-white/20 bg-white/[0.04] px-4 text-sm outline-none focus:border-[var(--brand)] placeholder:text-neutral-500"
          placeholder="Ask me anything…"
          maxLength={4000}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

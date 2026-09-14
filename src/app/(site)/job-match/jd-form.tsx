"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const area =
  "w-full rounded-3xl border border-white/20 bg-white/[0.04] p-5 text-sm leading-relaxed outline-none focus:border-[var(--brand)] placeholder:text-neutral-400";

export function JobMatchForm() {
  const router = useRouter();
  const [jd, setJd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "running">("idle");

  const tooShort = jd.length > 0 && jd.length < 80;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "running") return;
    setError(null);
    setPhase("running");

    const sessionId = (() => {
      const key = "portfolio.sid";
      let id = localStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
      }
      return id;
    })();

    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, sessionId }),
      });
      const data = (await res.json()) as { slug?: string; error?: string };
      if (!res.ok || !data.slug) {
        setError(data.error ?? "Analysis failed — please try again.");
        setPhase("idle");
        return;
      }
      router.push(`/job-match/${data.slug}`);
    } catch {
      setError("Connection issue — please try again.");
      setPhase("idle");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={14}
        maxLength={8000}
        required
        placeholder="Paste the full job description here — responsibilities, requirements, nice-to-haves… (min 80 characters)"
        className={area}
      />
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={tooShort ? "text-amber-400" : "text-neutral-400"}>
          {jd.length} / 8000 characters {tooShort && "— a bit short for a real analysis"}
        </span>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={phase === "running" || jd.trim().length < 80}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-white font-semibold text-neutral-950 transition-transform hover:-translate-y-0.5 disabled:opacity-40 sm:w-auto sm:px-12"
      >
        {phase === "running" ? (
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 animate-ping rounded-full bg-neutral-950 opacity-60" />
            Analyzing against real projects…
          </span>
        ) : (
          "Analyze fit →"
        )}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";

export interface AchievementRow {
  title: string;
  description: string;
  metric: string;
}

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";

/** Achievements repeater — name-aligned arrays (ach-title / ach-desc / ach-metric). */
export function AchievementsRepeater({ initial }: { initial: AchievementRow[] }) {
  const [items, setItems] = useState<AchievementRow[]>(
    initial.length ? initial : [{ title: "", description: "", metric: "" }]
  );

  return (
    <section className="rounded-3xl border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Achievements</h2>
        <button
          type="button"
          onClick={() => setItems((v) => [...v, { title: "", description: "", metric: "" }])}
          className="h-9 rounded-full border border-white/20 px-4 text-xs font-medium hover:border-white/50"
        >
          + Add
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {items.map((a, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input name="ach-title" value={a.title} onChange={(e) => setItems((v) => v.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} placeholder="Achievement title" className={`${input} flex-1`} />
              <button type="button" onClick={() => setItems((v) => v.filter((_, j) => j !== i))} className="h-9 w-9 shrink-0 rounded-full border border-red-400/40 text-red-300" aria-label="Remove achievement">✕</button>
            </div>
            <textarea name="ach-desc" value={a.description} onChange={(e) => setItems((v) => v.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} placeholder="Description" rows={2} className={`${area} mt-2`} />
            <input name="ach-metric" value={a.metric} onChange={(e) => setItems((v) => v.map((x, j) => (j === i ? { ...x, metric: e.target.value } : x)))} placeholder="Metric (optional)" className={`${input} mt-2`} />
          </div>
        ))}
      </div>
    </section>
  );
}

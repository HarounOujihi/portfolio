"use client";

import { moveStat, saveStat, deleteStat } from "./actions";

export interface StatRow {
  id: string;
  value: string;
  label: string;
}

const input = "h-11 rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const btn = "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-neutral-300 hover:border-white/50";

export function StatsEditor({ rows }: { rows: StatRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((s, i) => (
        <div key={s.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <form action={moveStat}>
            <input type="hidden" name="id" value={s.id} />
            <button name="dir" value="up" disabled={i === 0} className={btn} aria-label={`Move ${s.value} up`}>
              ↑
            </button>
          </form>
          <form action={moveStat}>
            <input type="hidden" name="id" value={s.id} />
            <button name="dir" value="down" disabled={i === rows.length - 1} className={btn} aria-label={`Move ${s.value} down`}>
              ↓
            </button>
          </form>
          <form action={saveStat} className="flex flex-1 flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={s.id} />
            <input name="value" defaultValue={s.value} required maxLength={12} className={`${input} w-24`} aria-label="Value" />
            <input name="label" defaultValue={s.label} required maxLength={80} className={`${input} min-w-48 flex-1`} aria-label="Label" />
            <button type="submit" className="h-9 rounded-full bg-white px-5 text-sm font-semibold text-neutral-950">
              Save
            </button>
          </form>
          <form action={deleteStat}>
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className={btn} aria-label={`Delete ${s.value}`}>
              ✕
            </button>
          </form>
        </div>
      ))}

      <form action={saveStat} className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/20 p-3">
        <input name="value" required maxLength={12} placeholder="Value" className={`${input} w-24`} aria-label="New stat value" />
        <input name="label" required maxLength={80} placeholder="Label — what it measures" className={`${input} min-w-48 flex-1`} aria-label="New stat label" />
        <button type="submit" className="h-9 rounded-full bg-white px-5 text-sm font-semibold text-neutral-950">
          Add stat
        </button>
      </form>
    </div>
  );
}

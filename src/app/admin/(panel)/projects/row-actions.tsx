"use client";

import { moveProject, deleteProject, toggleProject } from "./actions";

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-neutral-300 hover:border-white/50 disabled:opacity-30";

export function ProjectOrderButtons({ id, index, total }: { id: string; index: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      <form action={moveProject}>
        <input type="hidden" name="id" value={id} />
        <button name="dir" value="up" disabled={index === 0} className={iconBtn} aria-label="Move up">
          ↑
        </button>
      </form>
      <form action={moveProject}>
        <input type="hidden" name="id" value={id} />
        <button name="dir" value="down" disabled={index === total - 1} className={iconBtn} aria-label="Move down">
          ↓
        </button>
      </form>
    </div>
  );
}

export function ProjectToggle({
  id,
  field,
  value,
  label,
}: {
  id: string;
  field: "published" | "featured";
  value: boolean;
  label: string;
}) {
  return (
    <form action={toggleProject}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <button
        type="submit"
        aria-pressed={value}
        aria-label={`${label}: ${value ? "on" : "off"} — click to toggle`}
        className={`h-9 rounded-full px-4 text-xs font-semibold transition-colors ${
          value ? "bg-white text-neutral-950" : "border border-white/20 text-neutral-400"
        }`}
      >
        {label}
      </button>
    </form>
  );
}

export function ProjectDeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/40 text-sm text-red-300 hover:border-red-400"
        aria-label={`Delete ${name}`}
      >
        ✕
      </button>
    </form>
  );
}

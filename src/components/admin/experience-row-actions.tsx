"use client";

import { moveExperience, deleteExperience } from "@/app/admin/(panel)/experience/actions";

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-neutral-300 hover:border-white/50 disabled:opacity-30";

export function ExperienceRowButtons({
  id,
  index,
  total,
  name,
}: {
  id: string;
  index: number;
  total: number;
  name: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <form action={moveExperience}>
        <input type="hidden" name="id" value={id} />
        <button name="dir" value="up" disabled={index === 0} className={iconBtn} aria-label={`Move ${name} up`}>
          ↑
        </button>
      </form>
      <form action={moveExperience}>
        <input type="hidden" name="id" value={id} />
        <button name="dir" value="down" disabled={index === total - 1} className={iconBtn} aria-label={`Move ${name} down`}>
          ↓
        </button>
      </form>
      <form
        action={deleteExperience}
        onSubmit={(e) => {
          if (!window.confirm(`Delete ${name}? This cannot be undone.`)) e.preventDefault();
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
    </div>
  );
}

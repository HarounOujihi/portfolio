"use client";

import { moveResource, deleteResource } from "@/app/admin/(panel)/manage/[resource]/actions";

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm text-neutral-300 hover:border-white/50 disabled:opacity-30";

export function ResourceRowButtons({
  resource,
  id,
  index,
  total,
  hasOrder,
  title,
}: {
  resource: string;
  id: string;
  index: number;
  total: number;
  hasOrder: boolean;
  title: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {hasOrder && (
        <>
          <form action={moveResource}>
            <input type="hidden" name="resource" value={resource} />
            <input type="hidden" name="id" value={id} />
            <button name="dir" value="up" disabled={index === 0} className={iconBtn} aria-label={`Move ${title} up`}>
              ↑
            </button>
          </form>
          <form action={moveResource}>
            <input type="hidden" name="resource" value={resource} />
            <input type="hidden" name="id" value={id} />
            <button name="dir" value="down" disabled={index === total - 1} className={iconBtn} aria-label={`Move ${title} down`}>
              ↓
            </button>
          </form>
        </>
      )}
      <form
        action={deleteResource}
        onSubmit={(e) => {
          if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) e.preventDefault();
        }}
      >
        <input type="hidden" name="resource" value={resource} />
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/40 text-sm text-red-300 hover:border-red-400"
          aria-label={`Delete ${title}`}
        >
          ✕
        </button>
      </form>
    </div>
  );
}

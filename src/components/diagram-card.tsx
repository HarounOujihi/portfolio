"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Diagram in a card with tap-to-expand lightbox (design-system §4: legible at
 * 360px via lightbox; keyboard + Esc handled by Dialog). Base UI registry —
 * controlled Dialog with plain trigger buttons.
 */
export function DiagramCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-(--radius-organic) border border-white/15 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">{title}</h3>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 shrink-0 items-center rounded-full border border-white/20 px-3 text-xs font-medium text-neutral-200 hover:border-neutral-600"
          aria-label={`Expand diagram: ${title}`}
        >
          Expand
        </button>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 block w-full cursor-zoom-in text-left"
        aria-label={`Expand diagram: ${title}`}
      >
        {children}
      </button>

      {open && (
        <Dialog open onOpenChange={(o) => !o && setOpen(false)}>
          <DialogContent className="max-w-4xl">
            <DialogTitle className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
              {title} — simplified view
            </DialogTitle>
            <div className="mt-2">{children}</div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

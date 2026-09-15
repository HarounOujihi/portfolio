"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export interface LightboxItem {
  url: string;
  alt: string;
  caption?: string | null;
}

const ZOOM_STEPS = [1, 1.5, 2, 3, 4];

const ctrl =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-base text-white hover:bg-black/80";

/**
 * Full-screen lightbox (web + mobile): zoom in/out/reset with real pan
 * (overflow-auto + width-%, no flex-centering clipping), prev/next,
 * keyboard arrows. Dialog overrides shadcn's centering clamp via CSS vars.
 */
export function MediaLightbox({
  items,
  index,
  onIndexChange,
  onOpenChange,
  open,
}: {
  items: LightboxItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  // zoom tracked per image index — navigating resets it without effects
  const [zoomByKey, setZoomByKey] = useState<Record<number, number>>({});
  const zoom = zoomByKey[index] ?? 1;
  const item = items[index];

  // keyboard arrows for prev/next while open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") onIndexChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onIndexChange]);

  function setZoom(z: number) {
    setZoomByKey({ [index]: Math.max(1, Math.min(4, z)) });
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex h-dvh w-dvw translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-neutral-950 p-0 sm:max-w-none">
        <DialogTitle className="sr-only">{item.alt}</DialogTitle>

        {/* toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <p className="truncate text-sm text-neutral-300">{item.caption ?? item.alt}</p>
          <div className="flex items-center gap-1.5">
            <span className="mr-1 w-12 text-center text-xs text-neutral-400">{Math.round(zoom * 100)}%</span>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom(Math.max(1, zoom - 0.5))} className={ctrl}>
              −
            </button>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom(Math.min(4, zoom + 0.5))} className={ctrl}>
              +
            </button>
            <button type="button" aria-label="Reset zoom" onClick={() => setZoom(1)} className={ctrl + " px-3 text-xs"}>
              Reset
            </button>
            <button type="button" aria-label="Close" onClick={() => onOpenChange(false)} className={ctrl}>
              ✕
            </button>
          </div>
        </div>

        {/* viewport — block layout: auto margins center at fit, scroll pans when zoomed */}
        <div className="relative flex-1 overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.alt}
            className="mx-auto block"
            style={{
              width: `${Math.round(zoom * 100)}%`,
              maxWidth: "none",
              height: "auto",
            }}
          />

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
                className="fixed left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/60 text-xl text-white hover:bg-black/80"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => onIndexChange((index + 1) % items.length)}
                className="fixed right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/60 text-xl text-white hover:bg-black/80"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* caption + counter */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-neutral-950/90 px-4 py-2.5">
          <p className="truncate text-xs text-neutral-300">{item.caption ?? item.alt}</p>
          <p className="absolute right-4 top-2.5 text-xs text-neutral-500">
            {index + 1} / {items.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Thumbnail grid — each thumb opens the lightbox at its index. */
export function MediaGalleryGrid({ items, aspect = "aspect-[16/10]" }: { items: LightboxItem[]; aspect?: string }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <button
            key={item.url + i}
            type="button"
            onClick={() => {
              setCurrent(i);
              setOpen(true);
            }}
            aria-label={`Open image: ${item.alt}`}
            className="group block w-full cursor-zoom-in overflow-hidden rounded-3xl border border-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
              className={`${aspect} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
            />
            {item.caption && <p className="mt-2 text-xs text-neutral-500">{item.caption}</p>}
          </button>
        ))}
      </div>

      <MediaLightbox items={items} index={current} onIndexChange={setCurrent} open={open} onOpenChange={setOpen} />
    </div>
  );
}

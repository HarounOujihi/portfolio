"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface LightboxItem {
  url: string;
  alt: string;
  caption?: string | null;
}

const ZOOM_STEPS = [1, 1.5, 2.5, 4];

/**
 * Full lightbox: big centered image on desktop, full-screen on mobile,
 * zoom in/out/reset buttons, scroll-to-pan when zoomed, prev/next,
 * keyboard (Esc close, arrows navigate).
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
  const [zoom, setZoom] = useState(1);
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

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100dvh] w-screen max-w-none rounded-none border-0 bg-neutral-950/95 p-0 sm:h-[92dvh] sm:rounded-3xl sm:border-white/10">
        <DialogTitle className="sr-only">{item.alt}</DialogTitle>

        {/* toolbar */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-lg text-white hover:bg-black/70"
          >
            −
          </button>
          <span className="w-12 text-center text-xs text-neutral-300">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-lg text-white hover:bg-black/70"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Reset zoom"
            onClick={() => setZoom(1)}
            className="hidden h-10 items-center justify-center rounded-full border border-white/25 bg-black/50 px-3 text-xs text-white hover:bg-black/70 sm:flex"
          >
            Reset
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white hover:bg-black/70"
          >
            ✕
          </button>
        </div>

        {/* image viewport — overflow-auto gives free pan when zoomed */}
        <div className="flex h-full max-h-[calc(100dvh-5rem)] w-full items-center justify-center overflow-auto p-3 sm:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.alt}
            style={{ width: `${zoom * 100}%`, maxWidth: zoom === 1 ? "100%" : "none" }}
            className="h-auto object-contain transition-[width] duration-200"
          />
        </div>

        {/* caption + counter */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10">
          <p className="truncate text-xs text-neutral-300">{item.caption ?? item.alt}</p>
          <p className="shrink-0 text-xs text-neutral-400">
            {index + 1} / {items.length}
          </p>
        </div>

        {/* prev / next */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white hover:bg-black/70"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => onIndexChange((index + 1) % items.length)}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}
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

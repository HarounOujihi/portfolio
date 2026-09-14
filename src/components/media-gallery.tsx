"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
}

/**
 * Screenshot gallery with lightbox — Base UI Dialog (controlled, no asChild in
 * this registry). Mobile-tappable; keyboard/Esc handled by Dialog.
 */
export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState<MediaItem | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => setActive(item)}
            className="group block w-full cursor-zoom-in text-left"
            aria-label={`Expand screenshot: ${item.caption ?? item.alt}`}
          >
            <div className="relative overflow-hidden rounded-(--radius-card) border border-white/15">
              <Image
                src={item.url}
                alt={item.alt}
                width={760}
                height={560}
                sizes="(min-width: 640px) 45vw, 90vw"
                className="h-auto w-full transition-transform group-hover:scale-[1.02]"
              />
            </div>
            {item.caption && <p className="mt-2 text-xs text-neutral-400">{item.caption}</p>}
          </button>

          {active?.id === item.id && (
            <Dialog open onOpenChange={(o) => !o && setActive(null)}>
              <DialogContent className="max-w-5xl">
                <DialogTitle className="text-sm font-medium text-neutral-400">
                  {item.caption ?? item.alt}
                </DialogTitle>
                <div className="mt-2 max-h-[75vh] overflow-auto rounded-(--radius-card) border border-white/15">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={1400}
                    height={1000}
                    sizes="90vw"
                    className="h-auto w-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ))}
    </div>
  );
}

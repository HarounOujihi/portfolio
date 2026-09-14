"use client";

import { useRef, useState } from "react";
import { addProjectMedia, deleteProjectMedia } from "@/app/admin/(panel)/projects/actions";

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
}

const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";
const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";

/** Project images — supports BOTH pasted links and file uploads (Vercel Blob). */
export function ProjectMediaEditor({
  projectId,
  media,
}: {
  projectId: string;
  media: MediaItem[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file");
    const file = fileInput instanceof HTMLInputElement && fileInput.files?.[0] ? fileInput.files[0] : null;
    const urlEl = form.elements.namedItem("url");
    const pastedUrl = urlEl instanceof HTMLInputElement ? urlEl.value.trim() : "";

    let finalUrl = pastedUrl;

    if (file) {
      setUploading(true);
      const up = new FormData();
      up.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: up });
      setUploading(false);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Upload failed.");
        return;
      }
      const body = (await res.json()) as { url: string };
      finalUrl = body.url;
    }

    if (!finalUrl) {
      setError("Paste an image link or choose a file.");
      return;
    }

    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("url", finalUrl);
    fd.set("alt", `Screenshot — ${finalUrl.split("/").pop() ?? "image"}`);
    await addProjectMedia(fd);

    if (urlEl instanceof HTMLInputElement) urlEl.value = "";
    if (fileInput instanceof HTMLInputElement) fileInput.value = "";
    formRef.current?.reset();
  }

  return (
    <div>
      {media.length > 0 && (
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt} className="h-28 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                <p className="truncate text-xs text-neutral-400">{m.caption ?? m.alt}</p>
                <form action={deleteProjectMedia}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/40 text-xs text-red-300 hover:border-red-400"
                    aria-label={`Delete image ${m.alt}`}
                  >
                    ✕
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={onAdd} className="rounded-2xl border border-dashed border-white/20 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="m-file">Upload image (Vercel Blob)</label>
            <input id="m-file" name="file" type="file" accept="image/*" className="w-full text-sm text-neutral-400" />
          </div>
          <div>
            <label className={label} htmlFor="m-url">…or paste image link</label>
            <input id="m-url" name="url" type="url" placeholder="https://…" className={input} />
          </div>
        </div>
        <div className="mt-3">
          <label className={label} htmlFor="m-caption">Caption (optional)</label>
          <input id="m-caption" name="caption" maxLength={200} className={input} />
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="mt-4 h-11 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Add image"}
        </button>
      </form>
    </div>
  );
}

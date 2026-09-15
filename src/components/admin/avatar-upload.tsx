"use client";

import { useRef, useState } from "react";

const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";
const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";

/**
 * Avatar upload field for the profile form — uploads the image to Vercel Blob
 * and fills the hidden avatarUrl input, which Save persists. Renders a live
 * preview of the current/just-uploaded image. Falls back to manual path entry.
 */
export function AvatarUpload({ currentUrl }: { currentUrl: string | null }) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Opens the OS file picker — the button is only the trigger. */
  function openPicker() {
    setError(null);
    fileRef.current?.click();
  }

  async function onFileChosen(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", "image");
    // Abort after 30s — a hung storage upload must not freeze the button forever.
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 30_000);
    let res: Response;
    try {
      res = await fetch("/api/admin/upload", { method: "POST", body: fd, signal: ctl.signal });
    } catch {
      setUploading(false);
      setError("Upload timed out or storage is unreachable.");
      return;
    } finally {
      clearTimeout(timer);
    }
    setUploading(false);
    setUploading(false);
    const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!res.ok || !body?.url) {
      setError(body?.error ?? "Upload failed.");
      return;
    }
    setUrl(body.url);
  }

  function onRemove() {
    setUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label className={label} htmlFor="avatarUrl">Avatar</label>
      <div className="flex items-center gap-4">
        {/* live preview — updates the moment an upload lands */}
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Avatar preview"
            className="h-16 w-16 shrink-0 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 text-xs text-neutral-500" aria-hidden="true">
            none
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void onFileChosen(e.target.files?.[0])}
              aria-label="Choose avatar image"
            />
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="h-11 rounded-full border border-white/20 px-5 text-sm text-neutral-200 hover:border-white/50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {url && (
              <button
                type="button"
                onClick={onRemove}
                className="h-11 rounded-full px-4 text-sm text-neutral-400 hover:text-neutral-200"
              >
                Remove
              </button>
            )}
          </div>
          <input
            id="avatarUrl"
            name="avatarUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className={`${input} mt-2 w-full text-xs text-neutral-400`}
            aria-label="Avatar URL"
          />
          {error && (
            <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

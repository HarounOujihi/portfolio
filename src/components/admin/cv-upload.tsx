"use client";

import { useRef, useState } from "react";

const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";
const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";

/**
 * CV upload field for the profile form — uploads the PDF to Vercel Blob and
 * fills the hidden cvUrl input, which Save persists. Falls back to manual
 * path entry when Blob storage isn't connected.
 */
export function CvUpload({ currentUrl }: { currentUrl: string }) {
  const [cvUrl, setCvUrl] = useState(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload() {
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("kind", "document");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!res.ok || !body?.url) {
      setError(body?.error ?? "Upload failed.");
      return;
    }
    setCvUrl(body.url);
    setUploadedName(file.name);
  }

  return (
    <div>
      <label className={label} htmlFor="cvUrl">CV file URL (auto-filled after upload)</label>
      <div className="flex flex-wrap items-center gap-2">
        <input id="cvUrl" name="cvUrl" required defaultValue={cvUrl} className={`${input} min-w-48 flex-1`} />
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={() => setError(null)}
          aria-label="Choose CV PDF file"
        />
        <button
          type="button"
          onClick={onUpload}
          disabled={uploading}
          className="h-11 rounded-full border border-white/20 px-5 text-sm text-neutral-200 hover:border-white/50 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload new PDF"}
        </button>
      </div>
      {uploadedName && (
        <p className="mt-1.5 text-xs text-neutral-400">
          Uploaded “{uploadedName}” — press Save profile to make it live.
        </p>
      )}
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}

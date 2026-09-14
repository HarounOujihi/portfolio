"use client";

import { useState } from "react";

export function CopyReportButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // clipboard unavailable — ignore
        }
      }}
      className="rounded-full border border-white/20 px-4 py-1.5 hover:border-white/50"
    >
      {copied ? "Link copied ✓" : "Copy link"}
    </button>
  );
}

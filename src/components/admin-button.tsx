"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
    </svg>
  );
}

/**
 * Administration shortcut — renders only when a valid admin session exists.
 * Probes /api/admin/session on mount; visitors get nothing (not even the button).
 * Desktop: compact pill in the header actions. Mobile: hidden (the desktop pill
 * still works once the header switches at md:; menu integration skipped for simplicity).
 */
export function AdminButton() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.admin) setAdmin(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!admin) return null;

  return (
    <Link
      href="/admin"
      className="hidden h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-neutral-200 transition-colors hover:border-[var(--brand)] hover:text-neutral-100 sm:flex"
    >
      <ShieldIcon />
      Admin
    </Link>
  );
}

/** Mobile-menu variant — full-width row inside the sheet. */
export function AdminMenuButton() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.admin) setAdmin(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!admin) return null;

  return (
    <Link
      href="/admin"
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 font-medium text-neutral-100"
    >
      <ShieldIcon />
      Administration
    </Link>
  );
}

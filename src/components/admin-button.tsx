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

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1.5 text-[11px] font-bold leading-none text-neutral-950">
      {count}
    </span>
  );
}

function useAdminSession() {
  const [state, setState] = useState<{ admin: boolean; unread: number }>({ admin: false, unread: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.admin) setState({ admin: true, unread: d.unread ?? 0 });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Administration shortcut — desktop header pill (with unread badge). */
export function AdminButton() {
  const { admin, unread } = useAdminSession();
  if (!admin) return null;

  return (
    <Link
      href="/admin/conversations"
      className="hidden h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-neutral-200 transition-colors hover:border-[var(--brand)] hover:text-neutral-100 sm:flex"
    >
      <ShieldIcon />
      Admin
      <Badge count={unread} />
    </Link>
  );
}

/** Administration shortcut — mobile menu row (with unread badge). */
export function AdminMenuButton() {
  const { admin, unread } = useAdminSession();
  if (!admin) return null;

  return (
    <Link
      href="/admin/conversations"
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 font-medium text-neutral-100"
    >
      <ShieldIcon />
      Administration
      <Badge count={unread} />
    </Link>
  );
}

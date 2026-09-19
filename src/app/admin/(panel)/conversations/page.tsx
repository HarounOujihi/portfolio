import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { markAllConversationsRead } from "./actions";

export const dynamic = "force-dynamic";

/** Read-only conversation log (plan §4) — full questions and answers. */
export default async function AdminConversationsPage() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: "desc" },
    take: 50,
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  const unreadIds = new Set(
    (
      await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Conversation"
        WHERE "adminReadAt" IS NULL OR "lastMessageAt" > "adminReadAt"
      `
    ).map((r) => r.id),
  );
  const unreadCount = unreadIds.size;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
          <p className="mt-2 text-sm text-neutral-400">
            What visitors asked the assistant — the product signal. Anonymous (session-scoped), auto-purged
            after 180 days.
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllConversationsRead}>
            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
            >
              Mark all read
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-950 px-1.5 text-[11px] font-bold text-neutral-100">
                {unreadCount}
              </span>
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {conversations.length === 0 && <p className="text-sm text-neutral-400">No conversations yet.</p>}
        {conversations.map((c) => (
          <details key={c.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {unreadIds.has(c.id) && (
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--brand)] align-middle" aria-label="unread" />
                    )}
                    {c.mode.toLowerCase()} chat{" "}
                    <span className="font-normal text-neutral-400">
                      · {c.messages.length} messages · {(c.visitorHash ?? "—").slice(0, 10)}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-400">
                    {c.lastMessageAt.toLocaleString("en")} —{" "}
                    <span className="truncate">
                      first question:{" "}
                      {c.messages.find((m) => m.role === "USER")?.content.slice(0, 120) ?? "—"}
                    </span>
                  </p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-400">
                  expand
                </span>
              </div>
            </summary>
            <div className="mt-4 space-y-3">
              {c.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    m.role === "USER"
                      ? "bg-white/[0.06] text-neutral-100"
                      : "bg-transparent text-neutral-300"
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide text-neutral-400">{m.role}</p>
                  <p className="whitespace-pre-line">{m.content || "—"}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

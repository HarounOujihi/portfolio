import { prisma } from "@/lib/db";
import { markAllMessagesRead, setMessageStatus } from "./actions";

const STATUSES = ["NEW", "READ", "REPLIED", "SPAM"];

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const newCount = messages.filter((m) => m.status === "NEW").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Contact-form submissions. Visitor messages auto-purge after 90 days (Phase 11 cron).
          </p>
        </div>
        {newCount > 0 && (
          <form action={markAllMessagesRead}>
            <button
              type="submit"
              className="flex h-11 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90"
            >
              Mark all read
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-950 px-1.5 text-[11px] font-bold text-neutral-100">
                {newCount}
              </span>
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {messages.length === 0 && <p className="text-sm text-neutral-400">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">
                  {m.status === "NEW" && (
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--brand)] align-middle" aria-label="new" />
                  )}
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="text-sm font-normal text-neutral-400 hover:text-white">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-neutral-400">
                  {m.createdAt.toLocaleString("en")} · {m.status}
                </p>
              </div>
              <form action={setMessageStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={m.id} />
                <select
                  name="status"
                  defaultValue={m.status}
                  className="h-10 rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm"
                  aria-label={`Status for message from ${m.name}`}
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button type="submit" className="h-10 rounded-full border border-white/20 px-4 text-sm hover:border-white/50">
                  Set
                </button>
              </form>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium">{m.subject}</p>}
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-300">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

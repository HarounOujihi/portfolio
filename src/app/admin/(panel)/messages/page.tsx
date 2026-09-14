import { prisma } from "@/lib/db";
import { setMessageStatus } from "./actions";

const STATUSES = ["NEW", "READ", "REPLIED", "SPAM"];

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Contact-form submissions. Visitor messages auto-purge after 90 days (Phase 11 cron).
      </p>

      <div className="mt-8 space-y-4">
        {messages.length === 0 && <p className="text-sm text-neutral-400">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="text-sm font-normal text-neutral-400 hover:text-white">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-neutral-500">
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

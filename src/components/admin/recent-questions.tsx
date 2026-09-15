import Link from "next/link";
import { prisma } from "@/lib/db";

/** Recent AI questions — the direct product signal (what visitors asked). */
export async function RecentQuestionsSection() {
  const questions = await prisma.message.findMany({
    where: { role: "USER", conversation: { mode: { not: "JOB_MATCH" } } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { content: true, createdAt: true, conversation: { select: { mode: true } } },
  });

  if (questions.length === 0) return null;

  return (
    <section aria-labelledby="questions-h" className="mt-12">
      <h2 id="questions-h" className="text-xl font-semibold">
        Recent AI questions
      </h2>
      <ul className="mt-4 space-y-2">
        {questions.map((q, i) => (
          <li key={q.createdAt.toISOString() + String(i)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-neutral-200">
            <span className="mr-2 text-neutral-400">{q.conversation.mode.toLowerCase()}:</span>
            {q.content.slice(0, 160)}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-neutral-400">
        Full conversations:{" "}
        <Link href="/admin/conversations" className="underline hover:text-white">
          Conversations
        </Link>
      </p>
    </section>
  );
}

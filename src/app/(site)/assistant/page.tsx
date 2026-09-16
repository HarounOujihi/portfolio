import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ChatPanel } from "@/components/assistant/chat-panel";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ask me",
  description: "Ask me about my projects, experience and skills — every answer cites its sources.",
};

export default async function AssistantPage() {
  const profile = await prisma.profile.findUnique({ where: { id: "profile" }, select: { assistantEnabled: true } });
  if (profile && !profile.assistantEnabled) {
    return (
      <main className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col justify-center px-5 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h1 className="text-h2 font-bold tracking-tight">The assistant is taking a break</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
            The AI assistant is temporarily disabled. In the meantime, everything it knows is on the site —
            browse the case studies or the about page.
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col px-5 sm:px-8">
      <div className="pt-8">
        <h1 className="text-h2 font-bold tracking-tight">Ask me</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Grounded in my real projects and experience. Read-only — every answer cites its sources.
        </p>
      </div>
      <div className="mt-6 flex-1 overflow-hidden rounded-3xl border border-white/10">
        <ChatPanel />
      </div>
    </main>
  );
}

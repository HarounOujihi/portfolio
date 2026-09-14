import type { Metadata } from "next";
import { ChatPanel } from "@/components/assistant/chat-panel";

export const metadata: Metadata = {
  title: "Ask AI",
  description: "Ask an AI assistant about Haroun's projects, experience and skills — every answer cites its sources.",
};

export default function AssistantPage() {
  return (
    <main className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col px-5 sm:px-8">
      <div className="pt-8">
        <h1 className="text-h2 font-bold tracking-tight">Ask AI</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Grounded in his real projects and experience. Read-only — every answer cites its sources.
        </p>
      </div>
      <div className="mt-6 flex-1 overflow-hidden rounded-3xl border border-white/10">
        <ChatPanel />
      </div>
    </main>
  );
}

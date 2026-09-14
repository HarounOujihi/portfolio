import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Engineering",
  description: "Technical articles and architecture notes.",
};

export default async function EngineeringPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Engineering</h1>
      <p className="mt-2 text-lead text-neutral-400">
        Technical articles and architecture notes from real systems.
      </p>

      {articles.length === 0 ? (
        <div className="mt-12 rounded-(--radius-organic) border border-dashed border-white/20 p-10 text-center">
          <p className="font-medium">First articles are in drafting.</p>
          <p className="mt-2 text-sm text-neutral-400">
            Multi-tenant ERP data modeling and multi-model LLM routing are on the way.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="rounded-(--radius-card) border border-white/15 p-6">
              <h2 className="text-lg font-semibold">
                <a href={`/articles/${article.slug}`} className="hover:underline">
                  {article.title}
                </a>
              </h2>
              <p className="mt-2 text-sm text-neutral-400">{article.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/db";

interface Params {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string, allowPreview: boolean) {
  return prisma.article.findFirst({ where: { slug, ...(allowPreview ? {} : { published: true }) } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug, false);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const allowPreview = Boolean((await searchParams).preview) && Boolean(session);
  const article = await getArticle(slug, allowPreview);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
        <Link href="/engineering" className="hover:text-neutral-100 hover:underline">
          ← Engineering
        </Link>
      </nav>
      <header className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{article.articleType}</p>
        <h1 className="mt-2 text-h2 font-bold tracking-tight">{article.title}</h1>
        <p className="mt-3 text-lead text-neutral-400">{article.excerpt}</p>
        {article.publishedAt && (
          <p className="mt-3 text-sm text-neutral-400">
            {article.publishedAt.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </header>

      {/* D-P3-2: react-markdown + typography prose; GFM tables/strike-through supported */}
      <article className="prose prose-neutral prose-invert mt-10 max-w-none prose-headings:tracking-tight prose-a:text-[var(--brand)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </article>
    </main>
  );
}
export const dynamic = "force-dynamic";

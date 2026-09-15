import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { HomeView } from "./home-view";

export const metadata: Metadata = {
  title: { absolute: "Haroun Oujihi — Lead Full Stack Engineer" },
  description:
    "Multi-tenant SaaS and ERP platforms with applied AI/LLM integration in production. 10+ years shipping end to end. Open to remote, hybrid and on-site roles.",
  openGraph: {
    title: { absolute: "Haroun Oujihi — Lead Full Stack Engineer" },
    description: "SaaS/ERP platforms with applied AI in production — case studies, architecture and an AI assistant that knows the work.",
  },
};

export default async function HomePage() {
  const [profile, projects, tech] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: {
        technologies: { include: { technology: true } },
        media: { orderBy: { createdAt: "asc" }, take: 1 },
      },
    }),
    prisma.technology.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true } }),
  ]);

  if (!profile) {
    return (
      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="pt-24 text-lead text-neutral-400">No profile seeded yet — run `pnpm db:seed`.</p>
      </main>
    );
  }

  const work = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    kind: p.industry,
    blurb: p.shortDescription,
    tags: p.technologies.map((pt) => pt.technology.name).slice(0, 3),
    // Real screenshot where it exists (BitMal, Sunchine); picsum placeholder
    // elsewhere until the owner supplies final ones (P0.T2).
    img:
      p.media[0]?.url ??
      `https://picsum.photos/seed/${p.slug}-demo/900/700`,
    big: p.featured,
  }));

  // Owner-editable via /admin/stats (P4 — "Signals have wrong numbers" fix)
  const stats = await prisma.stat.findMany({
    orderBy: { sortOrder: "asc" },
    select: { value: true, label: true },
  });

  const pipeline = ["Document in", "OCR + extraction", "LLM structuring", "Validation", "PO match"];

  return (
    <HomeView
      profile={{
        fullName: profile.fullName,
        headline: profile.headline,
        shortBio: profile.shortBio,
        availability: profile.availability ?? "Open to opportunities",
        email: profile.email,
        avatarUrl: profile.avatarUrl ?? "/me.jpg",
      }}
      tech={tech.map((t) => t.name)}
      work={work}
      stats={stats}
      pipeline={pipeline}
    />
  );
}
export const dynamic = "force-dynamic";

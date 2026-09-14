import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/db";

/** Content export (P4.T13) — JSON download of every content table. Admin-only. */
export async function GET() {
  await requireAdmin();

  const [profile, experiences, projects, technologies, skills, education, certifications, articles, stats, contactMessages] =
    await Promise.all([
      prisma.profile.findMany(),
      prisma.experience.findMany({ include: { achievements: true } }),
      prisma.project.findMany({
        include: {
          challenges: true,
          solutions: true,
          outcomes: true,
          technologies: { include: { technology: true } },
          media: true,
          externalLinks: true,
        },
      }),
      prisma.technology.findMany(),
      prisma.skill.findMany(),
      prisma.education.findMany(),
      prisma.certification.findMany(),
      prisma.article.findMany(),
      prisma.stat.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.contactMessage.findMany(),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile,
    experiences,
    projects,
    technologies,
    skills,
    education,
    certifications,
    articles,
    stats,
    contactMessages,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}

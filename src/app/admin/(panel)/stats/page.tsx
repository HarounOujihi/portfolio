import { prisma } from "@/lib/db";
import { StatsEditor } from "./stats-editor";

export default async function StatsAdminPage() {
  const stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Signals — home stats</h1>
      <p className="mt-2 text-sm text-neutral-400">
        These render in the &quot;Signals&quot; section of the home page, in this order. Changes go
        live immediately.
      </p>
      <div className="mt-8">
        <StatsEditor rows={stats} />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceSpec } from "@/lib/admin-resource-configs";
import { getResourceModel } from "@/lib/admin-resource-models";
import { ResourceRowButtons } from "@/components/admin/resource-row-bits";

type Delegate = {
  findMany(args: { orderBy?: readonly Record<string, "asc" | "desc">[] }): Promise<Array<Record<string, unknown>>>;
};

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const spec = getResourceSpec(resource);
  if (!spec) notFound();
  const model = getResourceModel(resource);
  if (!model) notFound();

  const rows = await (model.delegate as unknown as Delegate).findMany({ orderBy: model.orderBy });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{spec.label}</h1>
        <Link
          href={`/admin/manage/${resource}/new`}
          className="flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-950"
        >
          + New
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 && <p className="text-sm text-neutral-400">Nothing here yet.</p>}
        {rows.map((row, i) => {
          const id = String(row.id);
          const title = String(row[spec.titleField] ?? "—");
          return (
            <div key={id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <ResourceRowButtons
                resource={resource}
                id={id}
                index={i}
                total={rows.length}
                hasOrder={spec.hasOrder}
                title={title}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{title}</p>
                {resource === "articles" && (
                  <p className="text-xs text-neutral-500">
                    {row.published ? "published" : "draft"}
                    {row.publishedAt ? ` · ${new Date(String(row.publishedAt)).toLocaleDateString("en")}` : ""}
                  </p>
                )}
                {resource === "skills" && "level" in row && (
                  <p className="text-xs text-neutral-500">{String(row.level)}</p>
                )}
                {resource === "technologies" && "category" in row && (
                  <p className="text-xs text-neutral-500">{String(row.category)}</p>
                )}
              </div>
              <Link
                href={`/admin/manage/${resource}/${id}`}
                className="flex h-9 items-center rounded-full border border-white/20 px-4 text-sm text-neutral-200 hover:border-white/50"
              >
                Edit
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

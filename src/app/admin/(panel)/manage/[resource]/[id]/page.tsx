import { notFound } from "next/navigation";
import Link from "next/link";
import { getResourceSpec } from "@/lib/admin-resource-configs";
import { getResourceModel } from "@/lib/admin-resource-models";
import { saveResource } from "../actions";
import { ResourceForm } from "@/components/admin/resource-form";

type Delegate = {
  findUnique(args: { where: { id: string } }): Promise<Record<string, unknown> | null>;
};

export default async function EditResourcePage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const spec = getResourceSpec(resource);
  const model = getResourceModel(resource);
  if (!spec || !model) notFound();

  const row = await (model.delegate as unknown as Delegate).findUnique({ where: { id } });
  if (!row) notFound();

  const initial: Record<string, string | boolean> = {};
  for (const f of spec.fields) {
    const v = f.name in row ? row[f.name] : null;
    if (f.type === "checkbox") initial[f.name] = Boolean(v);
    else if (f.type === "date" && v instanceof Date) initial[f.name] = v.toISOString().slice(0, 10);
    else initial[f.name] = v == null ? "" : String(v);
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href={`/admin/manage/${resource}`} className="hover:text-white">← {spec.label}</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit — {String(row[spec.titleField] ?? "")}</h1>
      <div className="mt-8">
        <ResourceForm resource={resource} spec={spec} initial={initial} saveAction={saveResource.bind(null, resource)} id={id} />
      </div>
    </div>
  );
}

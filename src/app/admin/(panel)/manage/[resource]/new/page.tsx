import { notFound } from "next/navigation";
import { getResourceSpec } from "@/lib/admin-resource-configs";
import Link from "next/link";
import { saveResource } from "../actions";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const spec = getResourceSpec(resource);
  if (!spec) notFound();

  const initial: Record<string, string | boolean> = {};
  for (const f of spec.fields) initial[f.name] = f.type === "checkbox" ? false : f.type === "select" ? (f.options?.[0] ?? "") : "";

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <Link href={`/admin/manage/${resource}`} className="hover:text-white">← {spec.label}</Link>
      </nav>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">New — {spec.label}</h1>
      <div className="mt-8">
        <ResourceForm resource={resource} spec={spec} initial={initial} saveAction={saveResource.bind(null, resource)} />
      </div>
    </div>
  );
}

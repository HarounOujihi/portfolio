"use client";

import type { FieldSpec, ResourceSpec } from "@/lib/admin-resource-configs";

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";

export function ResourceForm({
  resource,
  spec,
  initial,
  saveAction,
  id,
}: {
  resource: string;
  spec: ResourceSpec;
  initial: Record<string, string | boolean>;
  saveAction: (formData: FormData) => Promise<void>;
  id?: string;
}) {
  return (
    <form action={saveAction} className="space-y-5">
      <input type="hidden" name="resource" value={resource} />
      {id && <input type="hidden" name="id" value={id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {spec.fields.map((f: FieldSpec) => {
          const value = initial[f.name];
          const cls = `${input} ${f.half ? "" : "sm:col-span-2"}`;
          switch (f.type) {
            case "textarea":
              return (
                <div key={f.name} className="sm:col-span-2">
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                  <textarea id={`f-${f.name}`} name={f.name} rows={3} required={f.required} maxLength={f.maxLength} defaultValue={String(value ?? "")} className={area} />
                </div>
              );
            case "bigtextarea":
              return (
                <div key={f.name} className="sm:col-span-2">
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                  <textarea id={`f-${f.name}`} name={f.name} rows={16} required={f.required} defaultValue={String(value ?? "")} className={`${area} font-mono text-[13px]`} />
                </div>
              );
            case "checkbox":
              return (
                <label key={f.name} className="flex items-center gap-2 pb-2 text-sm sm:col-span-1">
                  <input type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="h-4 w-4" />
                  {f.label}
                </label>
              );
            case "number":
              return (
                <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}</label>
                  <input id={`f-${f.name}`} name={f.name} type="number" step="0.5" defaultValue={String(value ?? "")} className={input} />
                </div>
              );
            case "date":
              return (
                <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                  <input id={`f-${f.name}`} name={f.name} type="date" required={f.required} defaultValue={String(value ?? "")} className={input} />
                </div>
              );
            case "select":
              return (
                <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                  <select id={`f-${f.name}`} name={f.name} required={f.required} defaultValue={String(value ?? "")} className={input}>
                    {(f.options ?? []).map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              );
            default:
              return (
                <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                  <label className={label} htmlFor={`f-${f.name}`}>{f.label}{f.required ? " *" : ""}</label>
                  <input id={`f-${f.name}`} name={f.name} type="text" required={f.required} maxLength={f.maxLength} defaultValue={String(value ?? "")} className={input} />
                </div>
              );
          }
        })}
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="h-12 rounded-full bg-white px-8 font-semibold text-neutral-950">
          Save
        </button>
        <span className="text-xs text-neutral-400">Saved changes go live immediately.</span>
      </div>
    </form>
  );
}

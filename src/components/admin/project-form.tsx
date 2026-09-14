"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { saveProject, type SaveProjectState } from "@/app/admin/(panel)/projects/actions";

const input = "h-11 w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 text-sm outline-none focus:border-[var(--brand)]";
const area = "w-full rounded-xl border border-white/20 bg-white/[0.04] p-3 text-sm outline-none focus:border-[var(--brand)]";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400";

export interface ProjectFormTech {
  id: string;
  name: string;
  category: string;
}

export interface ProjectFormData {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  role: string;
  market: string;
  industry: string;
  projectType: string;
  status: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  featured: boolean;
  published: boolean;
  liveUrl: string;
  techIds: string[];
  challenges: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  outcomes: { title: string; description: string }[];
}

export const INDUSTRIES = ["SAAS", "ERP", "FINTECH", "EDTECH", "ECOMMERCE", "GOVERNMENT", "AI", "TRAVEL", "HOSPITALITY", "OTHER"];
export const TYPES = ["WEB_APP", "MOBILE_APP", "API_PLATFORM", "INTERNAL_TOOL"];
export const STATUSES = ["LIVE", "MAINTENANCE", "ARCHIVED", "CONCEPT"];

type ChildKind = "challenge" | "solution" | "outcome";

function Repeater({
  kind,
  heading,
  rows,
  withMetric = false,
}: {
  kind: ChildKind;
  heading: string;
  rows: { title: string; description: string }[];
  withMetric?: boolean;
}) {
  const [items, setItems] = useState(
    rows.length ? rows : [{ title: "", description: "" }]
  );

  return (
    <section className="rounded-3xl border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">{heading}</h3>
        <button
          type="button"
          onClick={() => setItems((v) => [...v, { title: "", description: "" }])}
          className="h-9 rounded-full border border-white/20 px-4 text-xs font-medium hover:border-white/50"
        >
          + Add
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                name={`${kind}-title`}
                value={item.title}
                onChange={(e) =>
                  setItems((v) => v.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                }
                placeholder="Title"
                className={`${input} flex-1`}
              />
              <button
                type="button"
                onClick={() => setItems((v) => v.filter((_, j) => j !== i))}
                className="h-9 w-9 shrink-0 rounded-full border border-red-400/40 text-red-300"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
            <textarea
              name={`${kind}-desc`}
              value={item.description}
              onChange={(e) =>
                setItems((v) => v.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))
              }
              placeholder="Description"
              rows={2}
              className={`${area} mt-2`}
            />
            {withMetric && (
              <input
                name={`${kind}-metric`}
                placeholder="Metric (optional — leave empty if not public)"
                className={`${input} mt-2`}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectForm({
  initial,
  techs,
}: {
  initial: ProjectFormData;
  techs: ProjectFormTech[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<SaveProjectState, FormData>(async (prev, fd) => {
    const res = await saveProject(prev, fd);
    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
    return res;
  }, {});

  const grouped = techs.reduce<Record<string, ProjectFormTech[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <form action={action} className="space-y-6">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <section className="rounded-3xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Basics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="f-name">Name *</label>
            <input id="f-name" name="name" required defaultValue={initial.name} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="f-slug">Slug (auto from name if empty)</label>
            <input id="f-slug" name="slug" defaultValue={initial.slug} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="f-short">Short description * (home + list card)</label>
            <input id="f-short" name="shortDescription" required maxLength={400} defaultValue={initial.shortDescription} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="f-long">Long description * (case study overview)</label>
            <textarea id="f-long" name="longDescription" required rows={5} defaultValue={initial.longDescription} className={area} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="f-role">Role *</label>
            <input id="f-role" name="role" required defaultValue={initial.role} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="f-market">Market</label>
            <input id="f-market" name="market" defaultValue={initial.market} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="f-live">Live URL</label>
            <input id="f-live" name="liveUrl" type="url" defaultValue={initial.liveUrl} className={input} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Classification & timeline</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="f-industry">Industry</label>
            <select id="f-industry" name="industry" defaultValue={initial.industry} className={input}>
              {INDUSTRIES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="f-type">Type</label>
            <select id="f-type" name="projectType" defaultValue={initial.projectType} className={input}>
              {TYPES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="f-status">Status</label>
            <select id="f-status" name="status" defaultValue={initial.status} className={input}>
              {STATUSES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="f-start">Start (year-precision → Jan 1)</label>
            <input id="f-start" name="startDate" type="date" required defaultValue={initial.startDate} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="f-end">End (empty = ongoing)</label>
            <input id="f-end" name="endDate" type="date" defaultValue={initial.endDate} disabled={initial.isCurrent} className={`${input} disabled:opacity-40`} />
          </div>
          <div className="flex items-end gap-6 pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isCurrent" defaultChecked={initial.isCurrent} className="h-4 w-4" /> Ongoing
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={initial.featured} className="h-4 w-4" /> Featured on home
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={initial.published} className="h-4 w-4" /> Published
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Technologies</h2>
        <div className="mt-4 space-y-4">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat}>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{cat}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {list.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="techIds"
                      value={t.id}
                      defaultChecked={initial.techIds.includes(t.id)}
                      className="h-4 w-4"
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Repeater kind="challenge" heading="Challenges" rows={initial.challenges} />
      <Repeater kind="solution" heading="Solutions" rows={initial.solutions} />
      <Repeater kind="outcome" heading="Outcomes (add real numbers via metric only when public)" rows={initial.outcomes} withMetric />

      {state.error && (
        <p role="alert" className="text-sm text-red-400">{state.error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-white px-8 font-semibold text-neutral-950 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save project"}
        </button>
        <Link href="/admin/projects" className="text-sm text-neutral-400 hover:text-white">
          Cancel
        </Link>
        <span className="text-xs text-neutral-400">
          Saved changes go live immediately on the public site.
        </span>
      </div>
    </form>
  );
}

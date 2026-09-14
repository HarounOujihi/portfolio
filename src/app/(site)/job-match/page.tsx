import type { Metadata } from "next";
import { JobMatchForm } from "./jd-form";

export const metadata: Metadata = {
  title: "Job match",
  description: "Paste a job description — get an honest, evidence-linked fit analysis against Haroun's real projects and experience.",
};

export default function JobMatchPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--brand)]">Job match</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tighter sm:text-5xl">See if we fit</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-neutral-400">
        Paste a job description. You&apos;ll get an honest, evidence-linked analysis against Haroun&apos;s
        real projects and experience — strong matches, partials, and gaps. Nothing is invented; every
        claim points at the work.
      </p>

      <div className="mt-10">
        <JobMatchForm />
      </div>

      <p className="mt-8 text-xs text-neutral-400">
        Analysis runs on a GLM model, takes ~30 seconds, and produces a shareable link. The
        description you paste is stored only to generate your report.
      </p>
    </main>
  );
}

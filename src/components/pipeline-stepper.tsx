"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const STEPS = [
  {
    title: "1 · Document in",
    body: "Invoices arrive as scans and PDFs — the pipeline starts with deterministic OCR and layout-aware extraction, not a language model. Cheap, fast, reproducible.",
  },
  {
    title: "2 · Structured extraction",
    body: "The LLM turns extracted fragments into fields that match the purchase-order schema, with strict structured output — so failure is detectable, not silent.",
  },
  {
    title: "3 · Validation routes the work",
    body: "If the record passes schema validation, it's done. If not, the document escalates to a stronger model. Validation is the router — quality gates cost.",
  },
  {
    title: "4 · Per-tenant rollout",
    body: "Every AI capability sits behind per-tenant feature flags: enable for one tenant, watch, widen. Misbehavior can never hit everyone at once.",
  },
  {
    title: "5 · Matched to purchase orders",
    body: "Confirmed records match against purchase orders in the finance domain — with the raw source preserved next to the extracted fields for provenance.",
  },
];

/** Interactive step-through of the SoldX invoice pipeline (P3.T4, D-P3-1). */
export function PipelineStepper() {
  const [step, setStep] = useState(0);
  const current = STEPS[step]!;

  return (
    <div className="rounded-(--radius-organic) border border-white/15 bg-white/[0.04] p-6">
      <div
        role="tablist"
        aria-label="Invoice pipeline steps"
        className="flex flex-wrap gap-2"
      >
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === step}
            onClick={() => setStep(i)}
            className={`h-9 rounded-full px-3 text-xs font-medium transition-colors ${
              i === step
                ? "bg-[var(--brand)] text-neutral-950"
                : "border border-white/20 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-28" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-semibold">{current.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{current.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

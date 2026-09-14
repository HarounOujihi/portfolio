"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface StepperStep {
  title: string;
  body: string;
}

const iconBtn =
  "flex h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-neutral-200 transition-colors hover:border-white/50 disabled:opacity-40";

/** Interactive step-through (P3.T4). Reduced-motion safe, keyboard operable. */
export function Stepper({ heading, steps }: { heading: string; steps: StepperStep[] }) {
  const [step, setStep] = useState(0);
  const current = steps[step]!;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-400">{heading}</p>
      <div role="tablist" aria-label={heading} className="mt-4 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === step}
            onClick={() => setStep(i)}
            className={`h-9 rounded-full px-3 text-xs font-medium transition-colors ${
              i === step
                ? "bg-[var(--brand)] text-neutral-950"
                : "border border-white/20 text-neutral-400 hover:border-white/50"
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
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">{current.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={iconBtn}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className={iconBtn}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const INVOICE_STEPS = [
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

export function InvoicePipelineStepper() {
  return <Stepper heading="Inside the invoice pipeline" steps={INVOICE_STEPS} />;
}

const ASSISTANT_STEPS = [
  {
    title: "1 · Ask in your language",
    body: "French, Arabic (including Tunisian dialect) or English. One routing call classifies the question into one of five intents and detects the language to answer in.",
  },
  {
    title: "2 · USAGE — help documentation",
    body: "How-to questions search 69 help guides via hybrid semantic search — local ONNX embeddings + pgvector cosine, boosted by lexical scoring, deduplicated to the top sections.",
  },
  {
    title: "3 · DATA — your numbers",
    body: "Numeric questions match one of 16 tenant-scoped data tools (revenue, unpaid invoices, stock valuation, client history…), each a Prisma aggregate capped at 30 rows — the LLM reads figures, it never invents them.",
  },
  {
    title: "4 · Guardrails",
    body: "Read-only by design. Opinions, tax/legal advice and competitor talk get a polite refusal. Prompt-injection attempts are ignored. Greetings get a friendly intro — never a refusal.",
  },
  {
    title: "5 · Answered + measured",
    body: "Every question is logged (tokens, latency, tools used), anonymized in a 90-day rollup, and covered by eval suites: router 22/22, retrieval 15/15, dispatcher 23/23.",
  },
];

export function AssistantStepper() {
  return <Stepper heading="The assistant flow — five branches" steps={ASSISTANT_STEPS} />;
}

---
title: "Multi-model LLM routing without burning money"
excerpt: "How a production invoice pipeline uses OCR, structured extraction, model routing, and per-tenant rollout flags to keep AI cost predictable."
type: AI
---

"Add AI to the product" fails as an instruction. What worked for us was narrower: an invoice-to-
purchase-order pipeline where the LLM is one component in a document-processing flow — and every
design decision exists to keep quality up while cost stays predictable. This is how that pipeline
is built, and why each piece is there.

## Step one is not the LLM

Invoices enter as scans and PDFs. The pipeline starts with OCR and layout-aware extraction — cheap,
deterministic, fast — and only then does a language model touch the data, turning extracted fragments
into structured fields that match our purchase-order schema. Letting the model read raw pixels means
paying token prices for work a conventional step does better. The LLM earns its cost on the messy
semantic part: vendor names that do not match, line items split across pages, dates in three formats.

## Why multi-model routing

Different extraction jobs have different difficulty profiles. A clean typed invoice and a crumpled
photograph of a handwritten delivery note should not cost the same to process — and do not need the
same model. The pipeline routes: cheap fast models handle the common case; stronger models take the
hard ones. Routing is data-driven per attempt — if the first pass fails validation against the
expected schema, the document escalates. That is the whole trick: **validation is the router.**
Structured output with a strict schema makes failure detectable, and detectable failure is what makes
escalation safe:

```ts
// validation is the router — one loop, no model guessing
for (const model of route) {                    // [fast, stronger]
  const result = await extract(model, doc);
  const parsed = schema.safeParse(result);
  if (parsed.success) return parsed.data;       // good enough — stop paying
  // structurally failed: escalate to the next model, keep the attempt log
}
return humanReview(doc, attempts);              // both failed — it leaves the happy path
```

The cost math follows directly. If 90% of documents clear on the cheap model and the strong
model costs 10× more, blended cost is 1.9× the cheap model — not 10×. You only pay the premium
for the documents that genuinely are harder, and you can prove it per document: the attempt log
is the audit trail.

## Per-tenant feature flags

An ERP serves many tenants on one platform; an AI feature that misbehaves must never misbehave for
everyone at once. Every AI capability sits behind a per-tenant feature flag. Rollout is controlled:
enable for one tenant, watch, widen. Flags also make the cost conversation concrete — AI features
can be enabled per tenant, so the operator sees exactly what they opted into.

## The assistant on top

The same platform also runs a natural-language query assistant: non-technical staff ask questions
about inventory, sales, and finance in plain language. It reads the tenant-scoped data the ERP
already models — which is the quiet point. AI features got dramatically easier once the underlying
data model was worth querying.

## What I would do again

- Structured output with strict validation — it turns "the model hallucinated" into "this record
  failed validation, escalate."
- Model choice as a routing decision, not a constant.
- Feature flags around every AI surface, per tenant.
- Deterministic steps before generative ones, always.

LLM cost is not a property of the model. It is a property of the pipeline you wrap around it.

import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";

# SoldX / Studio — case study notes (P0.T2, enriched 2026-09-14)

**Status: relationship resolved.** SoldX ecosystem **is a MAHD product**, built from 2023 to present.
The owner can discuss any feature publicly — including the invoice OCR pipeline and the AI assistant.

## Owner-provided product facts (2026-09-14)

- **snap.soldx.tn** — website builder: renders merchant websites, SEO settings, template(s) management
- **soldx.tn** — discounts discovery: all discounted products in one page, advanced search + filters,
  ratings, **map of nearby stores with discounts**, best deals
- **AI assistant** (see `/home/haroun/projects/sawi/studio/AI_ASSISTANT_FLOW.md` — full reference):
  - Multilingual: French, Arabic (incl. Tunisian dialect), English — answers in the user's language
  - Five branches: USAGE (69 help guides), DATA (16 tenant-scoped tools), MIXED, GREETING, OUT_OF_SCOPE
  - Hybrid docs search: local ONNX embeddings (e5-small 384-d) + pgvector cosine + lexical boost → top 3
  - Read-only · tenant-private · honest number bases (cash vs invoiced) · lexical fallback on any failure
  - Per-establishment feature flags · AssistantLog + anonymized 90-day rollup
  - Evals: router 22/22 · retrieval 15/15 · dispatcher 23/23
- Screenshots: `snap.png`, `soldx.png` (seeded as media — home bento + case-study gallery)

## Still needed (owner)

- [ ] 2–3 outcome metrics (tenants, invoices processed, products synced?): ____________
- [ ] Architecture diagram source (draw.io/Excalidraw → SVG in Phase 3)
- [ ] Real ERP dashboard screenshots (optional — snap + deals already cover the gallery)

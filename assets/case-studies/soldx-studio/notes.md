# SoldX / Studio — case study notes (P0.T2)

**Status: relationship resolved (owner, 2026-09).** SoldX ecosystem **is a MAHD product**, built from
2023 to present. The owner can discuss any SoldX feature publicly — including the OCR/invoice pipeline.

## Facts (owner-confirmed + CV)

- **Period:** 2023 – present (overlaps the MAHD Lead role, Aug 2023 – present).
- **Role:** lead developer across the full product lifecycle — phasing the idea, iterating on the
  product concept, choosing the stack, leading the team (assigning tasks while staying hands-on as a developer).
- Ecosystem for Tunisian SMEs:
  - `snap.soldx.tn` — e-commerce storefront + template builder, auto-provisioned shops
  - `soldx.tn` — multi-tenant ERP
  - `studio.soldx.tn` — mobile-first modular ERP: inventory, purchasing, sales, finance, CRM, projects
- Core: Rust, Node.js, NestJS, Laravel, GraphQL, PostgreSQL, MongoDB, Prisma, React, TypeScript;
  platform layer: Next.js, Prisma, PostgreSQL (MAHD architecture per CV).
- **Headline AI story (public):** LLM-powered invoice-to-PO pipeline — OCR + structured extraction,
  cost-optimized multi-model routing, per-tenant feature-flagged rollout; plus the natural-language
  business query assistant; plus the connector framework (WooCommerce, PrestaShop, Magento, Shopify
  via a generic ingestion API).
- Case-study slug: `soldx-studio`. Assistant fixture slugs aligned (`attribution-invoice-pipeline`,
  `attribution-connector-framework` → `soldx-studio`).

## Screenshots

- **Pending from owner** — placeholder/dummy images + dummy data are acceptable for development;
  real ones must replace them before launch (gated by P3.T7 content QA and the Phase 12 pass).

## Still needed (owner)

- [ ] 2–3 outcome metrics (tenants, invoices processed, products synced?): ____________
- [ ] Architecture diagram source (draw.io/Excalidraw → SVG in Phase 3)
- [ ] Real screenshots (replace dummies): ____________

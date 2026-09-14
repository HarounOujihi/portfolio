# Site Copy — Phase 0 source of truth

Grounded in `haroun-oujihi-cv.pdf` (2026). Consumed by the Phase 1 seed (`Profile`, `Experience`, `Skill`).
Owner review welcome — edit freely; this file is the seed source, the seed is the DB source.

## Hero

- **Headline:** Haroun Oujihi
- **Subhead:** Lead Full Stack Engineer — SaaS & ERP architecture with applied AI/LLM integration in production.
- **Availability:** Open to remote, hybrid & on-site.

## 20-second recruiter pitch

Full-stack engineer with 10+ years building SaaS and ERP platforms. I architected a multi-tenant
ERP ecosystem (Next.js, Prisma, PostgreSQL) that runs an LLM-powered invoice pipeline in production —
OCR, structured extraction, cost-optimized multi-model routing, per-tenant feature-flagged rollout —
and a natural-language assistant that lets non-technical staff query business data directly.
I own products end to end — shaping the idea, phasing the roadmap, choosing the stack, leading the
team while staying hands-on: architecture, backend, frontend, delivery.

## Short bio

Lead full-stack engineer with a decade of shipping SaaS and ERP systems — from multi-tenant
architecture and data modeling to the UI layer. Currently focused on applied AI: invoice-to-purchase-order
extraction pipelines, natural-language business querying, and multi-model LLM routing that keeps cost
under control. Previously delivered platforms for customs, education, e-commerce, and enterprise data
processing across Tunisia, Qatar, and Paris.

## Long bio

Haroun Oujihi is a lead full-stack engineer with more than ten years of experience building
SaaS and ERP platforms across the full lifecycle — architecture, backend, frontend, and delivery.

As Lead Full Stack Developer at MAHD (Aug 2023 – present), he architected a multi-tenant ERP SaaS
platform covering inventory, purchasing, sales, finance, and CRM, built on Next.js, Prisma, and
PostgreSQL. On top of it he shipped an LLM-powered invoice-to-purchase-order pipeline — OCR plus
structured data extraction with cost-optimized multi-model routing and per-tenant feature flags for
controlled rollout — and a natural-language business query assistant that lets non-technical staff
query inventory, sales, and finance data directly. He also owns the plugin/connector framework that
syncs product catalogs from WooCommerce, PrestaShop, Magento, and Shopify through a generic ingestion API.

Before that: large-scale data processing on AWS Lambda across Snowflake, MySQL, and DynamoDB with
Elasticsearch-backed search (DNext); architecture and delivery of web and mobile products across
construction, transportation, education, and events in Paris (Genext-IT); business management and
mobile applications in Qatar (PagesQatar); and e-commerce integrations spanning Etsy, Shopify, eBay,
Ecwid, PrestaShop, and Magento (Tunisie-Technologie).

Selected work includes the SoldX SaaS ecosystem for Tunisian SMEs (storefront builder + multi-tenant
and mobile-first ERP), the Sunchime.me customs platform used for Iraqi import/export document processing,
and the John Dewey School management system with role-based modules for attendance, exams, payments, and HR.

He holds a License Degree in Computer Science from ISSAT Sousse and works in English, French, and Arabic.

## Contact / Profile fields (for Phase 1 seed)

| Field | Value |
|---|---|
| fullName | Haroun Oujihi |
| headline | Lead Full Stack Engineer \| AI/LLM Integration \| SaaS & ERP Architecture |
| email | haroun.oujihi@hotmail.com |
| phone | +216 54 443 740 |
| githubUrl | https://github.com/HarounOujihi |
| linkedinUrl | https://linkedin.com/in/haroun-oujihi |
| cvUrl | /haroun-oujihi-cv.pdf |
| avatarUrl | /me.jpg |
| availability | Open to remote, hybrid & on-site |
| yearsExperience | 10 |
| location | Tunisia (open to remote/hybrid/on-site) |

## Employer history (dates per CV)

| Company | Role | Period |
|---|---|---|
| MAHD | Lead Full Stack Developer | Aug 2023 – Present |
| DNext | Lead & Full Stack Developer | Mar 2022 – Jul 2023 |
| Genext-IT (Paris) | Lead & Full Stack Developer | May 2019 – Mar 2022 |
| PagesQatar (Qatar) | Full Stack Developer | Oct 2017 – May 2019 |
| Tunisie-Technologie | Full Stack Developer | Oct 2015 – Oct 2017 |
| NCS Tunisia | Full Stack Developer | Jan 2014 – Oct 2015 |

## Notes for later phases

- The strongest AI story is the MAHD invoice OCR → PO pipeline + NL query assistant — lead with it
  in the assistant demo prompts and the SoldX/ERP case study.
- **Discrepancy to resolve (P0.T2):** `BitMal` (FinTech, Saudi market) is named in
  `PORTFOLIO_PROJECT_PLAN.md` §12 but does not appear in the CV. Confirm whether it stays a case study
  (possibly under a different/anonymous framing) or is replaced. No CV evidence = the assistant must not
  claim it — fixtures in `evals/fixtures.ts` deliberately avoid asserting BitMal experience.
- Brand color (validated): light `--color-brand: oklch(0.55 0.18 255)` (#026fd7, 4.93:1 on white);
  dark-mode variant `--color-brand-dark: oklch(0.72 0.13 255)` (#6aa7f4, 7.70:1 on oklch(0.17 0.02 255) surface).

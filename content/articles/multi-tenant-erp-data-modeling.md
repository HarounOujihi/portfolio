---
title: "What multi-tenant ERP data modeling actually demands"
excerpt: "Lessons from unifying inventory, purchasing, sales, finance, and CRM across three connected applications on one Postgres schema."
type: ARCHITECTURE
---

Most multi-tenant tutorials stop at "add a `tenantId` column." A real multi-tenant ERP — inventory,
purchasing, sales, finance, and CRM in one product — makes that column the least interesting part.
Here is what the hard parts actually were, building a platform that runs three connected Next.js
applications on one unified PostgreSQL schema.

## One schema, many tenants — deliberately

We run a shared schema with a tenant discriminator on every domain table. For an ERP at SME scale
this beats schema-per-tenant: migrations stay instant, cross-tenant features (the connector framework,
central reporting) remain one query away, and Prisma's type safety works unchanged. The cost is
discipline: **every** query path must be tenant-scoped, and that has to be enforced by the data-access
layer, not by memory.

The rule that made it work: no feature code talks to Prisma directly. Domain modules own their tables
and accept a tenant scope. If a query cannot state which tenant it serves, it does not compile into
the product.

## Five domains, one transaction boundary

Inventory, purchasing, sales, finance, and CRM look like five modules; operationally they are one
story. A purchase order arrives (purchasing), goods land (inventory), an invoice is matched (finance),
and the customer timeline updates (CRM). Modeling these as independent silos guarantees drift —
so the schema keeps the links first-class: the invoice-to-PO pipeline depends on purchasing and
finance sharing identifiers end to end.

The same logic drove the application topology. Three Next.js applications share one database and one
domain layer instead of owning private copies of the truth. The integration cost moves to one place
(deployment and shared-code versioning), and in exchange every app sees consistent data.

## Documents are not rows

The hardest data-modeling lesson: an ERP's most valuable data arrives as paper. Invoices, delivery
notes, and purchase orders enter the system as unstructured documents, and the schema has to carry
them from "PDF blob" to "matched financial record" without losing provenance. That pipeline — OCR,
structured extraction, human-confirmable results — is why the document tables keep the raw source
next to the extracted fields. When extraction is wrong, an operator can see why.

## Integrations are a product

Tenants sell on WooCommerce, PrestaShop, Magento, and Shopify. Building four bespoke integrations
is how you get four broken integrations. The connector framework inverts it: one generic ingestion
API, with per-platform adapters translating to a single canonical catalog shape. New platforms
become a new adapter, not a new subsystem.

## What I would tell anyone starting this

Multi-tenant is not a column; it is an access-control contract. Write the tenant-scoping rule once,
enforce it mechanically, and let the five domains share one transactional story. And design the
document pipeline before you need it — retrofitting provenance into financial data is a project
you do not want.

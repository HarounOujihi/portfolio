// Seed — Phase 1/3 (P1.T10 + P3.T1). Idempotent upserts.
import "dotenv/config";
import { readFileSync } from "node:fs";
// Sources: content/copy.md, content/articles/*.md, assets/case-studies/*/notes.md (owner facts).
// This file is the content-backup source of truth (see plans/phase-1-foundation.md).
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Year-precision convention (P0 owner decision): Jan 1 for year-only dates;
// endDate null + isCurrent for ongoing work.
async function main() {
  // ---------------- Profile (singleton, fixed id) ----------------
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: {
      id: "profile",
      fullName: "Haroun Oujihi",
      headline: "Lead Full Stack Engineer | AI/LLM Integration | SaaS & ERP Architecture",
      shortBio:
        "Lead full-stack engineer with a decade of shipping SaaS and ERP systems — from multi-tenant architecture and data modeling to the UI layer. Currently focused on applied AI: invoice-to-purchase-order extraction pipelines, natural-language business querying, and multi-model LLM routing that keeps cost under control.",
      longBio:
        "Haroun Oujihi is a lead full-stack engineer with more than ten years of experience building SaaS and ERP platforms across the full lifecycle — architecture, backend, frontend, and delivery.\n\nAs Lead Full Stack Developer at MAHD (Aug 2023 – present), he architected a multi-tenant ERP SaaS platform covering inventory, purchasing, sales, finance, and CRM, built on Next.js, Prisma, and PostgreSQL. On top of it he shipped an LLM-powered invoice-to-purchase-order pipeline — OCR plus structured data extraction with cost-optimized multi-model routing and per-tenant feature flags for controlled rollout — and a natural-language business query assistant that lets non-technical staff query inventory, sales, and finance data directly. He also owns the plugin/connector framework that syncs product catalogs from WooCommerce, PrestaShop, Magento, and Shopify through a generic ingestion API.\n\nBefore that: large-scale data processing on AWS Lambda across Snowflake, MySQL, and DynamoDB with Elasticsearch-backed search (DNext); architecture and delivery of web and mobile products across construction, transportation, education, and events in Paris (Genext-IT); business management and mobile applications in Qatar (PagesQatar); and e-commerce integrations spanning Etsy, Shopify, eBay, Ecwid, PrestaShop, and Magento (Tunisie-Technologie).\n\nSelected work includes the SoldX SaaS ecosystem for Tunisian SMEs (storefront builder + multi-tenant and mobile-first ERP), the Sunchine.me customs platform used for Iraqi import/export document processing, and the John Dewey School management system with role-based modules for attendance, exams, payments, and HR.\n\nHe holds a License Degree in Computer Science from ISSAT Sousse and works in English, French, and Arabic.",
      location: "Tunisia (open to remote/hybrid/on-site)",
      availability: "Open to remote, hybrid & on-site",
      yearsExperience: 10,
      email: "haroun.oujihi@hotmail.com",
      phone: "+216 54 443 740",
      linkedinUrl: "https://linkedin.com/in/haroun-oujihi",
      githubUrl: "https://github.com/HarounOujihi",
      cvUrl: "/haroun-oujihi-cv.pdf",
      avatarUrl: "/me.jpg",
    },
  });

  // ---------------- Admin (allow-list mirror — §8.1) ----------------
  // Auth method (OAuth vs email+password) is decided at Phase 4; this row is the
  // allow-list/audit record and must exist either way. No credentials stored here.
  await prisma.adminUser.upsert({
    where: { email: "haroun@mahd.group" },
    update: { role: "ADMIN" },
    create: { email: "haroun@mahd.group", name: "Haroun Oujihi", role: "ADMIN" },
  });

  // ---------------- Technologies ----------------
  const tech = async (
    name: string,
    slug: string,
    category: "FRONTEND" | "BACKEND" | "DATABASE" | "INFRASTRUCTURE" | "AI" | "MOBILE" | "TOOLS",
    sortOrder: number
  ) =>
    prisma.technology.upsert({
      where: { slug },
      update: {},
      create: { name, slug, category, sortOrder },
    });

  const t = {
    nextjs: await tech("Next.js", "nextjs", "FRONTEND", 1),
    react: await tech("React", "react", "FRONTEND", 2),
    typescript: await tech("TypeScript", "typescript", "FRONTEND", 3),
    remix: await tech("Remix", "remix", "FRONTEND", 4),
    antd: await tech("Ant Design", "ant-design", "FRONTEND", 5),
    tailwind: await tech("Tailwind CSS", "tailwindcss", "FRONTEND", 6),
    nodejs: await tech("Node.js", "nodejs", "BACKEND", 7),
    nestjs: await tech("NestJS", "nestjs", "BACKEND", 8),
    laravel: await tech("Laravel", "laravel", "BACKEND", 9),
    rust: await tech("Rust", "rust", "BACKEND", 10),
    graphql: await tech("GraphQL", "graphql", "BACKEND", 11),
    prisma: await tech("Prisma", "prisma", "DATABASE", 12),
    postgres: await tech("PostgreSQL", "postgresql", "DATABASE", 13),
    mongodb: await tech("MongoDB", "mongodb", "DATABASE", 14),
    elasticsearch: await tech("Elasticsearch", "elasticsearch", "DATABASE", 15),
    aws: await tech("AWS (Lambda, Step Functions)", "aws", "INFRASTRUCTURE", 16),
    docker: await tech("Docker", "docker", "INFRASTRUCTURE", 17),
    reactnative: await tech("React Native", "react-native", "MOBILE", 18),
    ionic: await tech("Ionic", "ionic", "MOBILE", 19),
  };

  // ---------------- Skills ----------------
  const skill = (
    id: string,
    name: string,
    category: "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "INFRASTRUCTURE" | "AI_ML" | "ARCHITECTURE" | "LEADERSHIP" | "OTHER",
    level: "FAMILIAR" | "PROFICIENT" | "ADVANCED" | "EXPERT",
    years: number,
    featured = false,
    sortOrder = 0
  ) =>
    prisma.skill.upsert({
      where: { id },
      update: {},
      create: { id, name, category, level, years, featured, sortOrder },
    });

  await skill("skill-multi-tenant-saas", "Multi-Tenant SaaS Architecture", "ARCHITECTURE", "EXPERT", 5, true, 1);
  await skill("skill-modular-erp", "Modular ERP Design", "ARCHITECTURE", "EXPERT", 6, true, 2);
  await skill("skill-system-arch", "System Architecture", "ARCHITECTURE", "ADVANCED", 8, true, 3);
  await skill("skill-llm-integration", "LLM Integration", "AI_ML", "ADVANCED", 2, true, 4);
  await skill("skill-ocr-extraction", "OCR & Structured Data Extraction", "AI_ML", "ADVANCED", 2, true, 5);
  await skill("skill-prompt-eng", "Prompt Engineering", "AI_ML", "ADVANCED", 2, false, 6);
  await skill("skill-multi-model-routing", "Multi-Model Routing & Cost Optimization", "AI_ML", "ADVANCED", 2, true, 7);
  await skill("skill-feature-flag-ai", "Feature-Flagged AI Rollout", "AI_ML", "ADVANCED", 2, false, 8);
  await skill("skill-typescript", "TypeScript", "LANGUAGE", "EXPERT", 8, true, 9);
  await skill("skill-javascript", "JavaScript", "LANGUAGE", "EXPERT", 10, false, 10);
  await skill("skill-rust", "Rust", "LANGUAGE", "PROFICIENT", 3, false, 11);
  await skill("skill-python", "Python", "LANGUAGE", "PROFICIENT", 6, false, 12);
  await skill("skill-php", "PHP", "LANGUAGE", "ADVANCED", 7, false, 13);
  await skill("skill-react", "React", "FRAMEWORK", "EXPERT", 9, true, 14);
  await skill("skill-nextjs", "Next.js", "FRAMEWORK", "EXPERT", 5, true, 15);
  await skill("skill-nestjs", "NestJS", "FRAMEWORK", "ADVANCED", 5, false, 16);
  await skill("skill-laravel", "Laravel", "FRAMEWORK", "ADVANCED", 6, false, 17);
  await skill("skill-react-native", "React Native", "FRAMEWORK", "ADVANCED", 6, false, 18);
  await skill("skill-postgres", "PostgreSQL", "DATABASE", "EXPERT", 9, true, 19);
  await skill("skill-mongodb", "MongoDB", "DATABASE", "ADVANCED", 8, false, 20);
  await skill("skill-aws", "AWS (Lambda, Step Functions)", "INFRASTRUCTURE", "ADVANCED", 4, false, 21);
  await skill("skill-rest-graphql", "REST & GraphQL API Design", "ARCHITECTURE", "EXPERT", 8, false, 22);
  await skill("skill-tech-leadership", "Technical & Team Leadership", "LEADERSHIP", "EXPERT", 6, true, 23);
  await skill("skill-product-dev", "Product Development & Project Management", "LEADERSHIP", "ADVANCED", 6, false, 24);

  // ---------------- Education ----------------
  await prisma.education.upsert({
    where: { id: "edu-issat-sousse" },
    update: {},
    create: {
      id: "edu-issat-sousse",
      institution: "ISSAT Sousse",
      degree: "License Degree",
      field: "Computer Science",
      location: "Sousse, Tunisia",
      startDate: new Date("2010-09-01"),
      endDate: new Date("2013-12-31"),
      sortOrder: 1,
    },
  });

  // ---------------- Experience (published — public record from CV) ----------------
  const experience = (
    companySlug: string,
    data: {
      companyName: string; jobTitle: string; employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE";
      location?: string; startDate: Date; endDate?: Date; isCurrent?: boolean; summary: string; description: string;
      sortOrder: number;
    },
    achievements: { title: string; description: string; metric?: string }[]
  ) =>
    prisma.experience.upsert({
      where: { companySlug },
      update: {},
      create: {
        ...data,
        companySlug,
        published: true,
        achievements: { create: achievements.map((a, i) => ({ ...a, sortOrder: i + 1 })) },
      },
    });

  await experience(
    "mahd",
    {
      companyName: "MAHD",
      jobTitle: "Lead Full Stack Developer",
      employmentType: "FULL_TIME",
      startDate: new Date("2023-08-01"),
      isCurrent: true,
      summary:
        "Lead technology strategy and own the full product development lifecycle across a multi-product SaaS portfolio.",
      description:
        "Architecture, backend, frontend, and delivery ownership across interconnected Next.js applications sharing a unified multi-tenant schema.",
      sortOrder: 1,
    },
    [
      {
        title: "Multi-tenant ERP SaaS platform",
        description:
          "Architected a multi-tenant ERP platform (Next.js, Prisma, PostgreSQL) covering inventory, purchasing, sales, finance, and CRM.",
      },
      {
        title: "LLM-powered invoice-to-PO pipeline",
        description:
          "Built an invoice pipeline (OCR + structured extraction) with cost-optimized multi-model routing and per-tenant feature flags for controlled rollout.",
      },
      {
        title: "Natural-language business query assistant",
        description:
          "Shipped an assistant letting non-technical staff query inventory, sales, and finance data directly.",
      },
      {
        title: "Plugin/connector framework",
        description:
          "Product catalog sync from WooCommerce, PrestaShop, Magento, and Shopify via a generic ingestion API across three interconnected Next.js applications.",
      },
    ]
  );

  await experience(
    "dnext",
    {
      companyName: "DNext",
      jobTitle: "Lead & Full Stack Developer",
      employmentType: "FULL_TIME",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2023-07-31"),
      summary: "Developed platform modules and large-scale data processing services.",
      description: "Enterprise features, complex frontend interfaces, and cloud data services.",
      sortOrder: 2,
    },
    [
      {
        title: "AWS Lambda data processing",
        description: "Large-scale data processing across Snowflake, MySQL, and DynamoDB.",
      },
      {
        title: "Search infrastructure",
        description: "Elasticsearch integration for high-performance search and indexing.",
      },
      {
        title: "Complex frontends",
        description: "React, Draft.js, and Ant Design enterprise interfaces.",
      },
    ]
  );

  await experience(
    "genext-it",
    {
      companyName: "Genext-IT",
      jobTitle: "Lead & Full Stack Developer",
      employmentType: "FULL_TIME",
      location: "Paris, France",
      startDate: new Date("2019-05-01"),
      endDate: new Date("2022-03-31"),
      summary:
        "Led development of multiple web and mobile applications across construction, transportation, education, and event management.",
      description:
        "Designed software architecture, database models, and deployment strategies; delivered platforms from architecture through implementation.",
      sortOrder: 3,
    },
    [
      { title: "SMS Sending Manager", description: "Delivered from architecture through implementation." },
      { title: "TryAndBuy platform", description: "Delivered from architecture through implementation." },
      {
        title: "Multi-domain delivery",
        description: "Web and mobile applications across four industries with direct stakeholder collaboration.",
      },
    ]
  );

  await experience(
    "pagesqatar",
    {
      companyName: "PagesQatar",
      jobTitle: "Full Stack Developer",
      employmentType: "FULL_TIME",
      location: "Qatar",
      startDate: new Date("2017-10-01"),
      endDate: new Date("2019-05-31"),
      summary: "Developed business management applications and mobile apps.",
      description: "Inventory/product management, enterprise SMS platform, WordPress integrations.",
      sortOrder: 4,
    },
    [
      { title: "Nutree", description: "Inventory and product management application." },
      { title: "Enterprise SMS platform", description: "Business SMS management at scale." },
      { title: "Mobile applications", description: "Ionic and React Native mobile apps." },
    ]
  );

  await experience(
    "tunisie-technologie",
    {
      companyName: "Tunisie-Technologie",
      jobTitle: "Full Stack Developer",
      employmentType: "FULL_TIME",
      startDate: new Date("2015-10-01"),
      endDate: new Date("2017-10-31"),
      summary: "Built e-commerce management integrations.",
      description: "E-commerce ecosystem integrations across major marketplaces.",
      sortOrder: 5,
    },
    [
      {
        title: "Printaura",
        description: "E-commerce management system integrating Etsy, Shopify, eBay, Ecwid, PrestaShop, and Magento.",
      },
    ]
  );

  await experience(
    "ncs-tunisia",
    {
      companyName: "NCS Tunisia",
      jobTitle: "Full Stack Developer",
      employmentType: "FULL_TIME",
      startDate: new Date("2014-01-01"),
      endDate: new Date("2015-10-31"),
      summary: "Built travel, restaurant, POS, and sales/purchasing systems.",
      description: "Early-career full-stack delivery across web and mobile.",
      sortOrder: 6,
    },
    [
      { title: "Link-voyages", description: "Travel agency management website." },
      { title: "Waiter", description: "Restaurant order management app with offline synchronization." },
      { title: "Tasswia POS", description: "Inventory, POS, and sales/purchasing systems." },
    ]
  );

  // ---------------- Projects (drafts — content lands in Phase 3, P3.T1) ----------------
  const project = (slug: string, data: Record<string, unknown>, techIds: string[]) =>
    prisma.project.upsert({
      where: { slug },
      update: {},
      create: {
        ...data,
        slug,
        // Published from Phase 2 on (owner content is real; deep case-study
        // sections land in Phase 3 / P3.T1)
        published: true,
        technologies: { create: techIds.map((technologyId) => ({ technologyId })) },
      } as never,
    });

  await project(
    "soldx-studio",
    {
      name: "SoldX / Studio",
      shortDescription:
        "Ecosystem of commerce and business-management products for Tunisian SMEs: storefront builder, multi-tenant ERP, and mobile-first modular ERP — with an LLM-powered invoice pipeline in production.",
      longDescription:
        "The SoldX ecosystem (soldx.tn, studio.soldx.tn, snap.soldx.tn) is a MAHD product built from 2023 to present. It covers inventory, purchasing, sales, finance, CRM, and projects on a multi-tenant Next.js/Prisma/PostgreSQL core, with an LLM-powered invoice-to-PO pipeline (OCR, structured extraction, multi-model routing, per-tenant feature flags), a natural-language business query assistant, and a connector framework syncing WooCommerce, PrestaShop, Magento, and Shopify catalogs.",
      role: "Lead developer — full product lifecycle: idea phasing, product iteration, stack decisions, team leadership + hands-on development",
      market: "Tunisia",
      industry: "ERP",
      projectType: "WEB_APP",
      startDate: new Date("2023-01-01"),
      isCurrent: true,
      status: "LIVE",
      featured: true,
      sortOrder: 1,
      liveUrl: "https://soldx.tn",
      externalLinks: {
        create: [
          { label: "soldx.tn", url: "https://soldx.tn", type: "LIVE_DEMO", sortOrder: 1 },
          { label: "studio.soldx.tn", url: "https://studio.soldx.tn", type: "LIVE_DEMO", sortOrder: 2 },
          { label: "snap.soldx.tn", url: "https://snap.soldx.tn", type: "LIVE_DEMO", sortOrder: 3 },
        ],
      },
    },
    [t.nextjs.id, t.prisma.id, t.postgres.id, t.graphql.id, t.react.id, t.typescript.id, t.nestjs.id, t.nodejs.id, t.rust.id, t.laravel.id, t.mongodb.id]
  );

  await project(
    "bitmal",
    {
      name: "BitMal",
      shortDescription:
        "Wallet and transaction platform for a giving ecosystem — connecting Volunteers, Organizations, Merchants, and Donors. Fully gated behind sign-in and approved joins.",
      longDescription:
        "BitMal (bitmal.org) implements wallets and transactions between four roles — Volunteers, Organizations, Merchants, and Donors. Built with React/Remix, Prisma, and PostgreSQL. The product is fully auth-gated: nothing is visible before sign-in or an approved join request.",
      role: "Lead developer — full product lifecycle: idea phasing, product iteration, stack decisions, team leadership + hands-on development",
      market: "Giving / community economy",
      industry: "FINTECH",
      projectType: "WEB_APP",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      status: "LIVE",
      featured: false,
      sortOrder: 2,
      liveUrl: "https://bitmal.org",
      externalLinks: { create: [{ label: "bitmal.org", url: "https://bitmal.org", type: "LIVE_DEMO", sortOrder: 1 }] },
    },
    [t.remix.id, t.react.id, t.prisma.id, t.postgres.id, t.typescript.id]
  );

  await project(
    "sunchine",
    {
      name: "Sunchine.me",
      shortDescription:
        "Customs management platform used for Iraqi import/export operations: jobs (COC/NCR), inspections, laboratories, companies, reports, dashboards, and workflows.",
      longDescription:
        "Sunchine.me streamlines import/export operations and high-volume document processing for Iraqi Customs. Core entity is the job (add/edit with COC — confirmed — and NCR — not confirmed — types). Modules include reports, dashboarding, companies, laboratories, exports, inspections, and workflows. Built with Laravel, React, TypeScript, and Ant Design. Under active maintenance contract since delivery (2025).",
      role: "Lead developer — full product lifecycle: idea phasing, product iteration, stack decisions, team leadership + hands-on development",
      market: "Iraq",
      industry: "GOVERNMENT",
      projectType: "WEB_APP",
      startDate: new Date("2025-01-01"),
      isCurrent: true,
      status: "MAINTENANCE",
      featured: false,
      sortOrder: 3,
      liveUrl: "https://sunchine.me",
      externalLinks: { create: [{ label: "sunchine.me", url: "https://sunchine.me", type: "LIVE_DEMO", sortOrder: 1 }] },
    },
    [t.laravel.id, t.react.id, t.typescript.id, t.antd.id]
  );

  await project(
    "john-dewey-school",
    {
      name: "John Dewey School Management System",
      shortDescription:
        "Role-based school management platform for administrators, teachers, students, and parents — attendance, timetables, exams, canteen, HR, payments.",
      longDescription:
        "Architected and developed a role-based school management platform (johndewey-school.org) serving administrators, teachers, students, and parents, with modules for attendance, timetables, exams, canteen, HR, payments, and student management. Teachers run their instance end to end — timetable, grade entry (Notes), homework journal (Cahier de Liaison), courses, sanctions, and parent complaints — while parents get per-child views including canteen reservations (per day or month) with history.",
      role: "Lead developer — full product lifecycle: idea phasing, product iteration, stack decisions, team leadership + hands-on development",
      market: "Education",
      industry: "EDTECH",
      projectType: "WEB_APP",
      startDate: new Date("2026-01-01"),
      isCurrent: true,
      status: "LIVE",
      featured: false,
      sortOrder: 4,
      liveUrl: "https://johndewey-school.org",
      externalLinks: {
        create: [{ label: "johndewey-school.org", url: "https://johndewey-school.org", type: "LIVE_DEMO", sortOrder: 1 }],
      },
    },
    [t.react.id, t.reactnative.id, t.nodejs.id]
  );

  // ---------------- Case-study content (P3.T1) — facts only, metrics owner-pending ----------------
  const seedChildren = async (
    slug: string,
    children: {
      challenges: { title: string; description: string }[];
      solutions: { title: string; description: string }[];
      outcomes: { title: string; description: string; metric?: string }[];
      media: { id: string; url: string; alt: string; caption: string; createdAt?: Date }[];
    }
  ) => {
    const proj = await prisma.project.findUnique({ where: { slug } });
    if (!proj) throw new Error(`project ${slug} missing`);
    // Content source of truth is this seed — children are replaced, not merged.
    await prisma.projectChallenge.deleteMany({ where: { projectId: proj.id } });
    await prisma.projectSolution.deleteMany({ where: { projectId: proj.id } });
    await prisma.projectOutcome.deleteMany({ where: { projectId: proj.id } });
    await prisma.projectChallenge.createMany({
      data: children.challenges.map((c, i) => ({ ...c, projectId: proj.id, sortOrder: i + 1 })),
    });
    await prisma.projectSolution.createMany({
      data: children.solutions.map((s, i) => ({ ...s, projectId: proj.id, sortOrder: i + 1 })),
    });
    await prisma.projectOutcome.createMany({
      data: children.outcomes.map((o, i) => ({ ...o, projectId: proj.id, sortOrder: i + 1 })),
    });
    for (const m of children.media) {
      await prisma.mediaAsset.upsert({
        where: { id: m.id },
        update: { url: m.url, alt: m.alt, caption: m.caption, projectId: proj.id },
        create: { ...m, type: "IMAGE", projectId: proj.id },
      });
    }
  };

  await seedChildren("soldx-studio", {
    challenges: [
      {
        title: "Five domains, one tenant story",
        description:
          "Inventory, purchasing, sales, finance, and CRM must behave as one transactional system across three interconnected applications — not five silos that drift apart.",
      },
      {
        title: "Paper invoices into matched records",
        description:
          "Invoices arrive as scans and PDFs; matching them to purchase orders means crossing from unstructured documents to strict financial data without losing provenance.",
      },
      {
        title: "Catalogs scattered across marketplaces",
        description:
          "Tenants sell on WooCommerce, PrestaShop, Magento, and Shopify — four platforms, four data shapes, one canonical product catalog.",
      },
    ],
    solutions: [
      {
        title: "Unified multi-tenant schema on PostgreSQL + Prisma",
        description:
          "One shared schema with tenant-scoped domain modules powering three Next.js applications — integration cost concentrated in one shared layer instead of duplicated truth.",
      },
      {
        title: "LLM-powered invoice-to-PO pipeline",
        description:
          "OCR plus structured extraction, validated against the PO schema, with cost-optimized multi-model routing and per-tenant feature flags for controlled rollout.",
      },
      {
        title: "Connector framework with generic ingestion API",
        description:
          "Per-platform adapters translate WooCommerce, PrestaShop, Magento, and Shopify catalogs into one canonical shape — new platforms become a new adapter, not a new subsystem.",
      },
      {
        title: "Natural-language business query assistant",
        description:
          "Non-technical staff query inventory, sales, and finance data directly, reading the same tenant-scoped model the ERP runs on.",
      },
    ],
    outcomes: [
      {
        title: "Production AI in daily operations",
        description:
          "The invoice pipeline runs in production with per-tenant rollout — quality gated by schema validation, cost gated by routing.",
      },
      {
        title: "Self-serve business intelligence",
        description:
          "Staff answer inventory, sales, and finance questions without filing a request to a technical person.",
      },
      {
        title: "Connected commerce",
        description: "Product catalogs sync from four major platforms through one ingestion API.",
      },
    ],
    media: [
      {
        id: "media-soldx-snap",
        url: "/screenshots/snap.png",
        alt: "snap.soldx.tn — storefront builder with template and SEO settings",
        caption: "snap — storefront builder with template and SEO settings",
        createdAt: new Date("2026-09-14T20:00:00Z"),
      },
      {
        id: "media-soldx-deals",
        url: "/screenshots/soldx.png",
        alt: "SoldX discounts page — advanced search, filters, ratings, nearby stores map",
        caption: "Discounts discovery: search, filters, ratings, nearby-store map",
        createdAt: new Date("2026-09-14T20:01:00Z"),
      },
    ],
  });

  await seedChildren("bitmal", {
    challenges: [
      {
        title: "Four roles, one ledger",
        description:
          "Volunteers, Organizations, Merchants, and Donors all hold wallets and transact — the data model must keep every balance and transfer coherent across role boundaries.",
      },
      {
        title: "Trust through controlled access",
        description:
          "A giving ecosystem cannot be open-registration: participants must be known, approved, and accountable.",
      },
    ],
    solutions: [
      {
        title: "Wallet & transaction core on PostgreSQL",
        description:
          "Prisma-modeled wallets and transactions as a single coherent ledger — an internal accounting core, not a blockchain.",
      },
      {
        title: "Auth-gated platform",
        description:
          "Nothing is visible before sign-in or an approved join request — every participant is verified, every action attributable.",
      },
      {
        title: "Remix-based application UX",
        description: "React/Remix application layer with web-standard forms and data flow over the Prisma core.",
      },
    ],
    outcomes: [
      {
        title: "Live at bitmal.org",
        description: "The platform operates as a gated economy connecting the four participant roles.",
      },
      {
        title: "Closed, accountable community",
        description: "Join-request approval keeps the network verified from day one.",
      },
    ],
    media: [
      { id: "media-bitmal-home", url: "/screenshots/Home.png", alt: "BitMal home screen", caption: "BitMal home" },
      { id: "media-bitmal-merchant", url: "/screenshots/Merchant-Home.png", alt: "BitMal merchant home", caption: "Merchant view" },
      { id: "media-bitmal-timeline", url: "/screenshots/User-Profile-Timeline.png", alt: "BitMal user profile timeline", caption: "Profile timeline" },
    ],
  });

  await seedChildren("sunchine", {
    challenges: [
      {
        title: "High-volume customs document processing",
        description:
          "Import/export operations generate relentless paperwork — jobs, certificates, and inspections must move through the system at volume, without loss.",
      },
      {
        title: "A job lifecycle with hard states",
        description:
          "Every job carries its confirmation state — COC (confirmed) versus NCR (not confirmed) — and the workflow must make those states impossible to confuse.",
      },
      {
        title: "Breadth of operations",
        description:
          "Companies, laboratories, exports, inspections, reports, dashboards, and workflows — one platform, many departments, shared data.",
      },
    ],
    solutions: [
      {
        title: "Job-centric workflow",
        description:
          "Add/edit job flows with explicit COC/NCR typing anchor the process — documents and inspections hang off the job record.",
      },
      {
        title: "Full operations suite",
        description:
          "Companies, laboratories, inspections, exports, reports, dashboards, and workflow management built on one Laravel + React core.",
      },
      {
        title: "Practical stack for volume",
        description:
          "Laravel backend, React + TypeScript + Ant Design frontend — proven tooling for form-heavy, table-heavy government work.",
      },
    ],
    outcomes: [
      {
        title: "Used for Iraqi import/export operations",
        description: "The platform streamlines customs document processing at scale.",
      },
      {
        title: "Active maintenance contract",
        description: "Continuous upkeep since 2025 delivery — the client kept the team on.",
        metric: "Ongoing",
      },
    ],
    media: [
      {
        id: "media-sunchine-edit-job",
        url: "/screenshots/Edit-Job-SUNCHINE.png",
        alt: "Sunchine add/edit job screen with COC and NCR types",
        caption: "Add/edit job — COC (confirmed) and NCR (not confirmed) types",
      },
    ],
  });

  await seedChildren("john-dewey-school", {
    challenges: [
      {
        title: "Four audiences, one platform",
        description:
          "Administrators, teachers, students, and parents need different views and permissions over the same school data — with no leaks between roles.",
      },
      {
        title: "The full school surface",
        description:
          "Attendance, timetables, exams, canteen, HR, payments, and student management — each a module schools actually run daily.",
      },
    ],
    solutions: [
      {
        title: "Role-based architecture",
        description:
          "Permission-aware views and actions per role, sharing one student-record core.",
      },
      {
        title: "Modular school operations",
        description:
          "Independent modules over a shared platform — attendance to payments — deployable and evolvable separately.",
      },
    ],
    outcomes: [
      {
        title: "Running the school's daily operations",
        description: "Live at johndewey-school.org since 2026.",
      },
    ],
    media: [
      {
        id: "media-jds-parent-canteen",
        url: "/screenshots/parent-canteen.png",
        alt: "Parent canteen reservation screen — per-day and monthly booking with history",
        caption: "Parent canteen reservations (per day or month) with history",
        createdAt: new Date("2026-09-14T18:00:00Z"),
      },
      {
        id: "media-jds-teacher-instance",
        url: "/screenshots/teacher-instance.png",
        alt: "Teacher home — posts timeline with instance menu sheet",
        caption: "Teacher instance menu: timetable, Notes, Cahier de Liaison, courses, sanctions, complaints",
        createdAt: new Date("2026-09-14T18:01:00Z"),
      },
    ],
  });

  // ---------------- Articles (P3.T5 — content from content/articles/*.md) ----------------
  const readArticle = (slug: string) => {
    const raw = readFileSync(`content/articles/${slug}.md`, "utf8");
    const m = raw.match(/^---\ntitle: "(.+)"\nexcerpt: "(.+)"\ntype: (\w+)\n---\n\n([\s\S]*)$/);
    if (!m) throw new Error(`bad frontmatter in ${slug}`);
    return { title: m[1]!, excerpt: m[2]!, type: m[3] as "ARCHITECTURE" | "AI", content: m[4]!.trim() };
  };
  for (const slug of ["multi-tenant-erp-data-modeling", "multi-model-llm-routing"]) {
    const a = readArticle(slug);
    await prisma.article.upsert({
      where: { slug },
      update: { title: a.title, excerpt: a.excerpt, content: a.content, articleType: a.type, published: true, publishedAt: new Date("2026-09-14") },
      create: {
        slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        articleType: a.type,
        published: true,
        publishedAt: new Date("2026-09-14"),
      },
    });
  }

  // ---------------- Admin credential (P4.T2 — D-P4-1) ----------------
  // Password from ADMIN_INITIAL_PASSWORD, hashed via better-auth/crypto.
  // Plaintext never stored; rotate the env var + delete the account row to reset.
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (adminPassword) {
    
    const admin = await prisma.user.upsert({
      where: { email: "haroun@mahd.group" },
      update: { emailVerified: true },
      create: {
        id: "admin-user",
        name: "Haroun Oujihi",
        email: "haroun@mahd.group",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const cred = await prisma.account.findFirst({
      where: { userId: admin.id, providerId: "credential" },
    });
    if (!cred) {
      await prisma.account.create({
        data: {
          id: "admin-credential",
          userId: admin.id,
          accountType: "credential",
          providerId: "credential",
          accountId: admin.id,
          password: await hashPassword(adminPassword),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    await prisma.adminUser.upsert({
      where: { email: "haroun@mahd.group" },
      update: { role: "ADMIN" },
      create: { email: "haroun@mahd.group", name: "Haroun Oujihi", role: "ADMIN" },
    });
  }

  // ---------------- Home "Signals" stats (owner-editable via /admin/stats) ----------------
  const stat = (value: string, label: string, sortOrder: number) =>
    prisma.stat.upsert({
      where: { id: `stat-${sortOrder}` },
      update: { value, label, sortOrder },
      create: { id: `stat-${sortOrder}`, value, label, sortOrder },
    });
  await stat("10+", "years shipping software", 1);
  await stat("6", "companies, 3 countries", 2);
  await stat("4", "industries: ERP · fintech · gov · edtech", 3);
  await stat("3", "languages: AR · EN · FR", 4);

  // Certifications: none on record — intentionally empty (honest portfolio).
  console.log(
    "Seed complete: profile, admin, 19 technologies, 24 skills, 1 education, 6 experiences, 4 projects + case-study content, 2 articles (published)."
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

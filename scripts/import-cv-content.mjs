// Content pipeline: CV-derived facts → Project/Experience tables (source of truth = this script).
// Runs in the build. Upserts by slug/companySlug; description enrichment is append-style + idempotent.
import "dotenv/config";
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// ---------- Projects ----------

const projects = [
  {
    slug: "applibtp",
    name: "AppliBtp",
    shortDescription:
      "Modular BTP SaaS for construction companies: site operations, task management, quotes with client confirmation, procurement and equipment inventories — web + React Native mobile.",
    longDescription:
      "AppliBtp is a modular SaaS platform for construction companies (BTP — bâtiment et travaux publics). Each module stands alone but shares one operational core: Site Operations (attendance on site, working time, vacations), Tasks, Commercial (quotes with a client confirmation workflow), Procurement (provider order requests), and Fleet & Equipment (inventories of articles, vehicles and machines).\n\nTask management is where the product earns its keep. Construction work is crew work: tasks belong to sites, carry assignments and status, and have to survive the reality of field conditions — which is why the React Native mobile app carries the operational load for field workers while the web app handles quoting and management.\n\nThe data model grouped into modules, at a glance:\n\n```\nCompany\n├─ Sites ──────── attendance, working time, vacations\n├─ Tasks ──────── assignments, status, site reference\n├─ Quotes ─────── lines, client confirmation workflow\n├─ Procurement ── provider order requests\n└─ Equipment ──── articles, vehicles, machines\nEvery entity answers to a company — one tenant, its sites, its crews.\n```\n\nI chose the technology stack (Node.js & MongoDB, React.js web, React Native mobile), designed the database and interfaces, deployed the environments, developed across API, mobile and web, and led the development team.",
    role: "Lead & Full Stack Developer — tech choices, DB & interface design, team leading",
    clientName: null,
    market: "Tunisia — construction (BTP) companies",
    industry: "CONSTRUCTION",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 6,
    tech: ["Node.js", "MongoDB", "React", "React Native"],
  },
  {
    slug: "printaura",
    name: "Printaura",
    shortDescription:
      "Print-on-demand fulfillment automation: orders flow in from shops on eight commerce platforms, get produced by partner factories and printers, and ship — with zero manual steps.",
    longDescription:
      "Printaura automated print-on-demand fulfillment end to end. Merchants connect their shops — Etsy, Shopify, Ecwid, OpenCart, PrestaShop, Americommerce, eBay, LemonStand — and the platform pulls orders in, routes them to the right factory or printer for production, tracks them through fulfillment, and syncs status back to the shop where the customer bought.\n\nTwo flows had to stay in lockstep: catalog (products and variants pushed from the shop and kept in sync) and orders (ingested from every platform, matched to a production partner, and followed until shipped). The hard part was never one integration — it was keeping eight of them truthful against one operational reality.\n\nI designed the database and interfaces and built the API and web application (PHP & MySQL, jQuery).\n\nLooking back, this was a connector framework plus an order-routing pipeline before I had the names for it: one canonical product/order shape, per-platform adapters translating to it, and new platforms becoming a new adapter rather than a new subsystem. A decade later I built the same pattern — WooCommerce, PrestaShop, Magento, Shopify — as the connector framework of the MAHD ERP.",
    role: "Full Stack Developer — DB & interface design, API & web development",
    clientName: null,
    market: "Global — e-commerce sellers (US/EU platforms)",
    industry: "ECOMMERCE",
    projectType: "API_PLATFORM",
    startDate: "2014-11-01",
    endDate: "2016-09-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 7,
    tech: ["PHP", "MySQL", "Node.js"],
  },
  {
    slug: "greenride",
    name: "GreenRide",
    shortDescription:
      "Mobile-first trip management: clients request rides, drivers accept and navigate, smart notifications keep both sides in sync in real time.",
    longDescription:
      "GreenRide is a web and mobile application for managing trips. Clients make trip requests; drivers see, accept and manage them; and smart notifications make the request flow efficient — matching requests to the right driver without phone-call ping-pong.\n\nThe mobile experience is the product: drivers and clients live in the app, not behind a desk, so the React Native app carries the core flows — requests, acceptance, trip state — while the web console handles management.\n\nI made the technology choices (Node.js & MongoDB, React.js, React Native), designed the database and interfaces, and built across API, mobile and web as part of the Genext-IT team.",
    role: "Full Stack & Mobile Developer — tech choices, DB & interface design",
    clientName: null,
    market: "Tunisia",
    industry: "TRAVEL",
    projectType: "MOBILE_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 8,
    tech: ["Node.js", "MongoDB", "React", "React Native"],
  },
  {
    slug: "odesco",
    name: "Odesco",
    shortDescription:
      "Multi-school SaaS: one school-management product serving six schools — admins, teachers, students and parents on one platform.",
    longDescription:
      "Odesco is a full school-management platform that runs six schools on one product: ICFIP, SUPTECH, Mondial School, La Renaissance, John Dewey School and Al-Andalusia Academy.\n\nOne product serving many schools forces the discipline that later became second nature: every school's data stays separate, every school gets the same product, and configuration differences live in data — not in forks. That is multi-tenant SaaS, learned by shipping it.\n\nI made the technology choices (Node.js & MongoDB, React.js, React Native, Ionic), designed the database and interfaces, deployed the environments, and built across API, mobile and web while leading part of the team.",
    role: "Lead & Full Stack Developer — tech choices, DB & interface design, team leading",
    clientName: null,
    market: "Tunisia — private schools",
    industry: "EDTECH",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 9,
    tech: ["Node.js", "MongoDB", "React", "React Native", "Ionic"],
  },
  {
    slug: "youth-to-professionals",
    name: "Youth To Professionals (Y2PRO)",
    shortDescription:
      "Mentorship non-profit platform: rigorous mentor–mentee matching, programs (Mentorship, Coaching), workshops and events — Directus headless CMS + Remix.",
    longDescription:
      "Youth To Professionals is a non-profit connecting young people with industry mentors. The platform runs its whole operation: structured programs (Mentorship Program, Coaching Program), workshops and courses, events, and the two intake flows that power the mission — become-a-mentor and become-a-mentee request forms with a rigorous matching process behind them.\n\nArchitecture: Directus as headless CMS, React Remix as the application layer. The organization team manages programs, content and media in Directus; the Remix app renders it and owns the interactive flows. Content and application concerns stay cleanly separated — the non-profit staff publish without touching code.\n\nBuilt end to end for the client: CMS modeling, application build and deployment. Live at youthtoprofessionals.org.",
    role: "Full Stack Developer — CMS modeling, application build, deployment (client project)",
    clientName: "Youth To Professionals (non-profit)",
    market: "Youth mentorship community",
    industry: "EDTECH",
    projectType: "WEB_APP",
    startDate: "2025-01-01",
    endDate: null,
    isCurrent: true,
    status: "LIVE",
    featured: false,
    sortOrder: 5,
    liveUrl: "https://www.youthtoprofessionals.org/",
    tech: ["React", "Node.js", "PostgreSQL"],
  },
  {
    slug: "doyour-events",
    name: "DoYourEvents",
    shortDescription:
      "Event management platform: create events from reusable templates, manage participants, and coordinate service providers.",
    longDescription:
      "DoYourEvents lets organizers run events end to end: events and participants managed from reusable event templates, with built-in communication flows to service providers.\n\nBuilt with Node.js & MongoDB on the API and Angular 8 on the front end.",
    role: "Full Stack Developer",
    clientName: null,
    market: "Event organizers",
    industry: "OTHER",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 10,
    tech: ["Node.js", "MongoDB", "Angular"],
  },
  {
    slug: "kalisteco",
    name: "Kalisteco",
    shortDescription:
      "Employee task management with automatic Gantt-chart generation for planning visibility.",
    longDescription:
      "Kalisteco manages employee tasks and generates Gantt charts from them — planning visibility without manual chart maintenance.\n\nBuilt with Node.js & MongoDB on the API and Angular 6 on the front end.",
    role: "Full Stack Developer",
    clientName: null,
    market: "Team leads and planners",
    industry: "SAAS",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 11,
    tech: ["Node.js", "MongoDB", "Angular"],
  },
  {
    slug: "fabulous",
    name: "Fabulous",
    shortDescription:
      "Cosmetics e-commerce with an integrated training program — storefront, orders and training management on web and mobile.",
    longDescription:
      "Fabulous sells cosmetic products online and manages the training program around them — commerce and education in one platform, on web and React Native mobile.\n\nBuilt with Node.js & MySQL on the API, React.js web and React Native mobile.",
    role: "Full Stack Developer",
    clientName: null,
    market: "Cosmetics retail",
    industry: "ECOMMERCE",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 12,
    tech: ["Node.js", "MySQL", "React", "React Native"],
  },
  {
    slug: "goyoga",
    name: "GoYoga",
    shortDescription:
      "Online yoga teaching platform — classes and content for remote learners.",
    longDescription:
      "GoYoga teaches yoga online: a platform for classes and learning content, built with PHP and Vue.js. I participated in the web application development.",
    role: "Web Developer (participation)",
    clientName: null,
    market: "Online learners",
    industry: "OTHER",
    projectType: "WEB_APP",
    startDate: "2019-05-01",
    endDate: "2022-03-01",
    isCurrent: false,
    status: "ARCHIVED",
    featured: false,
    sortOrder: 13,
    tech: ["PHP"],
  },
];

// ensure framework technologies exist (idempotent)
for (const [name, slug, cat] of [["Angular", "angular", "FRONTEND"], ["Vue.js", "vuejs", "FRONTEND"]]) {
  await client.query(
    `INSERT INTO "Technology" (id, name, slug, category) VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3::"TechCategory") ON CONFLICT (slug) DO NOTHING`,
    [name, slug, cat],
  );
}

for (const p of projects) {
  await client.query(
    `INSERT INTO "Project" (id, name, slug, "shortDescription", "longDescription", role, "clientName", market, industry, "projectType",
       "startDate", "endDate", "isCurrent", status, featured, "sortOrder", published, "createdAt", "updatedAt")
     VALUES (md5(random()::text || clock_timestamp()::text), $1,$2,$3,$4,$5,$6,$7,$8::"Industry",$9::"ProjectType",
       $10,$11,$12,$13::"ProjectStatus",$14,$15,true, now(), now())
     ON CONFLICT (slug) DO UPDATE
       SET name=$1, "shortDescription"=$3, "longDescription"=$4, role=$5, market=$7, industry=$8::"Industry",
           "projectType"=$9::"ProjectType", "startDate"=$10, "endDate"=$11, status=$13::"ProjectStatus", "sortOrder"=$15, published=true, "updatedAt"=now()`,
    [p.name, p.slug, p.shortDescription, p.longDescription, p.role, p.clientName, p.market, p.industry, p.projectType,
     p.startDate, p.endDate, p.isCurrent, p.status, p.featured, p.sortOrder],
  );

  // link technologies that already exist in the Technology table (match by name or slug)
  for (const t of p.tech) {
    await client.query(
      `INSERT INTO "ProjectTechnology" ("projectId", "technologyId", importance)
       SELECT p.id, t.id, 'PRIMARY' FROM "Project" p, "Technology" t
       WHERE p.slug = $1 AND (LOWER(t.name) = LOWER($2) OR t.slug = LOWER(REPLACE($2, ' ', '-')))
       ON CONFLICT ("projectId", "technologyId") DO UPDATE SET importance = 'PRIMARY'`,
      [p.slug, t],
    );
  }
  console.log(`project: ${p.slug}`);
}

// ---------- Experience: MAHD first stint ----------

await client.query(
  `INSERT INTO "Experience" (id, "companyName", "companySlug", "jobTitle", "employmentType", location,
     "startDate", "endDate", "isCurrent", summary, description, "sortOrder", published, "createdAt", "updatedAt")
   VALUES (md5(random()::text || clock_timestamp()::text), 'MAHD', 'mahd-2012', 'Developer (office systems)', 'FULL_TIME', 'Tunisia',
     '2012-02-01', '2013-12-01', false,
     'First stint at MAHD — desktop and web tooling for daily operations.',
     'Built office applications with vb.NET for daily operations: an inventory management application, a point-of-sale system named Tasswia, and sales and purchasing management tools, plus static and dynamic websites (vb.NET, SQL Server, PHP, MySQL, jQuery).',
     7, true, now(), now())
   ON CONFLICT ("companySlug") DO NOTHING`,
);
console.log("experience: mahd-2012");

// ---------- Experience enrichment (append-style, idempotent) ----------

const enrichments = [
  {
    slug: "genext-it",
    block:
      "\n\nProjects delivered: AppliBtp — construction-site management (BTP) web + React Native mobile: attendance, working time, vacations, tasks, quotes with client confirmation, provider orders, article/vehicle/machine inventories (led the team). GreenRide — trip management with driver–client communication and smart notifications. Odesco — full school management deployed across six schools (ICFIP, SUPTECH, Mondial School, La Renaissance, John Dewey School, Al-Andalusia Academy). DoYourEvents — event and participant management with templates and provider communication. Kalisteco — employee tasks with Gantt charts. Fabulous — cosmetics e-commerce with training management. GoYoga — online yoga teaching platform.",
  },
  {
    slug: "pagesqatar",
    block:
      "\n\nProjects delivered: NUTree (Oxy-companies) — stock and product presentation web app. SMS sending manager. Mobile applications: Lentille, Jamally, Tamwin Online (Ionic 3). Market: Qatar.",
  },
  {
    slug: "tunisie-technologie",
    block:
      "\n\nProjects delivered: Printaura — e-commerce automation consuming the APIs of eight commerce platforms (Etsy, Shopify, Ecwid, OpenCart, PrestaShop, Americommerce, eBay, LemonStand); the precursor pattern of the connector framework later built at MAHD.",
  },
  {
    slug: "ncs-tunisia",
    block:
      "\n\nProjects delivered: Link-voyages — travel agency website. Waiter — a mobile application for waiters to send orders offline to the right point-of-sale terminal.",
  },
];

for (const e of enrichments) {
  await client.query(
    `UPDATE "Experience" SET description = description || $2, "updatedAt" = now()
     WHERE "companySlug" = $1 AND description NOT LIKE '%Projects delivered:%'`,
    [e.slug, e.block],
  );
}
console.log("experience enrichments applied");

// ---------- Experience achievements (visible cards on /experience) ----------

const achievements = {
  "genext-it": [
    ["AppliBtp — construction-site management (BTP)", "Web + React Native mobile platform covering attendance, working time, vacations, tasks, quotes with client confirmation, provider orders and article/vehicle/machine inventories. Tech choices, DB & interface design, team leading.", "Team of developers, 6+ construction clients"],
    ["Odesco — school management across six schools", "Full school-management product deployed for ICFIP, SUPTECH, Mondial School, La Renaissance, John Dewey School and Al-Andalusia Academy.", "6 schools on one product"],
    ["DoYourEvents — event & participant management", "Event management with reusable templates and service-provider communication (Node.js & MongoDB, Angular 8).", null],
    ["Fabulous — cosmetics e-commerce & trainings", "Web + React Native mobile commerce with training management (Node.js & MySQL).", null],
  ],
  "pagesqatar": [
    ["NUTree (Oxy-companies) — stock & product presentation", "Web application for stock management and product presentation (Node.js & MongoDB, Angular 5).", null],
    ["Mobile applications — Lentille, Jamally, Tamwin Online", "Mobile apps built with Ionic 3 for the Qatari market.", "3 apps shipped"],
  ],
  "tunisie-technologie": [
    ["Printaura — e-commerce automation across 8 platforms", "Auto-managed e-commerce products and orders by consuming the APIs of Etsy, Shopify, Ecwid, OpenCart, PrestaShop, Americommerce, eBay and LemonStand — the precursor pattern of the connector framework later built at MAHD.", "8 platform APIs"],
  ],
  "ncs-tunisia": [
    ["Waiter — offline-first ordering for restaurants", "Mobile application letting waiters send orders offline to the correct point-of-sale terminal (Java & vb.NET).", null],
    ["Link-voyages — travel agency website", "Travel agency website (PHP & MySQL, jQuery).", null],
  ],
  "mahd-2012": [
    ["Tasswia — point-of-sale system", "POS plus inventory and sales/purchasing management applications built in vb.NET with SQL Server.", null],
  ],
};

for (const [slug, items] of Object.entries(achievements)) {
  for (let i = 0; i < items.length; i++) {
    const [title, description, metric] = items[i];
    await client.query(
      `INSERT INTO "ExperienceAchievement" (id, "experienceId", title, description, metric, "sortOrder")
       SELECT md5(random()::text || clock_timestamp()::text), e.id, $2, $3, $4, 100 + $5
       FROM "Experience" e WHERE e."companySlug" = $1
       AND NOT EXISTS (SELECT 1 FROM "ExperienceAchievement" a WHERE a."experienceId" = e.id AND a.title = $2)`,
      [slug, title, description, metric, i],
    );
  }
}
console.log("achievements applied");

// ---------- Cleanup: remove thin seeded duplicates superseded by detailed achievements ----------

const superseded = [
  ["pagesqatar", "Nutree"],
  ["pagesqatar", "Mobile applications"],
  ["tunisie-technologie", "Printaura"],
];
for (const [slug, title] of superseded) {
  await client.query(
    `DELETE FROM "ExperienceAchievement" a USING "Experience" e
     WHERE a."experienceId" = e.id AND e."companySlug" = $1 AND a.title = $2`,
    [slug, title],
  );
}
console.log("superseded achievements removed");

await client.end();

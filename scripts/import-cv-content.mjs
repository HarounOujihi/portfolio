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
      "Construction-site management platform (BTP): attendance, working time, vacations, tasks, client-confirmed quotes, provider orders and equipment inventories — web + React Native mobile.",
    longDescription:
      "AppliBtp is a web and mobile application built for construction companies (BTP — bâtiment et travaux publics). It manages the operational reality of construction sites: employee attendance on site, working-time tracking, vacations and task assignment. Commercially it covers the quote lifecycle including a client confirmation process, provider order requests, and inventories of articles, vehicles and machines.\n\nI chose the technology stack (Node.js & MongoDB, React.js web, React Native mobile), designed the database and interfaces, deployed the environments, developed across API, mobile and web, and led the development team.\n\nThe construction context shaped the product: site workers, not office users, drive the data — so the mobile experience carries the operational load while the web app handles quoting and management.",
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
    sortOrder: 5,
    tech: ["Node.js", "MongoDB", "React", "React Native"],
  },
  {
    slug: "printaura",
    name: "Printaura",
    shortDescription:
      "E-commerce automation platform: products and orders managed automatically by consuming the APIs of eight commerce platforms — Etsy, Shopify, eBay, PrestaShop and more.",
    longDescription:
      "Printaura auto-manages e-commerce products and orders by consuming the APIs of commerce platforms: Etsy, Shopify, Ecwid, OpenCart, PrestaShop, Americommerce, eBay and LemonStand. Merchants connect their stores once; the platform keeps catalog and orders in sync across all of them.\n\nI designed the database and interfaces and built the API and web application (PHP & MySQL, jQuery).\n\nLooking back, this was a connector framework before I had the name for it: one canonical product/order shape, per-platform adapters translating to it, and new platforms becoming a new adapter rather than a new subsystem. A decade later I built the same pattern — WooCommerce, PrestaShop, Magento, Shopify — as the connector framework of the MAHD ERP.",
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
    sortOrder: 6,
    tech: ["PHP", "MySQL", "Node.js"],
  },
];

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
       SELECT p.id, t.id, 'SECONDARY' FROM "Project" p, "Technology" t
       WHERE p.slug = $1 AND (LOWER(t.name) = LOWER($2) OR t.slug = LOWER(REPLACE($2, ' ', '-')))
       ON CONFLICT DO NOTHING`,
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
    ["GreenRide — trip management", "Web + mobile trips platform with driver–client communication and smart notifications.", null],
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

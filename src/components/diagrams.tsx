import type { ReactNode } from "react";

/**
 * Hand-crafted architecture diagrams (P3.T3) — simplified, honest views of each
 * system using only owner-confirmed facts. currentColor + theme vars so they
 * adapt to light mode automatically. Legible at 360px via tap-to-expand lightbox.
 */

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={accent ? "var(--color-brand-soft)" : "none"}
        stroke="currentColor"
        strokeOpacity={accent ? 0.9 : 0.45}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 5}
        textAnchor="middle"
        fontSize={16}
        fontWeight={600}
        fill="currentColor"
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 16} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.65}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#arrow)" />
  );
}

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 720 400" className="w-full" role="img">
      <title>{title}</title>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function DiagramSoldx() {
  return (
    <Frame title="SoldX ecosystem — apps, core, and the AI layer">
      {/* product line */}
      <Box x={20} y={40} w={190} h={56} label="snap.soldx.tn" sub="storefront builder · SEO · templates" />
      <Box x={20} y={170} w={190} h={56} label="soldx.tn" sub="multi-tenant ERP" />
      <Box x={20} y={300} w={190} h={56} label="studio.soldx.tn" sub="mobile-first ERP" />
      <Arrow x1={210} y1={68} x2={300} y2={185} />
      <Arrow x1={210} y1={198} x2={300} y2={198} />
      <Arrow x1={210} y1={328} x2={300} y2={215} />
      {/* multi-tenant core */}
      <Box x={300} y={130} w={180} h={140} label="Multi-tenant core" sub="Next.js · Prisma · PostgreSQL" accent />
      {/* AI layer */}
      <Arrow x1={480} y1={160} x2={510} y2={76} />
      <Arrow x1={480} y1={200} x2={510} y2={176} />
      <Box x={510} y={40} w={190} h={72} label="AI assistant + agent" sub="multilingual · read-only" accent />
      {/* data + ops layer */}
      <Box x={510} y={140} w={190} h={64} label="Invoice pipeline" sub="OCR → extract → PO match" />
      <Box x={510} y={216} w={190} h={64} label="Deals discovery" sub="discounts · map · ratings" />
      <Box x={510} y={292} w={190} h={64} label="Connector framework" sub="4 marketplaces → 1 API" />
      <Arrow x1={480} y1={200} x2={510} y2={324} />
    </Frame>
  );
}

export function DiagramBitmal() {
  return (
    <Frame title="BitMal — wallets and roles">
      <Box x={40} y={40} w={170} h={56} label="Volunteers" />
      <Box x={510} y={40} w={170} h={56} label="Donors" />
      <Box x={40} y={300} w={170} h={56} label="Organizations" />
      <Box x={510} y={300} w={170} h={56} label="Merchants" />
      <Arrow x1={125} y1={96} x2={290} y2={170} />
      <Arrow x1={595} y1={96} x2={430} y2={170} />
      <Arrow x1={125} y1={300} x2={290} y2={230} />
      <Arrow x1={595} y1={300} x2={430} y2={230} />
      <Box x={250} y={150} w={220} h={100} label="Wallets & transactions" sub="Prisma · PostgreSQL ledger" accent />
      <Box x={250} y={330} w={220} h={50} label="Auth gate — join approval" />
      <Arrow x1={360} y1={330} x2={360} y2={250} />
    </Frame>
  );
}

export function DiagramSunchine() {
  return (
    <Frame title="Sunchine — job-centric customs workflow">
      <Box x={250} y={40} w={220} h={72} label="Job" sub="COC (confirmed) · NCR (not confirmed)" accent />
      <Arrow x1={310} y1={112} x2={120} y2={180} />
      <Arrow x1={360} y1={112} x2={360} y2={180} />
      <Arrow x1={410} y1={112} x2={600} y2={180} />
      <Box x={40} y={180} w={160} h={56} label="Inspections" />
      <Box x={280} y={180} w={160} h={56} label="Laboratories" />
      <Box x={520} y={180} w={160} h={56} label="Exports" />
      <Box x={40} y={300} w={160} h={56} label="Companies" />
      <Box x={280} y={300} w={160} h={56} label="Workflows" />
      <Box x={520} y={300} w={160} h={56} label="Reports & dashboards" />
      <Arrow x1={120} y1={236} x2={120} y2={300} />
      <Arrow x1={360} y1={236} x2={360} y2={300} />
      <Arrow x1={600} y1={236} x2={600} y2={300} />
    </Frame>
  );
}

export function DiagramJohnDewey() {
  return (
    <Frame title="John Dewey — roles and modules">
      <Box x={40} y={40} w={150} h={50} label="Admins" />
      <Box x={285} y={40} w={150} h={50} label="Teachers" />
      <Box x={530} y={40} w={150} h={50} label="Students" />
      <Box x={285} y={110} w={150} h={50} label="Parents" />
      <Arrow x1={115} y1={90} x2={300} y2={190} />
      <Arrow x1={360} y1={90} x2={360} y2={190} />
      <Arrow x1={605} y1={90} x2={420} y2={190} />
      <Arrow x1={360} y1={160} x2={360} y2={190} />
      <Box x={160} y={190} w={400} h={64} label="Role-based platform core" accent />
      <Box x={40} y={300} w={190} h={56} label="Attendance · Timetables" />
      <Box x={265} y={300} w={190} h={56} label="Exams · Canteen" />
      <Box x={490} y={300} w={190} h={56} label="Payments · HR" />
      <Arrow x1={260} y1={254} x2={135} y2={300} />
      <Arrow x1={360} y1={254} x2={360} y2={300} />
      <Arrow x1={460} y1={254} x2={585} y2={300} />
    </Frame>
  );
}

export const DIAGRAMS: Record<string, { title: string; render: () => ReactNode }> = {
  "soldx-studio": { title: "SoldX ecosystem — simplified architecture", render: () => <DiagramSoldx /> },
  bitmal: { title: "BitMal — wallets and roles", render: () => <DiagramBitmal /> },
  sunchine: { title: "Sunchine — job-centric customs workflow", render: () => <DiagramSunchine /> },
  "john-dewey-school": { title: "John Dewey — roles and modules", render: () => <DiagramJohnDewey /> },
};

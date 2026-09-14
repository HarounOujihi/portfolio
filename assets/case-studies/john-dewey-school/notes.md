import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPeriod } from "@/lib/format";

# John Dewey School — case study notes (P0.T2 / updated 2026-09-14)

## Facts (CV + owner)

- **Period:** 2026 (year precision — recent/current; seed: `startDate = 2026-01-01`, `isCurrent` per owner).
- **Product:** johndewey-school.org — role-based school management platform for administrators, teachers,
  students, parents. Modules: attendance, timetables, exams, canteen, HR, payments, student management.
- **Teacher instance (owner-described):** home = posts timeline; instance menu sheet contains:
  Emploi du temps (timetable), Notes (grade entry), Cahier de Liaison (homework), Cours (courses),
  Recherche (search), Sanctions, Réclamations (from parents or admin), Commentaires.
- **Parent side:** near-identical menu plus canteen, présences (attendance), paiements — **per selected child**.
- **Screenshots provided:**
  - `teacher-instance.png` — teacher home (posts timeline) + instance menu sheet
  - `parent-canteen.png` — **owner: most important** — parent canteen reservations (per day or month), history
- **Role:** lead across the full product lifecycle — phasing, idea iteration, stack decisions, team leadership + hands-on dev.

## Screenshots

Both live: seeded as MediaAssets (canteen first), shown on the home bento card + case-study gallery.

## Still needed (owner)

- [ ] 2–3 outcome metrics (users, schools, transactions?): ____________
- [ ] Architecture diagram source (draw.io/Excalidraw → SVG in Phase 3)
- [ ] Client-name decision (CONFIDENTIAL #3): ____________

import type { ReactNode } from "react";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteTracker } from "@/components/site-tracker";
import { AssistantFab } from "@/components/assistant/assistant-fab";

/** Public site chrome — header/footer wrap every (site) route. */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const profile = await prisma.profile.findUnique({ where: { id: "profile" }, select: { cvUrl: true } });
  const cvUrl = profile?.cvUrl ?? "/haroun-oujihi-cv.pdf";

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader cvUrl={cvUrl} />
      <SiteTracker />
      <AssistantFab />
      <div className="flex-1">{children}</div>
      <SiteFooter cvUrl={cvUrl} />
    </div>
  );
}

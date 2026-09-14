import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** Public site chrome — header/footer wrap every (site) route. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}

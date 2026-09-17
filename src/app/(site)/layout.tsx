import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteTracker } from "@/components/site-tracker";
import { AssistantFab } from "@/components/assistant/assistant-fab";

/** Public site chrome — header/footer wrap every (site) route. */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [profile, cookieStore] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" }, select: { cvUrl: true, assistantEnabled: true } }),
    cookies(),
  ]);
  const cvUrl = profile?.cvUrl ?? "/haroun-oujihi-cv.pdf";
  // Fast presence check only — real authorization happens server-side in /admin.
  const admin =
    cookieStore.has("better-auth.session_token") || cookieStore.has("__Secure-better-auth.session_token");

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader cvUrl={cvUrl} admin={admin} />
      <SiteTracker />
      {(profile?.assistantEnabled ?? true) && <AssistantFab />}
      <div className="flex-1">{children}</div>
      <SiteFooter cvUrl={cvUrl} />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var els=document.querySelectorAll('[data-reveal]');if(!els.length)return;var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){els.forEach(function(el){el.classList.add('reveal-in');});return;}var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('reveal-in');io.unobserve(en.target);}});},{rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){var r=el.getBoundingClientRect();var inView=r.top<innerHeight&&r.bottom>0;el.classList.add('reveal-hidden');if(inView){requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('reveal-in');});});}else{io.observe(el);}});}catch(e){}})();`,
        }}
      />
    </div>
  );
}

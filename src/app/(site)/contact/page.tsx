import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about roles, projects, or collaborations.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-h2 font-bold tracking-tight">Contact</h1>
      <p className="mt-2 text-lead text-neutral-400">
        Roles, projects, collaborations — messages land directly with me.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside aria-label="Direct contact" className="space-y-4 text-sm">
          <div className="rounded-(--radius-card) bg-white/[0.04] p-5">
            <h2 className="font-semibold">Direct</h2>
            <ul className="mt-3 space-y-2 text-neutral-400">
              <li>
                <a href="mailto:haroun.oujihi@hotmail.com" className="hover:text-neutral-100 hover:underline">
                  haroun.oujihi@hotmail.com
                </a>
              </li>
              <li>
                <a href="tel:+21654443740" className="hover:text-neutral-100 hover:underline">
                  +216 54 443 740
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-(--radius-card) bg-white/[0.04] p-5">
            <h2 className="font-semibold">Elsewhere</h2>
            <ul className="mt-3 space-y-2 text-neutral-400">
              <li>
                <a href="https://github.com/HarounOujihi" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-100 hover:underline">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/haroun-oujihi" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-100 hover:underline">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-neutral-400">
            No account, no tracking — just a message form.
          </p>
        </aside>
      </div>
    </main>
  );
}

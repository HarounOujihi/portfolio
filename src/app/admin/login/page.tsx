import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-neutral-950 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-lg font-bold tracking-tighter">
          HO<span className="text-[var(--brand)]">—</span>26
        </p>
        <h1 className="mt-4 text-xl font-semibold">Admin login</h1>
        <p className="mt-1 text-sm text-neutral-400">Authorized access only.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

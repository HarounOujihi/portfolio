"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = {};

const inputClass =
  "h-12 w-full rounded-(--radius-card) border border-white/20 px-4 text-base outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--color-brand-soft)]";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-(--radius-organic) border border-white/15 bg-white/[0.04] p-8 text-center"
      >
        <p className="text-lg font-semibold">Message received.</p>
        <p className="mt-2 text-sm text-neutral-400">
          Thanks — I will get back to you at the address you provided.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot — hidden from humans, catnip for bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name <span aria-hidden="true">*</span>
          </label>
          <input id="name" name="name" required maxLength={100} className={inputClass} autoComplete="name" />
          {state.fieldErrors?.name && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className={inputClass} autoComplete="email" />
          {state.fieldErrors?.email && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          Subject
        </label>
        <input id="subject" name="subject" maxLength={150} className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea id="message" name="message" required rows={6} maxLength={5000} className="w-full rounded-(--radius-card) border border-white/20 p-4 text-base outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--color-brand-soft)]" />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.error && !state.fieldErrors && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-8 font-medium text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

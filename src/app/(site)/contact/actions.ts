"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientIp, limiters } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  // Honeypot — real users never fill this (§ spam mechanism for D-P0-1 option (a))
  website: z.string().max(0).optional(),
});

export interface ContactState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: { name: string; email: string; subject: string; message: string };
}

const FRIENDLY: Record<string, string> = {
  name: "Please enter your name (at least 2 characters).",
  email: "Please enter a valid email address.",
  subject: "Subject is a bit long — 150 characters max.",
  message: "Your message is a little short — at least 10 characters, so I can answer properly.",
  website: "Something went wrong.",
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: silently "succeed" so bots learn nothing.
  if ((formData.get("website") ?? "").toString().length > 0) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") ?? "",
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = FRIENDLY[key] ?? "Please check this field.";
    }
    const values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };
    return { error: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const ip = getClientIp(await headers());
  const limit = await limiters.contact.limit(ip);
  if (!limit.success) {
    const values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };
    return {
      error: `Too many messages — please wait ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
      values,
    };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export async function saveProfile(formData: FormData): Promise<void> {
  await requireAdmin();
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 100);
  const headline = String(formData.get("headline") ?? "").trim().slice(0, 160);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const shortBio = String(formData.get("shortBio") ?? "").trim();
  const longBio = String(formData.get("longBio") ?? "").trim();
  if (!fullName || !headline || !email || !shortBio || !longBio) return;

  await prisma.profile.update({
    where: { id: "profile" },
    data: {
      fullName,
      headline,
      email,
      shortBio,
      longBio,
      phone: String(formData.get("phone") ?? "").trim().slice(0, 40) || null,
      location: String(formData.get("location") ?? "").trim().slice(0, 120) || null,
      availability: String(formData.get("availability") ?? "").trim().slice(0, 120) || null,
      yearsExperience: num(formData.get("yearsExperience")),
      githubUrl: String(formData.get("githubUrl") ?? "").trim().slice(0, 300) || null,
      linkedinUrl: String(formData.get("linkedinUrl") ?? "").trim().slice(0, 300) || null,
      cvUrl: String(formData.get("cvUrl") ?? "").trim().slice(0, 300) || null,
      avatarUrl: String(formData.get("avatarUrl") ?? "").trim().slice(0, 300) || null,
      heroImageUrl: String(formData.get("heroImageUrl") ?? "").trim().slice(0, 300) || null,
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/", "layout");
  redirect("/admin/profile?saved=1");
}

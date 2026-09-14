import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

/**
 * Admin file upload (P4.T11, D-P4-2 = Vercel Blob).
 * kind=image (default): images for project galleries.
 * kind=document: CV PDFs — stored under cv/, replaces the public CV when saved.
 *
 * Storage: Vercel Blob when BLOB_READ_WRITE_TOKEN is set (required in
 * production). Local dev fallback writes into public/uploads so the flow
 * works end to end without an account; on Vercel the filesystem is
 * read-only, so the fallback is disabled there by design.
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "image");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return Response.json({ error: "Max file size is 8 MB." }, { status: 400 });
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (kind === "document" && !isPdf) {
    return Response.json({ error: "Only PDF files are accepted for the CV." }, { status: 400 });
  }
  if (kind === "image" && !file.type.startsWith("image/")) {
    return Response.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const folder = kind === "document" ? "cv" : "projects";
    const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    url = blob.url;
  } else if (process.env.VERCEL) {
    return Response.json(
      { error: "Image storage not configured — connect a Blob store in Vercel (Storage tab)." },
      { status: 501 },
    );
  } else {
    // Local dev fallback: write into public/uploads (served statically in dev).
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const name = `${Date.now()}-${safeName}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    url = `/uploads/${name}`;
  }

  return Response.json({ url });
}

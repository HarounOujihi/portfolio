import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

/**
 * Admin file upload (P4.T11, D-P4-2 = Vercel Blob).
 * kind=image (default): images for project galleries.
 * kind=document: CV PDFs — stored under cv/, replaces the public CV when saved.
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "File storage not configured — connect a Blob store in Vercel (Storage tab)." },
      { status: 501 },
    );
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

  const folder = kind === "document" ? "cv" : "projects";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return Response.json({ url: blob.url });
}

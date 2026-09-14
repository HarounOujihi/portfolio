import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

/**
 * Admin image upload (P4.T11, D-P4-2 = Vercel Blob).
 * Requires BLOB_READ_WRITE_TOKEN (Vercel dashboard → Storage → Blob → connect).
 * The media editor also accepts pasted image links — upload is optional.
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers }).catch(() => null);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: "Image storage not configured — connect a Blob store in Vercel (Storage tab), or paste an image link instead." },
      { status: 501 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return Response.json({ error: "Max file size is 8 MB." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`projects/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return Response.json({ url: blob.url });
}

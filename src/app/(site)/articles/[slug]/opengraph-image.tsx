import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

interface Params {
  params: Promise<{ slug: string }>;
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: Params) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    select: { title: true, articleType: true },
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#eef4fb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 14, borderRadius: 9999, background: "#026fd7", display: "flex" }} />
          <div style={{ fontSize: 30, color: "#475569", display: "flex" }}>
            Haroun Oujihi — Engineering
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: article && article.title.length > 40 ? 52 : 68,
            fontWeight: 700,
            color: "#0f172a",
            marginTop: 24,
          }}
        >
          {article?.title ?? "Article"}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#475569", marginTop: 20 }}>
          {article?.articleType ?? ""}
        </div>
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Haroun Oujihi — Lead Full Stack Engineer";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 14, borderRadius: 9999, background: "#6aa7f4", display: "flex" }} />
          <div style={{ fontSize: 30, color: "#a3a3a3", display: "flex" }}>
            Portfolio — harounoujihi.vercel.app
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 110, fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em" }}>
            HAROUN
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 700,
              color: "#0a0a0a",
              letterSpacing: "-0.02em",
              WebkitTextStroke: "2px #6aa7f4",
            }}
          >
            OUJIHI
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#d4d4d4", marginTop: 28 }}>
            Lead Full Stack Engineer — SaaS · ERP · Applied AI
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 9999, border: "1px solid #404040", padding: "10px 24px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#34d399", display: "flex" }} />
            <div style={{ fontSize: 26, color: "#d4d4d4", display: "flex" }}>Open to opportunities</div>
          </div>
          <div style={{ fontSize: 26, color: "#737373", display: "flex" }}>10+ years · SaaS · ERP · AI</div>
        </div>
      </div>
    ),
    size
  );
}

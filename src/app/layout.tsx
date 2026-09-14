import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

/* Site identity font — editorial direction adopted from the demo template (owner decision 2026-09-14) */
const siteFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-site" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Haroun Oujihi — Lead Full Stack Engineer",
    template: "%s | Haroun Oujihi",
  },
  description:
    "SaaS & ERP architecture with applied AI/LLM integration in production. 10+ years building multi-tenant platforms end to end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${siteFont.variable} bg-background font-sans text-foreground antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

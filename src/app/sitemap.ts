import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  // No /admin — owner requirement: no public pointers to the admin area.
  const routes = ["", "/projects", "/experience", "/engineering", "/about", "/contact"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}

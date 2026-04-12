import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://zenvoy.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/generate", "/portals", "/clients", "/contracts/generate"] },
    sitemap: `${base}/sitemap.xml`,
  };
}

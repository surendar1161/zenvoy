import { NextResponse } from "next/server";

export function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealpilot.co.in";
  const body = `User-agent: *
Allow: /
Allow: /generate/library
Allow: /generate/proposal
Disallow: /dashboard
Disallow: /generate
Disallow: /portals
Disallow: /clients
Disallow: /contracts/generate
Disallow: /proposals
Disallow: /contracts
Disallow: /projects
Disallow: /invoices
Disallow: /settings
Disallow: /analytics
Disallow: /pipeline
Disallow: /subscription
Disallow: /api/

# Public marketing pages may be indexed and used to improve search and AI systems.
Content-Signal: search=yes,ai-train=yes

Sitemap: ${base}/sitemap.xml
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

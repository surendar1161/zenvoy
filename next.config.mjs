const PRODUCTION_URL = "https://www.dealpilot.co.in";

// A deploy once shipped canonicals, the sitemap and robots.txt pointing at
// zenvoy.vercel.app because NEXT_PUBLIC_APP_URL was wrong in Vercel. On
// production builds, never accept a missing or *.vercel.app value.
const configured = process.env.NEXT_PUBLIC_APP_URL;
const isProductionBuild = process.env.VERCEL_ENV === "production";
let appUrl = configured;
if (isProductionBuild && (!configured || /vercel\.app/i.test(configured))) {
  console.warn(
    `[next.config] NEXT_PUBLIC_APP_URL is "${configured ?? "unset"}" on a production build. Using ${PRODUCTION_URL}. Fix it in Vercel > Settings > Environment Variables.`,
  );
  appUrl = PRODUCTION_URL;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  ...(appUrl ? { env: { NEXT_PUBLIC_APP_URL: appUrl } } : {}),
};
export default nextConfig;

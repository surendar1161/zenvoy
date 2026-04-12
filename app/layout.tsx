import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zenvoy.ai";
const APP_NAME = "Zenvoy";
const TAGLINE = "Your AI Envoy for Every Client Deal";
const DESCRIPTION =
  "Generate professional freelance proposals in seconds with Claude AI. Includes e-signatures, Stripe payment links, client portals, AI contracts, milestone billing, and analytics. Free to start.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "freelance proposal software", "AI proposal generator", "proposal tool for freelancers",
    "freelance contract generator", "client portal software", "freelance invoicing tool",
    "e-signature for freelancers", "proposal with payment link", "Stripe proposal tool",
    "better proposals alternative", "proposify alternative", "freelance CRM",
    "AI contract writer", "freelance project management", "white label proposals",
    "zenvoy", "zenvoy ai", "freelance deal closing software",
  ],
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: [{ url: `${APP_URL}/og-image.png`, width: 1200, height: 630, alt: `${APP_NAME} — AI Proposal Software` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: "@zenvoy_ai",
  },
  alternates: { canonical: APP_URL },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": APP_NAME,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": APP_URL,
  "description": DESCRIPTION,
  "offers": [
    { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free Plan" },
    { "@type": "Offer", "price": "19", "priceCurrency": "USD", "name": "Pro Plan", "billingIncrement": "P1M" },
    { "@type": "Offer", "price": "49", "priceCurrency": "USD", "name": "Business Plan", "billingIncrement": "P1M" },
  ],
  "featureList": [
    "AI Proposal Generation", "Digital E-Signatures", "Stripe Payment Links",
    "Client Portal", "AI Contract Generator", "Milestone Payments",
    "Proposal Analytics", "White-Label Branding", "19+ Templates",
  ],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}

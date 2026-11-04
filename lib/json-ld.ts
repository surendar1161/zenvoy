const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealpilot.co.in";
const APP_NAME = "DealPilot";

export type FaqItem = { q: string; a: string };
export type Crumb = { name: string; path: string };

const CRUMB_LABELS: Record<string, string> = {
  "ai-generators": "AI generators",
  "ai-proposal-generator": "AI proposal generator",
  "free-proposal-maker": "Free proposal maker",
  "proposal-templates": "Proposal templates",
  "proposal-software-for-freelancers": "Proposal software",
  "freelance-crm": "Freelance CRM",
  "best-ai-proposal-writers": "Best AI proposal writers",
  "how-to-write-a-freelance-proposal": "How to write a freelance proposal",
  "how-to-price-freelance-projects": "How to price freelance projects",
  "how-to-follow-up-on-a-proposal": "How to follow up on a proposal",
  "freelance-proposal-examples": "Freelance proposal examples",
  "how-to-generate-a-proposal": "How to generate a proposal",
  "how-to-send-a-proposal": "How to send a proposal",
  "how-to-get-a-proposal-signed": "How to get a proposal signed",
  "e-signatures": "E-signatures",
  "client-portal": "Client portal",
  "web-developers": "Web developers",
  "marketing-agencies": "Marketing agencies",
  "video-production": "Video production",
  "proposal-software": "Proposal software",
  "graphic-design-proposal": "Graphic design proposal",
  "web-design-proposal": "Web design proposal",
  "website-development-proposal": "Website development proposal",
  "consulting-proposal": "Consulting proposal",
  "copywriting-proposal": "Copywriting proposal",
  "marketing-proposal": "Marketing proposal",
  "video-production-proposal": "Video production proposal",
  "brand-identity-proposal": "Brand identity proposal",
  "freelance-proposal": "Freelance proposal",
  "retainer-proposal": "Retainer proposal",
};

function humanize(slug: string) {
  if (CRUMB_LABELS[slug]) return CRUMB_LABELS[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function crumbsFromPath(pathname: string): Crumb[] {
  if (!pathname || pathname === "/") return [];
  const parts = pathname.split("/").filter(Boolean);
  const items: Crumb[] = [{ name: "Home", path: "/" }];
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    items.push({ name: humanize(part), path: acc });
  }
  return items;
}

export function absoluteUrl(path = "/") {
  if (path === "/") return APP_URL;
  return `${APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@type": "Organization", name: APP_NAME, url: APP_URL },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
  };
}

export function organizationJsonLd(sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/icon.png`,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: APP_URL,
    description:
      "Generate professional freelance proposals in seconds with Claude AI. Includes e-signatures, Stripe payment links, client portals, AI contracts, milestone billing, and analytics. Free to start.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free Plan" },
      { "@type": "Offer", price: "12", priceCurrency: "USD", name: "Pro Plan", billingIncrement: "P1M" },
      { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Business Plan", billingIncrement: "P1M" },
    ],
    featureList: [
      "AI Proposal Generation",
      "Digital E-Signatures",
      "Stripe Payment Links",
      "Client Portal",
      "AI Contract Generator",
      "Milestone Payments",
      "Proposal Analytics",
      "White-Label Branding",
      "19+ Templates",
    ],
  };
}

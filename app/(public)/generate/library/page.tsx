import type { Metadata } from "next";
import Link from "next/link";
import { PROPOSAL_TOOLS } from "@/lib/proposal-catalog";

export const metadata: Metadata = {
  title: "Generate a Proposal",
  description: "DealPilot proposal generators for freelance, design, web, consulting, marketing, and video work. Pick a tool and paste the brief.",
  alternates: { canonical: "/generate/library" },
};

const CATEGORIES = [
  {
    href: "/generate/proposal",
    name: "Proposal",
    detail: `${PROPOSAL_TOOLS.length} generators for proposals, quotes, estimates, and retainers.`,
  },
  {
    href: "/ai-generators",
    name: "Starter set",
    detail: "Ten longer landing pages for the jobs we see most often.",
  },
  {
    href: "/blog/best-ai-proposal-generators",
    name: "11 best generators",
    detail: "A short list of the generators to open first, with a link to each one.",
  },
];

export default function GenerateLibraryPage() {
  return (
    <main className="px-5 pb-20 pt-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Generate</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-ink">
          Generators for the document you need to send
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-500">
          These pages are public. The workspace where a signed-in freelancer pastes a brief and sends the link is New proposal in the app.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link key={category.href} href={category.href} className="rounded-[28px] border border-line bg-white p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <h2 className="text-[22px] font-extrabold text-ink">{category.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{category.detail}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

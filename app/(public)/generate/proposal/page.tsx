import type { Metadata } from "next";
import Link from "next/link";
import { PROPOSAL_NICHES, PROPOSAL_TOOLS } from "@/lib/proposal-catalog";

export const metadata: Metadata = {
  title: "Proposal Generators",
  description: "Every DealPilot proposal generator: freelance, design, web, consulting, marketing, video, and more. Paste a brief and send a scoped proposal.",
  alternates: { canonical: "/generate/proposal" },
};

export default function ProposalGeneratorsPage() {
  return (
    <main className="px-5 pb-20 pt-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Proposal</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-ink">
          {PROPOSAL_TOOLS.length} proposal generators
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-500">
          Pick the job, then the document: proposal, quote, estimate, or retainer. Each page drafts that document from a brief. The signed-in generator still lives at New proposal.
        </p>
        <div className="mt-10 space-y-8">
          {PROPOSAL_NICHES.map((niche) => {
            const tools = PROPOSAL_TOOLS.filter((tool) => tool.niche === niche.slug);
            return (
              <section key={niche.slug}>
                <h2 className="text-[20px] font-extrabold capitalize text-ink">{niche.name}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.path}
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:text-brand-700"
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

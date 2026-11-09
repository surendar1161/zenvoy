"use client";

import Link from "next/link";
import LandingHero from "@/components/marketing/LandingHero";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";
import { PROPOSAL_TOOLS, type ProposalTool } from "@/lib/proposal-catalog";

export default function ProposalToolPage({ tool }: { tool: ProposalTool }) {
  const related = PROPOSAL_TOOLS.filter((item) => item.niche === tool.niche && item.slug !== tool.slug);
  const source = tool.slug.slice(0, 40);

  return (
    <main>
      <LandingHero
        tag="Proposal generator"
        title={tool.title}
        subtitle={tool.subtitle}
        primaryCTA={{ text: "Paste a brief", href: `/sign-up?source=${source}` }}
        secondaryCTA={{ text: "All proposal generators", href: "/generate/proposal" }}
        footnote="Free plan: 5 proposals/month · Edit every line before you send"
      />

      <section className="border-t border-line bg-white px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">What this {tool.noun} covers</p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-tight text-ink">
              Written for {tool.who}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-500">
              Paste the brief when {tool.use}. The draft is about {tool.work}. You still set the fee and cut anything you would not say on a call.
            </p>
            <ul className="mt-6 space-y-3">
              {tool.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] border border-line bg-canvas p-7 shadow-soft">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-400">How it works</p>
            <ol className="mt-4 space-y-4">
              {["Paste the brief or job post", "Check scope, fee, and assumptions", "Send a branded link they can sign"].map((step, index) => (
                <li key={step} className="flex gap-3 text-[15px] text-ink-700">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-bold text-white">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[24px] font-extrabold text-ink">Other {tool.niche.replace(/-/g, " ")} generators</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={item.path} className="rounded-2xl border border-line bg-white px-5 py-4 font-semibold text-ink shadow-soft hover:text-brand-700">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={tool.faqs} title={`Questions about the ${tool.name} generator`} />
      <CTASection
        title={`Generate the ${tool.noun} tonight`}
        subtitle="Paste the brief you already have. Edit the draft. Send a link the client can sign."
        buttonText="Start free"
        buttonHref={`/sign-up?source=${source}`}
      />
    </main>
  );
}

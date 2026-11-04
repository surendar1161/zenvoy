"use client";

import Link from "next/link";
import LandingHero from "@/components/marketing/LandingHero";
import CTASection from "@/components/marketing/CTASection";
import { GENERATORS } from "@/lib/generators";

export default function AIGeneratorsHubPage() {
  return (
    <main>
      <LandingHero
        tag="AI generators"
        title={
          <>
            Proposal generators
            <br />
            for the work you actually sell
          </>
        }
        subtitle="Pick the generator that matches the brief. Each one writes scope, pricing, and terms in the language of that job — then you send a branded DealPilot link."
        primaryCTA={{ text: "Start free", href: "/sign-up?source=ai-generators" }}
        secondaryCTA={{ text: "How generating works", href: "/guides/how-to-generate-a-proposal" }}
      />
      <section className="border-t border-line px-5 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
          {GENERATORS.map((generator) => (
            <Link
              key={generator.slug}
              href={`/ai-generators/${generator.slug}`}
              className="flex h-full flex-col rounded-[28px] border border-line bg-white p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                {generator.tag}
              </span>
              <h2 className="mt-4 text-[22px] font-extrabold leading-snug text-ink">{generator.name}</h2>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-500">{generator.subtitle}</p>
              <span className="mt-5 text-[14px] font-semibold text-brand-600">Open generator →</span>
            </Link>
          ))}
        </div>
      </section>
      <CTASection
        title="Or just paste whatever they sent you"
        subtitle="The general freelance generator is the right start when the brief does not fit a neat niche."
        buttonText="Freelance proposal generator"
        buttonHref="/ai-generators/freelance-proposal"
      />
    </main>
  );
}

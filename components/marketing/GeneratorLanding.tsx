"use client";

import Link from "next/link";
import LandingHero from "@/components/marketing/LandingHero";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";
import { GENERATORS, type Generator } from "@/lib/generators";

export default function GeneratorLanding({ generator }: { generator: Generator }) {
  const related = GENERATORS.filter((item) => item.slug !== generator.slug).slice(0, 4);
  const signup = `/sign-up?source=${generator.source}`;

  return (
    <main>
      <LandingHero
        tag={generator.tag}
        title={generator.title}
        subtitle={generator.subtitle}
        primaryCTA={{ text: "Paste a brief", href: signup }}
        secondaryCTA={{ text: "See all generators", href: "/ai-generators" }}
        footnote="Free plan: 5 proposals/month · No credit card · Edit every line before you send"
      />

      <section className="border-t border-line bg-white px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">What you get</p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-tight text-ink">A send-ready draft, not a blank template</h2>
            <ul className="mt-6 space-y-3">
              {generator.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] border border-line bg-canvas p-7 shadow-soft">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-400">How it works</p>
            <ol className="mt-4 space-y-4">
              {[
                "Paste the brief or job post",
                "Review scope, fees, and tone",
                "Send a branded link with e-sign",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-[15px] text-ink-700">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-bold text-white">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Link href={generator.verticalHref} className="mt-6 inline-block text-[14px] font-semibold text-brand-600 hover:text-brand-700">
              {generator.verticalLabel} →
            </Link>
          </div>
        </div>
      </section>

      {generator.sections.map((section) => (
        <section key={section.heading} className="border-t border-line px-5 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-[28px] font-extrabold leading-tight text-ink">{section.heading}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-500">{section.body}</p>
          </div>
        </section>
      ))}

      <section className="border-t border-line px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[24px] font-extrabold text-ink">Other generators</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/ai-generators/${item.slug}`}
                className="rounded-2xl border border-line bg-white px-5 py-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-600">{item.tag}</div>
                <div className="mt-1 text-[16px] font-bold text-ink">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={generator.faqs} title="Questions about this generator" />
      <CTASection
        title="Generate the proposal tonight"
        subtitle="Paste the brief you already have. Edit the draft. Send a link your client can sign."
        buttonText="Start free"
        buttonHref={signup}
      />
    </main>
  );
}

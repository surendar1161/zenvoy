"use client";

import { ArrowRightOutlined } from "@ant-design/icons";
import { ButtonLink } from "@/components/site/ui";

interface CTASectionProps {
  emoji?: string;
  tagline?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
  footnote?: string;
}

export default function CTASection({
  emoji = "📨",
  tagline = "Your AI envoy. Every client, every deal.",
  title,
  subtitle,
  buttonText = "Start for Free — 60-second setup",
  buttonHref = "/sign-up",
  footnote = "Free forever plan · No credit card · Instant access",
}: CTASectionProps) {
  return (
    <section aria-label="Call to action" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-6 py-14 text-center text-white shadow-float sm:px-12 sm:py-20">
        <div className="dp-grid absolute inset-0 opacity-30" aria-hidden />
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-brand-500/40 blur-[80px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-violet-500/40 blur-[80px]" aria-hidden />
        <div className="relative">
          <div className="text-[40px]" aria-hidden>{emoji}</div>
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-200">{tagline}</p>
          <h2 className="mx-auto mt-3 max-w-xl text-[32px] font-extrabold leading-tight sm:text-[42px]">{title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-ink-300">{subtitle}</p>
          <div className="mt-8">
            <ButtonLink href={buttonHref} variant="light" size="lg" className="font-bold">
              {buttonText} <ArrowRightOutlined className="text-[13px]" />
            </ButtonLink>
          </div>
          {footnote && <p className="mt-5 text-[13px] text-ink-400">{footnote}</p>}
        </div>
      </div>
    </section>
  );
}

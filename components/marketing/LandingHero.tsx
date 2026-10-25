"use client";

import { ArrowRightOutlined } from "@ant-design/icons";
import { ButtonLink } from "@/components/site/ui";

interface CTA {
  text: string;
  href: string;
  type?: "primary" | "secondary";
}

interface LandingHeroProps {
  tag?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  footnote?: string;
}

export default function LandingHero({ tag, title, subtitle, primaryCTA, secondaryCTA, footnote }: LandingHeroProps) {
  return (
    <section aria-label="Hero" className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="dp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-400/20 blur-[90px]" aria-hidden />
      <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-violet-400/15 blur-[90px]" aria-hidden />
      <div className="relative mx-auto max-w-3xl text-center">
        {tag && (
          <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">
            {tag}
          </span>
        )}
        <h1 className="mt-5 text-[clamp(34px,5.5vw,58px)] font-extrabold leading-[1.08] tracking-tight text-ink">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500 sm:text-[18px]">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primaryCTA && (
            <ButtonLink href={primaryCTA.href} size="lg">
              {primaryCTA.text} <ArrowRightOutlined className="text-[13px]" />
            </ButtonLink>
          )}
          {secondaryCTA && (
            <ButtonLink href={secondaryCTA.href} variant="secondary" size="lg">
              {secondaryCTA.text}
            </ButtonLink>
          )}
        </div>
        {footnote && <p className="mt-5 text-[13px] text-ink-400">{footnote}</p>}
      </div>
    </section>
  );
}

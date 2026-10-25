"use client";

import { ArrowRightOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ButtonLink } from "@/components/site/ui";

interface BlogArticleProps {
  tag: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  children: React.ReactNode;
}

const RELATED = [
  { title: "How to Write a Freelance Proposal That Wins", href: "/blog/how-to-write-a-freelance-proposal", tag: "Guide" },
  { title: "How to Price Freelance Projects (Without Undercharging)", href: "/blog/how-to-price-freelance-projects", tag: "Pricing" },
  { title: "How to Follow Up on a Proposal Without Being Annoying", href: "/blog/how-to-follow-up-on-a-proposal", tag: "Sales" },
  { title: "7 Freelance Proposal Examples That Actually Won Clients", href: "/blog/freelance-proposal-examples", tag: "Examples" },
];

export default function BlogArticle({ tag, title, subtitle, date, readTime, children }: BlogArticleProps) {
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-14 pt-12 sm:px-6 sm:pt-16">
        <div className="dp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <Link href="/blog" className="text-[14px] font-semibold text-brand-600 hover:text-brand-700">← Back to blog</Link>
          <div className="mt-5">
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">{tag}</span>
          </div>
          <h1 className="mt-4 text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.12] tracking-tight text-ink">{title}</h1>
          <p className="mt-4 text-[18px] leading-relaxed text-ink-500">{subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-[13px] text-ink-400">
            <span className="inline-flex items-center gap-1.5"><CalendarOutlined /> {date}</span>
            <span className="inline-flex items-center gap-1.5"><ClockCircleOutlined /> {readTime}</span>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8 sm:px-6">
        <div className="dp-article mx-auto max-w-3xl rounded-[28px] border border-line bg-white px-6 py-8 shadow-soft sm:px-10 sm:py-12">
          {children}
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-6 py-12 text-center text-white shadow-float sm:px-12">
          <div className="dp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-[28px] font-extrabold leading-tight sm:text-[34px]">Skip the writing. Generate with AI.</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-300">
              DealPilot writes a personalised proposal in 60 seconds. Try it free — no credit card required.
            </p>
            <div className="mt-7">
              <ButtonLink href="/sign-up" variant="light" size="lg" className="font-bold">
                Generate your first proposal <ArrowRightOutlined className="text-[13px]" />
              </ButtonLink>
            </div>
            <p className="mt-4 text-[13px] text-ink-400">Free plan: 5 proposals/month · No credit card · 60-second setup</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-[22px] font-extrabold text-ink">Keep reading</h3>
          <div className="mt-5 space-y-3">
            {RELATED.map(a => (
              <Link key={a.href} href={a.href} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">{a.tag}</span>
                  <span className="truncate text-[15px] font-semibold text-ink">{a.title}</span>
                </span>
                <ArrowRightOutlined className="shrink-0 text-[13px] text-ink-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

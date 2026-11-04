"use client";

import Link from "next/link";
import FAQSection from "@/components/marketing/FAQSection";
import CTASection from "@/components/marketing/CTASection";
import JsonLd from "@/components/seo/JsonLd";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { GUIDES, type Guide } from "@/lib/guides";

export default function GuideArticle({ guide }: { guide: Guide }) {
  const path = `/guides/${guide.slug}`;
  const others = GUIDES.filter((item) => item.slug !== guide.slug);

  return (
    <main>
      <JsonLd
        data={blogPostingJsonLd({
          title: guide.title,
          description: guide.subtitle,
          path,
          datePublished: guide.dateIso,
        })}
      />
      <section className="px-5 pb-10 pt-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">
            Help guide
          </span>
          <h1 className="mt-4 text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.12] tracking-tight text-ink">
            {guide.title}
          </h1>
          <p className="mt-4 text-[18px] leading-relaxed text-ink-500">{guide.subtitle}</p>
          <p className="mt-4 text-[13px] text-ink-400">
            {guide.date} · {guide.readTime}
          </p>
        </div>
      </section>

      <section className="px-5 pb-8 sm:px-6">
        <ol className="mx-auto max-w-3xl space-y-4">
          {guide.steps.map((step, index) => (
            <li key={step.title} className="rounded-[28px] border border-line bg-white p-6 shadow-soft sm:p-8">
              <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">Step {index + 1}</div>
              <h2 className="mt-2 text-[22px] font-extrabold text-ink">{step.title}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-[20px] font-extrabold text-ink">More guides</h3>
          <div className="mt-4 space-y-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="block rounded-2xl border border-line bg-white px-5 py-4 font-semibold text-ink shadow-soft hover:text-brand-700"
              >
                {item.title}
              </Link>
            ))}
            <Link href="/blog" className="block rounded-2xl border border-line bg-white px-5 py-4 font-semibold text-ink shadow-soft hover:text-brand-700">
              Freelance business blog
            </Link>
          </div>
        </div>
      </section>

      <FAQSection faqs={guide.faqs} title="Quick answers" />
      <CTASection
        title="Generate the proposal instead of outlining it"
        subtitle="The guides exist so you are not stuck. The product exists so you are not still writing at midnight."
        buttonHref="/sign-up?source=guides"
      />
    </main>
  );
}

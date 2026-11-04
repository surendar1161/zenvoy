"use client";

import { ArrowRightOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ButtonLink } from "@/components/site/ui";
import { BLOG_POSTS } from "@/lib/blog";

const POSTS = BLOG_POSTS;

export default function BlogIndexPage() {
  const featured = POSTS[0];
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="dp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">DealPilot Blog</span>
          <h1 className="mt-5 text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-ink">
            Win more clients.<br />Close more deals.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
            Actionable guides on proposals, pricing, contracts, and freelance business.
          </p>
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link href={`/blog/${featured.slug}`} className="grid overflow-hidden rounded-[28px] border border-line bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift md:grid-cols-5">
            <div className="flex min-h-[220px] flex-col items-center justify-center bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-8 text-center text-white md:col-span-2">
              <div className="text-[52px]" aria-hidden>📝</div>
              <div className="mt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-brand-200">Featured guide</div>
            </div>
            <div className="p-8 md:col-span-3 md:p-10">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[12px] font-bold text-brand-700">{featured.tag}</span>
              <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-ink">{featured.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{featured.excerpt}</p>
              <div className="mt-5 flex gap-4 text-[13px] text-ink-400">
                <span className="inline-flex items-center gap-1.5"><CalendarOutlined /> {featured.date}</span>
                <span className="inline-flex items-center gap-1.5"><ClockCircleOutlined /> {featured.readTime}</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[22px] font-extrabold text-ink">All articles</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">{post.tag}</span>
                <h3 className="mt-4 text-[20px] font-extrabold leading-snug text-ink">{post.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-500">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-[12.5px] text-ink-400">
                  <span>{post.date} · {post.readTime}</span>
                  <ArrowRightOutlined />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-6 py-14 text-center text-white shadow-float">
          <div className="dp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-[28px] font-extrabold">Stop writing proposals from scratch</h2>
            <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-300">Generate a professional, AI-written proposal in 60 seconds. Free plan available.</p>
            <div className="mt-7">
              <ButtonLink href="/sign-up" variant="light" size="lg" className="font-bold">Try DealPilot free <ArrowRightOutlined className="text-[13px]" /></ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

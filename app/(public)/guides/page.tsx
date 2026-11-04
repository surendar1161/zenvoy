"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/site/ui";
import { GUIDES } from "@/lib/guides";
import { BLOG_POSTS } from "@/lib/blog";

export default function GuidesIndexPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-12 pt-8 sm:px-6 sm:pt-14">
        <div className="dp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-ink">
            How DealPilot works
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
            Short product guides: generate, send, and get a proposal signed. For writing craft and pricing psychology, use the blog.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {GUIDES.map((guide, index) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-[28px] border border-line bg-white p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600">
                Guide {index + 1}
              </span>
              <h2 className="mt-3 text-[20px] font-extrabold leading-snug text-ink">{guide.title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{guide.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[24px] font-extrabold text-ink">From the blog</h2>
          <div className="mt-5 space-y-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-soft"
              >
                <span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-600">{post.tag}</span>
                  <span className="mt-1 block font-semibold text-ink">{post.title}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/sign-up?source=guides">Start free</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}

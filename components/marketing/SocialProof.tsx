"use client";

import { StarFilled } from "@ant-design/icons";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface SocialProofProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export default function SocialProof({ title = "What freelancers say", subtitle, testimonials }: SocialProofProps) {
  return (
    <section aria-label="Testimonials" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Stories</span>
          <h2 className="mt-3 text-[32px] font-extrabold leading-tight text-ink sm:text-[40px]">{title}</h2>
          {subtitle && <p className="mt-3 text-[16px] text-ink-500">{subtitle}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.name} className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft">
              <div className="flex gap-1 text-[13px] text-amber-400" aria-label="5 stars">
                {[1, 2, 3, 4, 5].map(n => <StarFilled key={n} />)}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <div className="text-[14px] font-bold text-ink">{t.name}</div>
                <div className="text-[13px] text-ink-400">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

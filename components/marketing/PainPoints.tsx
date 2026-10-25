"use client";

interface PainPoint {
  quote: string;
  author: string;
  pain: string;
}

interface PainPointsProps {
  title?: string;
  subtitle?: string;
  painPoints: PainPoint[];
}

export default function PainPoints({ title = "Sound familiar?", subtitle, painPoints }: PainPointsProps) {
  return (
    <section aria-label="Pain points" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-[12px] font-bold text-rose-700">Real freelancer frustrations</span>
          <h2 className="mt-4 text-[32px] font-extrabold leading-tight text-ink sm:text-[40px]">{title}</h2>
          {subtitle && <p className="mt-3 text-[16px] text-ink-500">{subtitle}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {painPoints.map(p => (
            <figure key={p.quote} className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="font-display text-[28px] leading-none text-ink-200" aria-hidden>&ldquo;</span>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">Pain {p.pain}</span>
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{p.quote}</blockquote>
              <figcaption className="mt-5 text-[13px] text-ink-400">— {p.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

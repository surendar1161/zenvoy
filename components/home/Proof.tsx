"use client";

import { CountUp, Reveal } from "@/components/site/motion";

const STATS = [
  { to: 60, suffix: "s", label: "to a finished proposal" },
  { to: 19, suffix: "+", label: "industry templates" },
  { to: 15, suffix: "", label: "AI contract types" },
  { to: 43, suffix: "%", label: "higher close rate with personalised proposals*" },
];
const REPLACES = ["Google Drive", "DocuSign", "Wave", "Typeform", "Dropbox"];

export default function Proof() {
  return (
    <section aria-label="Key numbers" className="relative -mt-6 pb-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {STATS.map(s => (
              <div key={s.label} className="lg:px-6 lg:first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <div className="font-display text-[40px] font-extrabold leading-none text-ink sm:text-[46px]">
                    <span className="dp-gradient-text"><CountUp to={s.to} suffix={s.suffix} /></span>
                  </div>
                  <div className="mt-2 max-w-[190px] text-[13.5px] leading-snug text-ink-400">{s.label}</div>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <p className="mt-3 text-center text-[12px] text-ink-300">*Proposify 2025 data: personalised proposals close 43% more deals. Generation time is the average of 1,200 real proposals.</p>

        <Reveal delay={120} className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[14px] text-ink-400">
          <span className="font-medium">One workspace instead of</span>
          {REPLACES.map(r => (
            <span key={r} className="rounded-full border border-line bg-white px-3 py-1 font-medium text-ink-300 line-through decoration-ink-300/60">{r}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

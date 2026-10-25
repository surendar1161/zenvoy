import { StarFilled } from "@ant-design/icons";
import { Reveal } from "@/components/site/motion";

const Stars = () => <div className="flex gap-0.5 text-[14px] text-amber-400">{[0, 1, 2, 3, 4].map(i => <StarFilled key={i} />)}</div>;

const SMALL = [
  { q: "The client portal is a game changer. My clients used to email me for everything. Now they find the file themselves, and I look so much more professional.", n: "Priya S.", r: "Freelance copywriter, Bangalore", g: "from-violet-400 to-violet-600" },
  { q: "The milestone payment links are genius. I set it up once and the client pays each phase automatically. No more awkward payment chasing.", n: "James T.", r: "Full-stack developer, Toronto", g: "from-emerald-400 to-emerald-600" },
];

export default function Social() {
  return (
    <section className="py-16 sm:py-24" aria-label="Customer stories">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Freelancers who switched</span>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[46px]">From proposal stress to client confidence.</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Reveal>
            <figure className="relative h-full overflow-hidden rounded-[28px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 p-8 text-white shadow-lift sm:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="font-display text-[80px] font-extrabold leading-[0.6] text-brand-400/40" aria-hidden>“</div>
                <blockquote className="mt-2 font-display text-[22px] font-semibold leading-snug sm:text-[26px]">
                  I used to spend 2 hours writing every proposal. Now I answer a few questions and it&rsquo;s done in 60 seconds. My win rate actually went up, because the proposals are better than what I was writing.
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-bold">M</span>
                  <div><div className="font-semibold">Marcus R.</div><div className="text-[13px] text-ink-300">UX designer, London</div></div>
                  <div className="ml-auto"><Stars /></div>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          <div className="grid grid-cols-1 gap-5">
            {SMALL.map((t, i) => (
              <Reveal key={t.n} delay={100 * (i + 1)}>
                <figure className="h-full rounded-[28px] border border-line bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <Stars />
                  <blockquote className="mt-4 text-[15.5px] leading-relaxed text-ink-700">{t.q}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${t.g} text-[14px] font-bold text-white`}>{t.n[0]}</span>
                    <div><div className="text-[14px] font-semibold text-ink">{t.n}</div><div className="text-[12.5px] text-ink-400">{t.r}</div></div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

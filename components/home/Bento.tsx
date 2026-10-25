"use client";

import { useState } from "react";
import {
  BgColorsOutlined, ThunderboltOutlined, DollarOutlined, TeamOutlined,
  SafetyCertificateOutlined, CheckOutlined, AppstoreOutlined, ArrowRightOutlined, LockOutlined,
} from "@ant-design/icons";
import { Reveal, useInView } from "@/components/site/motion";

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7 ${className}`}>{children}</div>
);
const Eyebrow = ({ icon, children, tone }: { icon: React.ReactNode; children: React.ReactNode; tone: string }) => (
  <div className="mb-4 flex items-center gap-2.5">
    <span className={`grid h-9 w-9 place-items-center rounded-xl text-[16px] ${tone}`}>{icon}</span>
    <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">{children}</span>
  </div>
);

/* ── Brand kit ── */
const SWATCHES = [
  { name: "Sky", hex: "#0ea5e9" }, { name: "Violet", hex: "#7c3aed" }, { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" }, { name: "Amber", hex: "#f59e0b" },
];
const FONTS = [
  { name: "Modern", css: "var(--font-display), system-ui, sans-serif" },
  { name: "Classic", css: "Georgia, 'Times New Roman', serif" },
  { name: "Technical", css: "ui-monospace, 'SF Mono', Menlo, monospace" },
];

function BrandKit() {
  const [c, setC] = useState(0);
  const [f, setF] = useState(0);
  const accent = SWATCHES[c].hex;
  return (
    <Card className="lg:col-span-2">
      <Eyebrow icon={<BgColorsOutlined />} tone="bg-violet-50 text-violet-600">White-label brand kit</Eyebrow>
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <h3 className="font-display text-[24px] font-bold leading-tight text-ink">Looks like you. Never like us.</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">Logo, colours and fonts flow into every proposal, contract and portal. Pick a colour and watch it change.</p>
          <div className="mt-5">
            <div className="mb-2 text-[12px] font-semibold text-ink-400">Brand colour</div>
            <div className="flex gap-2.5">
              {SWATCHES.map((s, i) => (
                <button key={s.name} onClick={() => setC(i)} aria-label={s.name} aria-pressed={i === c}
                  className={`grid h-9 w-9 place-items-center rounded-full text-[12px] text-white transition-all ${i === c ? "scale-110 ring-2 ring-offset-2" : "hover:scale-105"}`}
                  style={{ background: s.hex, boxShadow: i === c ? `0 6px 16px ${s.hex}66` : undefined, ["--tw-ring-color" as string]: s.hex }}>
                  {i === c && <CheckOutlined />}
                </button>
              ))}
            </div>
            <div className="mb-2 mt-4 text-[12px] font-semibold text-ink-400">Typeface</div>
            <div className="flex flex-wrap gap-2">
              {FONTS.map((x, i) => (
                <button key={x.name} onClick={() => setF(i)} aria-pressed={i === f}
                  className={`rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition ${i === f ? "border-ink bg-ink text-white" : "border-line text-ink-500 hover:border-ink-300"}`}>{x.name}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-canvas p-3">
          <div className="overflow-hidden rounded-xl bg-white shadow-lift">
            <div className="h-24 transition-colors duration-500" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}>
              <div className="flex h-full items-end p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 font-extrabold" style={{ color: accent }}>N</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500" style={{ color: accent }}>Proposal</div>
              <div className="mt-1 text-[20px] font-bold leading-tight text-ink transition-all" style={{ fontFamily: FONTS[f].css }}>Brand identity for Northwind</div>
              <div className="mt-3 flex gap-2">
                <span className="rounded-lg px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors duration-500" style={{ background: accent }}>Accept proposal</span>
                <span className="rounded-lg border border-line px-3.5 py-1.5 text-[12px] font-semibold text-ink-400">Ask a question</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── Job post autofill ── */
function JobPost() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const fields = [["Client", "Acme Corp"], ["Budget", "$5,000"], ["Timeline", "6 weeks"], ["Tone", "Friendly"]];
  return (
    <Card>
      <Eyebrow icon={<ThunderboltOutlined />} tone="bg-brand-50 text-brand-600">Paste → proposal</Eyebrow>
      <h3 className="font-display text-[22px] font-bold leading-tight text-ink">Skip the blank page.</h3>
      <div ref={ref} className="mt-4 rounded-xl bg-canvas p-3.5 text-[13px] leading-relaxed text-ink-500">
        “Looking for a designer to rebuild our SaaS site. <mark className="rounded bg-brand-100 px-1 text-brand-800">Budget ~$5k</mark>, <mark className="rounded bg-brand-100 px-1 text-brand-800">6 weeks</mark>, friendly tone…”
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {fields.map(([k, v], i) => (
          <div key={k} className={`rounded-lg border border-line bg-white px-3 py-2 transition-all duration-500 ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ transitionDelay: `${300 + i * 140}ms` }}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-300">{k}</div>
            <div className="text-[13px] font-semibold text-ink-700">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Milestones ── */
const MILESTONES = [{ n: "Kickoff", p: 30 }, { n: "Design approved", p: 40 }, { n: "Launch", p: 30 }];
function Milestones() {
  const [done, setDone] = useState(1);
  const paid = MILESTONES.slice(0, done).reduce((s, m) => s + m.p, 0);
  return (
    <Card>
      <Eyebrow icon={<DollarOutlined />} tone="bg-emerald-50 text-emerald-600">Milestone billing</Eyebrow>
      <h3 className="font-display text-[22px] font-bold leading-tight text-ink">Get paid per phase, automatically.</h3>
      <div className="mt-4 space-y-2">
        {MILESTONES.map((m, i) => (
          <div key={m.n} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${i < done ? "border-emerald-200 bg-emerald-50/60" : "border-line"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${i < done ? "bg-emerald-500 text-white" : "border border-line text-transparent"}`}><CheckOutlined /></span>
            <span className="flex-1 text-[13.5px] font-medium text-ink-700">{m.n}</span>
            <span className="text-[12.5px] font-semibold tabular-nums text-ink-400">{m.p}%</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700" style={{ width: `${paid}%` }} /></div>
      <button onClick={() => setDone(d => (d >= MILESTONES.length ? 0 : d + 1))} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 transition hover:gap-2.5">
        {done >= MILESTONES.length ? "Start over" : "Complete next milestone"} <ArrowRightOutlined className="text-[11px]" />
      </button>
    </Card>
  );
}

/* ── CRM ── */
const CLIENTS = [
  { n: "Acme Corp", r: "$12.4k", s: "Active", c: "bg-emerald-50 text-emerald-600" },
  { n: "Northwind Coffee", r: "$3.2k", s: "Lead", c: "bg-amber-50 text-amber-600" },
  { n: "Lumen Health", r: "$7.8k", s: "Active", c: "bg-emerald-50 text-emerald-600" },
];
function Crm() {
  return (
    <Card>
      <Eyebrow icon={<TeamOutlined />} tone="bg-sky-50 text-sky-600">Lightweight CRM</Eyebrow>
      <h3 className="font-display text-[22px] font-bold leading-tight text-ink">Every client, one timeline.</h3>
      <div className="mt-4 space-y-2">
        {CLIENTS.map(c => (
          <div key={c.n} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-brand-300 hover:bg-canvas">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-violet-500 text-[12px] font-bold text-white">{c.n[0]}</span>
            <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-semibold text-ink-700">{c.n}</div><div className="text-[11.5px] text-ink-300">{c.r} lifetime</div></div>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.c}`}>{c.s}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Compliance (dark card for rhythm) ── */
function Compliance() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-lift transition-all duration-300 hover:-translate-y-1 sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-brand-300"><SafetyCertificateOutlined /></span>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-300">Trust built in</span>
        </div>
        <h3 className="font-display text-[22px] font-bold leading-tight">Legally sound. Securely stored.</h3>
        <ul className="mt-4 space-y-2.5">
          {["eIDAS & ESIGN compliant signatures", "IP, time & device logged on every sign", "Password protection & expiry links", "Payments secured by Stripe"].map(t => (
            <li key={t} className="flex items-start gap-2.5 text-[14px] text-ink-300"><LockOutlined className="mt-1 text-[12px] text-brand-300" />{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Templates marquee ── */
const TEMPLATES = ["Web development", "Mobile app", "Branding & identity", "UI/UX design", "SEO & marketing", "Copywriting", "Video production", "Consulting", "Social media", "Data analysis", "Photography", "Podcast production"];
function Templates() {
  const row = [...TEMPLATES, ...TEMPLATES];
  return (
    <Card className="lg:col-span-3">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow icon={<AppstoreOutlined />} tone="bg-amber-50 text-amber-600">19+ templates</Eyebrow>
          <h3 className="font-display text-[24px] font-bold leading-tight text-ink">Built for your kind of work.</h3>
        </div>
        <p className="max-w-sm text-[14.5px] leading-relaxed text-ink-500">Scope, deliverables, pricing and tone pre-filled for your profession, ready to customise.</p>
      </div>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <span key={i} className="shrink-0 rounded-full border border-line bg-canvas px-5 py-2.5 text-[14px] font-semibold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700">{t}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function Bento() {
  return (
    <section id="why" className="scroll-mt-20 py-16 sm:py-24" aria-label="Why DealPilot">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-violet-600">Why DealPilot</span>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[46px]">Everything else you&rsquo;d have to duct-tape.</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-500">Calm, capable tools that disappear into your workflow, so clients see a polished studio and you see fewer tabs.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2"><BrandKit /></Reveal>
          <Reveal delay={80}><JobPost /></Reveal>
          <Reveal><Milestones /></Reveal>
          <Reveal delay={80}><Crm /></Reveal>
          <Reveal delay={160}><Compliance /></Reveal>
          <Reveal className="lg:col-span-3"><Templates /></Reveal>
        </div>
      </div>
    </section>
  );
}

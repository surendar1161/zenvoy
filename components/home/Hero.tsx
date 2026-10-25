"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRightOutlined, CheckOutlined, EyeOutlined, EditOutlined,
  DollarOutlined, SendOutlined, StarFilled, ThunderboltFilled, PlayCircleOutlined,
} from "@ant-design/icons";
import { useAnimatedNumber } from "@/components/site/motion";
import { ButtonLink } from "@/components/site/ui";

const PROJECTS = [
  {
    label: "Web design", client: "Acme Corp", contact: "Jordan Lee", title: "Website redesign",
    summary: "A conversion-focused redesign that turns Acme's brochure site into a lead engine, written in the same language as your client's brief.",
    sections: ["Discovery & goals", "Design system + 6 key pages", "Build, QA & launch"], price: 4800, weeks: 6,
  },
  {
    label: "Branding", client: "Northwind Coffee", contact: "Maya Rossi", title: "Brand identity system",
    summary: "A warm, memorable identity for Northwind's second location, from logo and palette through packaging and signage guidelines.",
    sections: ["Brand strategy workshop", "Logo, palette & type", "Guidelines + asset kit"], price: 3200, weeks: 4,
  },
  {
    label: "Copywriting", client: "Lumen Health", contact: "Dr. Sam Patel", title: "Website messaging",
    summary: "Clear, trustworthy messaging that explains Lumen's care model in plain language and moves visitors toward booking.",
    sections: ["Voice & positioning", "Homepage + 5 service pages", "Two revision rounds"], price: 2400, weeks: 3,
  },
  {
    label: "Consulting", client: "Orbit Labs", contact: "Priya Nair", title: "Go-to-market sprint",
    summary: "A focused two-week sprint to define ICP, pricing and launch channels, ending with a 90-day plan the team can run without you.",
    sections: ["Customer interviews", "Pricing & positioning", "90-day launch plan"], price: 6500, weeks: 2,
  },
] as const;

const STEPS = [
  { label: "Sent", icon: <SendOutlined /> },
  { label: "Viewed", icon: <EyeOutlined /> },
  { label: "Signed", icon: <EditOutlined /> },
  { label: "Paid", icon: <DollarOutlined /> },
];

function ProposalDemo() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"generating" | "ready">("generating");
  const [typed, setTyped] = useState(0);
  const [step, setStep] = useState(-1);
  const userPicked = useRef(false);
  const p = PROJECTS[idx];
  const price = useAnimatedNumber(phase === "ready" ? p.price : 0, 900);

  // 1) generating → ready
  useEffect(() => {
    setPhase("generating"); setTyped(0); setStep(-1);
    const t = window.setTimeout(() => setPhase("ready"), 1100);
    return () => window.clearTimeout(t);
  }, [idx]);

  // 2) typewriter, then walk the deal through its lifecycle, then (autoplay) move on
  useEffect(() => {
    if (phase !== "ready") return;
    const timers: number[] = [];
    const full = p.summary.length;
    let i = 0;
    const iv = window.setInterval(() => {
      i += 3;
      setTyped(Math.min(i, full));
      if (i >= full) {
        window.clearInterval(iv);
        [500, 1900, 3300, 4700].forEach((ms, s) => timers.push(window.setTimeout(() => setStep(s), ms)));
        if (!userPicked.current) {
          timers.push(window.setTimeout(() => setIdx(n => (n + 1) % PROJECTS.length), 8200));
        }
      }
    }, 16);
    return () => { window.clearInterval(iv); timers.forEach(window.clearTimeout); };
  }, [phase, p.summary.length]);  // eslint-disable-line react-hooks/exhaustive-deps

  const ready = phase === "ready";
  const notice =
    step === 1 ? { icon: <EyeOutlined />, tone: "bg-brand-50 text-brand-600", title: `${p.client} opened your proposal`, sub: "Just now · 2nd view" } :
    step === 2 ? { icon: <EditOutlined />, tone: "bg-emerald-50 text-emerald-600", title: `${p.contact} signed it`, sub: "Timestamp & IP recorded" } :
    step === 3 ? { icon: <DollarOutlined />, tone: "bg-violet-50 text-violet-600", title: `$${Math.round(p.price * 0.5).toLocaleString()} deposit received`, sub: "Stripe · paid in full" } : null;

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[48px] bg-gradient-to-tr from-brand-300/50 via-violet-300/40 to-transparent blur-3xl" aria-hidden />

      {/* AI badge */}
      <div className="absolute -left-3 -top-4 z-20 flex animate-float items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold shadow-lift sm:-left-6">
        <span className="relative grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-[10px] text-white">
          <ThunderboltFilled />
          {!ready && <span className="absolute inset-0 animate-ping2 rounded-full bg-brand-400" />}
        </span>
        {ready ? "Written in 58 seconds" : "Claude is writing…"}
      </div>

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-float">
        {/* window bar */}
        <div className="flex items-center justify-between border-b border-line bg-canvas/70 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" /><span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c940]" />
          </div>
          <span className="text-[12px] font-medium text-ink-400">New proposal</span>
          <span className="w-10" />
        </div>

        {/* project chips */}
        <div className="dp-noscroll flex gap-2 overflow-x-auto px-5 pb-1 pt-4">
          {PROJECTS.map((pr, i) => (
            <button
              key={pr.label}
              onClick={() => { userPicked.current = true; setIdx(i); }}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                i === idx ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm" : "border-line bg-white text-ink-500 hover:border-brand-300 hover:text-ink"
              }`}
              aria-pressed={i === idx}
            >
              {pr.label}
            </button>
          ))}
        </div>

        {/* document */}
        <div className="px-5 pb-5 pt-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Proposal for</div>
                {ready ? (
                  <div key={idx} className="animate-pop">
                    <div className="font-display text-[20px] font-bold leading-tight text-ink">{p.client}</div>
                    <div className="text-[13px] text-ink-400">{p.title}</div>
                  </div>
                ) : (
                  <div className="mt-1.5 space-y-2"><div className="dp-skel h-5 w-40" /><div className="dp-skel h-3.5 w-28" /></div>
                )}
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-300">Investment</div>
                <div className="font-display text-[24px] font-extrabold tabular-nums text-ink">${Math.round(price).toLocaleString()}</div>
                <div className="text-[11px] text-ink-400">{ready ? `${p.weeks} weeks` : "—"}</div>
              </div>
            </div>

            <div className="mt-4 min-h-[66px] text-[13.5px] leading-relaxed text-ink-500">
              {ready ? (
                <>{p.summary.slice(0, typed)}{typed < p.summary.length && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-brand-500" />}</>
              ) : (
                <div className="space-y-2"><div className="dp-skel h-3 w-full" /><div className="dp-skel h-3 w-[92%]" /><div className="dp-skel h-3 w-[60%]" /></div>
              )}
            </div>

            <ul className="mt-4 space-y-2">
              {p.sections.map((s, i) => (
                <li
                  key={s + idx}
                  className={`flex items-center gap-2.5 rounded-xl border border-line bg-canvas/60 px-3 py-2 text-[13px] font-medium text-ink-700 transition-all duration-500 ${
                    ready && typed > 20 ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-[10px] text-emerald-600"><CheckOutlined /></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* pipeline */}
          <div className="mt-5 px-1">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-4 right-4 top-4 h-0.5 rounded bg-line" aria-hidden />
              <div
                className="absolute left-4 top-4 h-0.5 rounded bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-700"
                style={{ width: `calc((100% - 2rem) * ${Math.max(step, 0) / 3})`, opacity: step < 0 ? 0 : 1 }}
                aria-hidden
              />
              {STEPS.map((s, i) => {
                const done = i <= step;
                return (
                  <div key={s.label} className="relative z-10 flex flex-col items-center gap-1.5">
                    <span className={`grid h-8 w-8 place-items-center rounded-full border text-[13px] transition-all duration-500 ${
                      done ? "scale-100 border-transparent bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-[0_6px_16px_rgba(14,165,233,.4)]" : "scale-95 border-line bg-white text-ink-300"
                    }`}>{s.icon}</span>
                    <span className={`text-[11.5px] font-semibold ${done ? "text-ink" : "text-ink-300"}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* live notification */}
      {notice && (
        <div key={`${idx}-${step}`} className="absolute -top-6 right-2 z-20 flex animate-pop items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-float sm:-right-6">
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${notice.tone}`}>{notice.icon}</span>
          <div>
            <div className="text-[13px] font-semibold text-ink">{notice.title}</div>
            <div className="text-[11.5px] text-ink-400">{notice.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const AVATARS = ["from-brand-400 to-brand-600", "from-violet-400 to-violet-600", "from-emerald-400 to-emerald-600", "from-amber-400 to-orange-500"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-36" aria-label="Hero">
      {/* background */}
      <div className="dp-grid absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[520px] w-[520px] animate-aurora rounded-full bg-brand-300/40 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 h-[460px] w-[460px] animate-aurora rounded-full bg-violet-300/30 blur-[120px]" style={{ animationDelay: "-6s" }} aria-hidden />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-5 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:pb-32">
        <div>
          <a href="/#product" className="group inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 py-1.5 pl-2 pr-4 text-[13px] font-medium text-ink-700 shadow-soft backdrop-blur transition hover:border-brand-400">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">New</span>
            Paste a job post, get a finished proposal
            <ArrowRightOutlined className="text-[10px] text-brand-600 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.04] text-ink sm:text-[58px] lg:text-[64px]">
            Your AI envoy for <span className="dp-gradient-text">every client, every deal.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-ink-500 sm:text-[18px]">
            DealPilot writes the proposal, drafts the contract, collects the signature and gets you paid, so you can stay in flow and keep doing the work you love.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/sign-up" size="lg">Start free <ArrowRightOutlined className="text-[13px]" /></ButtonLink>
            <ButtonLink href="/#product" variant="secondary" size="lg" className="!text-[15px]">
              <PlayCircleOutlined className="text-brand-600" /> See it in action
            </ButtonLink>
          </div>
          <p className="mt-4 text-[13px] text-ink-400">Free plan · No credit card · Ready in 60 seconds</p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {AVATARS.map((g, i) => (
                <span key={i} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br ${g} text-[12px] font-bold text-white shadow-soft`}>{"MPJA"[i]}</span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-[13px] text-amber-400">{[0, 1, 2, 3, 4].map(i => <StarFilled key={i} />)}<span className="ml-2 font-semibold text-ink">4.9</span></div>
              <div className="text-[13px] text-ink-400">Loved by 1,200+ freelancers</div>
            </div>
          </div>
        </div>

        <ProposalDemo />
      </div>
    </section>
  );
}

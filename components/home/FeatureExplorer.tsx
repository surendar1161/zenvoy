"use client";

import { useState, type ReactNode } from "react";
import {
  ThunderboltFilled, SafetyCertificateOutlined, GlobalOutlined, BarChartOutlined,
  CheckOutlined, FileTextOutlined, DollarOutlined, MessageOutlined, FolderOpenOutlined,
  EyeOutlined, ClockCircleOutlined, LockOutlined,
} from "@ant-design/icons";
import { Reveal, useAnimatedNumber } from "@/components/site/motion";

/* ───────────────────────── panels ───────────────────────── */

const TIERS = [
  { name: "Good", price: 2400, blurb: "Core deliverables" },
  { name: "Better", price: 4800, blurb: "Most popular", popular: true },
  { name: "Best", price: 8200, blurb: "Everything + support" },
];
const ADDONS = [
  { key: "rush", label: "Rush delivery", price: 600 },
  { key: "seo", label: "SEO setup", price: 450 },
  { key: "care", label: "Monthly care plan", price: 300 },
];

function ProposalPanel() {
  const [tier, setTier] = useState(1);
  const [addons, setAddons] = useState<Record<string, boolean>>({ seo: true });
  const total = TIERS[tier].price + ADDONS.filter(a => addons[a.key]).reduce((s, a) => s + a.price, 0);
  const shown = useAnimatedNumber(total, 450);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">Investment</div>
          <div className="font-display text-[18px] font-bold text-ink">Let your client choose a package</div>
        </div>
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-600 sm:inline">Try it, click a tier</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TIERS.map((t, i) => (
          <button
            key={t.name} onClick={() => setTier(i)} aria-pressed={i === tier}
            className={`relative rounded-2xl border-2 bg-white p-4 text-left transition-all duration-300 ${
              i === tier ? "-translate-y-1 border-brand-500 shadow-glow" : "border-line hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
            }`}
          >
            {t.popular && <span className="absolute -top-2.5 right-3 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Popular</span>}
            <div className="text-[13px] font-semibold text-ink-400">{t.name}</div>
            <div className="mt-1 font-display text-[26px] font-extrabold tabular-nums text-ink">${t.price.toLocaleString()}</div>
            <div className="mt-1 text-[12px] text-ink-400">{t.blurb}</div>
            <span className={`mt-3 grid h-5 w-5 place-items-center rounded-full border text-[10px] transition-all ${i === tier ? "border-brand-500 bg-brand-500 text-white" : "border-line text-transparent"}`}><CheckOutlined /></span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-300">Optional add-ons</div>
        <div className="space-y-1.5">
          {ADDONS.map(a => (
            <label key={a.key} className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 transition hover:bg-canvas">
              <span className="flex items-center gap-3 text-[14px] font-medium text-ink-700">
                <input type="checkbox" className="h-4 w-4 accent-sky-600" checked={!!addons[a.key]} onChange={e => setAddons(s => ({ ...s, [a.key]: e.target.checked }))} />
                {a.label}
              </span>
              <span className="text-[13px] font-semibold tabular-nums text-ink-500">+${a.price}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-white">
        <div>
          <div className="text-[12px] text-ink-300">Total · deposit link auto-created</div>
          <div className="font-display text-[28px] font-extrabold tabular-nums">${Math.round(shown).toLocaleString()}</div>
        </div>
        <span className="rounded-xl bg-white/10 px-4 py-2 text-[13px] font-semibold ring-1 ring-white/20">Pay 50% deposit</span>
      </div>
    </div>
  );
}

const CONTRACTS = ["NDA", "Retainer", "Contractor", "SLA", "Sales", "Lease"];

function ContractPanel() {
  const [type, setType] = useState(0);
  const [name, setName] = useState("Jordan Lee");
  const [signed, setSigned] = useState(false);

  return (
    <div>
      <div className="dp-noscroll mb-4 flex gap-2 overflow-x-auto">
        {CONTRACTS.map((c, i) => (
          <button key={c} onClick={() => { setType(i); setSigned(false); }} aria-pressed={i === type}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ${i === type ? "border-violet-500 bg-violet-50 text-violet-700" : "border-line bg-white text-ink-500 hover:border-violet-300"}`}>
            {c}
          </button>
        ))}
        <span className="shrink-0 rounded-full border border-dashed border-line px-3.5 py-1.5 text-[13px] font-medium text-ink-300">+9 more</span>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div key={type} className="animate-pop font-display text-[19px] font-bold text-ink">{CONTRACTS[type]} Agreement</div>
          <span className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[11.5px] font-semibold text-violet-700"><GlobalOutlined /> California, US law</span>
        </div>
        <div className="mt-4 space-y-2.5" aria-hidden>
          {[100, 94, 98, 70].map((w, i) => <div key={i} className="h-2.5 rounded bg-slate-100" style={{ width: `${w}%` }} />)}
          <div className="h-2.5 w-[40%] rounded bg-violet-100" />
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-line bg-canvas/70 p-4">
          <label className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-300" htmlFor="sig">Type your name to sign</label>
          <input
            id="sig" value={name} onChange={e => { setName(e.target.value); setSigned(false); }}
            className="mt-1 w-full border-0 border-b-2 border-line bg-transparent pb-1 text-[28px] text-ink outline-none transition focus:border-violet-500"
            style={{ fontFamily: "'Snell Roundhand','Segoe Script','Brush Script MT',cursive" }}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-[12px] text-ink-400"><LockOutlined /> eIDAS &amp; ESIGN compliant · IP + timestamp logged</span>
            <button
              onClick={() => name.trim() && setSigned(true)}
              className={`rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white transition-all ${signed ? "bg-emerald-500" : "bg-violet-600 hover:bg-violet-700 hover:shadow-lift"}`}
            >
              {signed ? <><CheckOutlined /> Signed</> : "Sign & accept"}
            </button>
          </div>
        </div>
        {signed && (
          <div className="mt-3 animate-pop rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] font-medium text-emerald-700">
            Signed by {name} · just now · you were notified instantly
          </div>
        )}
      </div>
    </div>
  );
}

function PortalPanel() {
  const [tab, setTab] = useState("Overview");
  const [paid, setPaid] = useState(false);
  const tabs = ["Overview", "Files", "Invoices", "Messages"];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="bg-gradient-to-br from-brand-700 to-brand-500 px-5 pt-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 font-display font-extrabold text-white">A</span>
          <div>
            <div className="text-[14px] font-bold text-white">Acme Corp</div>
            <div className="text-[12px] text-white/70">Website redesign · Project hub</div>
          </div>
          <span className="ml-auto rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">Your logo here</span>
        </div>
        <div className="flex gap-1" role="tablist">
          {tabs.map(t => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`rounded-t-xl px-4 py-2 text-[13px] font-semibold transition ${tab === t ? "bg-white text-brand-700" : "text-white/80 hover:bg-white/10"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div key={tab} className="min-h-[300px] animate-pop p-5">
        {tab === "Overview" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { i: <FolderOpenOutlined />, l: "3 files shared", c: "text-brand-600 bg-brand-50" },
              { i: <DollarOutlined />, l: "2 invoices", c: "text-amber-600 bg-amber-50" },
              { i: <MessageOutlined />, l: "4 messages", c: "text-violet-600 bg-violet-50" },
              { i: <CheckOutlined />, l: "1 contract signed", c: "text-emerald-600 bg-emerald-50" },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-3 rounded-xl border border-line p-3.5">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${s.c}`}>{s.i}</span>
                <span className="text-[14px] font-semibold text-ink-700">{s.l}</span>
              </div>
            ))}
            <div className="rounded-xl bg-canvas p-3.5 text-[13px] text-ink-500 sm:col-span-2">One link. No login for your client. Fully branded as <b className="text-ink">your</b> studio.</div>
          </div>
        )}
        {tab === "Files" && (
          <div className="space-y-2">
            {["Homepage-v3.fig", "Brand-guidelines.pdf", "Signed-contract.pdf"].map(f => (
              <div key={f} className="flex items-center justify-between rounded-xl border border-line px-4 py-3 transition hover:border-brand-300 hover:shadow-soft">
                <span className="flex items-center gap-3 text-[14px] font-medium text-ink-700"><FileTextOutlined className="text-brand-600" />{f}</span>
                <span className="text-[12px] text-ink-300">Download</span>
              </div>
            ))}
          </div>
        )}
        {tab === "Invoices" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
              <div><div className="text-[14px] font-semibold text-ink-700">Phase 1 · Discovery</div><div className="text-[12px] text-ink-300">$2,400</div></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-600">Paid</span>
            </div>
            <div className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${paid ? "border-emerald-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/60"}`}>
              <div><div className="text-[14px] font-semibold text-ink-700">Phase 2 · Design</div><div className="text-[12px] text-ink-400">$2,500 · due in 3 days</div></div>
              <button onClick={() => setPaid(true)} disabled={paid}
                className={`rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition ${paid ? "bg-emerald-500" : "bg-brand-600 hover:bg-brand-700 hover:shadow-lift"}`}>
                {paid ? <><CheckOutlined /> Paid</> : "Pay $2,500"}
              </button>
            </div>
            {paid && <div className="animate-pop text-[12.5px] text-emerald-600">Payment received. You and your client both get a receipt.</div>}
          </div>
        )}
        {tab === "Messages" && (
          <div className="space-y-3">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-canvas px-4 py-2.5 text-[14px] text-ink-700">Love the homepage direction! Can we see a darker variant?</div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-[14px] text-white">Absolutely, uploading it to Files now.</div>
            <div className="flex items-center gap-1 pl-2" aria-label="Client is typing">
              {[0, 1, 2].map(i => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-300" style={{ animationDelay: `${i * 120}ms` }} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SECTIONS = [
  { name: "Investment", pct: 92, time: "2m 41s" },
  { name: "Scope of work", pct: 68, time: "1m 55s" },
  { name: "Timeline", pct: 44, time: "1m 02s" },
  { name: "About you", pct: 22, time: "0m 28s" },
];
const FEED = [
  { icon: <EyeOutlined />, t: "Jordan opened your proposal", s: "4 min ago", c: "text-brand-600 bg-brand-50" },
  { icon: <ClockCircleOutlined />, t: "Spent 2m 41s on Investment", s: "3 min ago", c: "text-amber-600 bg-amber-50" },
  { icon: <CheckOutlined />, t: "Proposal accepted & signed", s: "1 min ago", c: "text-emerald-600 bg-emerald-50" },
];

function InsightsPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-display text-[17px] font-bold text-ink">Where your client spent their time</div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand-700">3 views</span>
        </div>
        <div className="space-y-3.5">
          {SECTIONS.map((s, i) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-[13px]"><span className="font-medium text-ink-700">{s.name}</span><span className="tabular-nums text-ink-400">{s.time}</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full origin-left animate-[grow_.9s_ease-out_both] rounded-full bg-gradient-to-r from-brand-400 to-violet-500" style={{ width: `${s.pct}%`, animationDelay: `${i * 120}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-3 shadow-soft">
        {FEED.map(f => (
          <div key={f.t} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-canvas">
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${f.c}`}>{f.icon}</span>
            <div className="flex-1 text-[13.5px] font-medium text-ink-700">{f.t}</div>
            <span className="text-[12px] text-ink-300">{f.s}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </div>
  );
}

/* ───────────────────────── tabs ───────────────────────── */

const TABS: { key: string; icon: ReactNode; title: string; blurb: string; tone: string; panel: ReactNode }[] = [
  { key: "proposals", icon: <ThunderboltFilled />, title: "AI proposals", tone: "from-brand-500 to-brand-700",
    blurb: "Answer five questions or paste a job post. Claude writes a tailored proposal with Good / Better / Best pricing and a Stripe deposit link.", panel: <ProposalPanel /> },
  { key: "contracts", icon: <SafetyCertificateOutlined />, title: "Contracts & e-sign", tone: "from-violet-500 to-violet-700",
    blurb: "15 contract types, jurisdiction-aware for 249 countries. Clients sign by typing or drawing, with no account needed.", panel: <ContractPanel /> },
  { key: "portal", icon: <GlobalOutlined />, title: "Client portal", tone: "from-emerald-500 to-emerald-700",
    blurb: "One branded link for files, invoices, signed contracts and chat. Your clients stop emailing you for everything.", panel: <PortalPanel /> },
  { key: "insights", icon: <BarChartOutlined />, title: "Deal insights", tone: "from-amber-500 to-orange-600",
    blurb: "Know the moment a proposal is opened, what they read, and when to follow up. Never chase blind again.", panel: <InsightsPanel /> },
];

export default function FeatureExplorer() {
  const [active, setActive] = useState(0);
  const cur = TABS[active];

  return (
    <section id="product" className="relative scroll-mt-20 py-24 sm:py-28" aria-label="Product">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">One calm workspace</span>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[46px]">From first pitch to final payment.</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-500">Replace Google Drive, DocuSign, Wave and half your inbox. Try the real thing below. Every card is clickable.</p>
        </Reveal>

        <Reveal delay={100} className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div role="tablist" aria-orientation="vertical" className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.key} role="tab" aria-selected={on} onClick={() => setActive(i)}
                  className={`group min-w-[260px] rounded-2xl border p-5 text-left transition-all duration-300 lg:min-w-0 ${
                    on ? "border-brand-200 bg-white shadow-lift" : "border-transparent hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-[17px] text-white shadow-soft transition-transform duration-300 ${t.tone} ${on ? "scale-100" : "scale-90 opacity-80 group-hover:scale-95"}`}>{t.icon}</span>
                    <span className={`font-display text-[17px] font-bold ${on ? "text-ink" : "text-ink-500"}`}>{t.title}</span>
                  </div>
                  <div className={`grid transition-all duration-300 ${on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <p className="overflow-hidden text-[14.5px] leading-relaxed text-ink-500">{t.blurb}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-white via-canvas to-brand-50/60 p-5 shadow-soft sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
            <div key={cur.key} className="relative animate-pop" role="tabpanel">{cur.panel}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

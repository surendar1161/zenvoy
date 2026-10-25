"use client";

import { useState } from "react";
import {
  CheckCircleFilled, DownloadOutlined, FileTextOutlined, CheckSquareOutlined,
  DollarOutlined, MailOutlined, LockOutlined, ArrowRightOutlined,
} from "@ant-design/icons";
import { Reveal } from "@/components/site/motion";
import { Button, ButtonLink } from "@/components/site/ui";

const ITEMS = [
  { icon: <FileTextOutlined />, title: "5 proposal templates", desc: "Web dev, design, SEO, consulting and copywriting, ready to send", tone: "bg-brand-50 text-brand-600" },
  { icon: <CheckSquareOutlined />, title: "Proposal checklist", desc: "12 points used by freelancers with 60%+ close rates", tone: "bg-emerald-50 text-emerald-600" },
  { icon: <DollarOutlined />, title: "Freelance rate guide", desc: "Market rates for 10 professions across the US, UK and AU", tone: "bg-amber-50 text-amber-600" },
  { icon: <MailOutlined />, title: "5 follow-up scripts", desc: "What to say when they go quiet, politely and effectively", tone: "bg-violet-50 text-violet-600" },
];

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "lead_magnet", magnet: "proposal_templates" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const field = "h-12 w-full rounded-xl border border-line bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-ink-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

  return (
    <section className="px-5 py-8 sm:px-6 sm:py-12" aria-label="Free freelance proposal template pack">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 shadow-soft sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" aria-hidden />
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-brand-700 shadow-soft">
              <DownloadOutlined /> Free resource pack
            </span>
            <h2 className="mt-5 text-[30px] font-extrabold leading-tight text-ink sm:text-[40px]">Get 5 freelance proposal templates, free.</h2>
            <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-500">Used by 1,200+ freelancers to win higher-paying clients. Drop your email and get the full pack instantly. No spam, ever.</p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ITEMS.map(i => (
                <li key={i.title} className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[16px] ${i.tone}`}>{i.icon}</span>
                  <div>
                    <div className="text-[14.5px] font-semibold text-ink">{i.title}</div>
                    <div className="text-[13px] leading-snug text-ink-400">{i.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
            {done ? (
              <div className="animate-pop py-4 text-center" role="status">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-[28px] text-emerald-500"><CheckCircleFilled /></span>
                <div className="mt-4 font-display text-[22px] font-bold text-ink">You&rsquo;re in!</div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">The pack is on its way to <b className="text-ink">{email}</b>. While you wait, try DealPilot and generate your first proposal in 60 seconds.</p>
                <ButtonLink href="/sign-up" size="lg" className="mt-6 w-full">Try DealPilot free <ArrowRightOutlined className="text-[13px]" /></ButtonLink>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="font-display text-[20px] font-bold text-ink">Get your free pack</div>
                <div className="mt-1 text-[13.5px] text-ink-400">4 resources · Instant access · No credit card</div>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="lm-name" className="mb-1.5 block text-[13px] font-semibold text-ink-700">Your name <span className="font-normal text-ink-300">(optional)</span></label>
                    <input id="lm-name" className={field} placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="lm-email" className="mb-1.5 block text-[13px] font-semibold text-ink-700">Work email</label>
                    <input id="lm-email" type="email" required className={field} placeholder="you@yourstudio.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!error} />
                  </div>
                  {error && <div className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600" role="alert">{error}</div>}
                  <Button type="submit" size="lg" className="w-full" disabled={!email || loading}>
                    {loading ? "Sending…" : <>Send me the free pack <ArrowRightOutlined className="text-[13px]" /></>}
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-400"><LockOutlined /> No spam. Unsubscribe anytime.</div>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PLANS } from "@/lib/plans";
import { ButtonLink } from "@/components/site/ui";

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time from the billing portal. You keep Pro/Business access until the end of your billing period." },
  { q: "Is there a free trial?", a: "The Free plan is available permanently — no credit card required. Upgrade whenever you're ready." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Invoicing available for Business annual plans." },
  { q: "Can I switch between monthly and yearly?", a: "Yes, you can switch at any time from your billing portal. Proration is handled automatically." },
  { q: "Do you offer refunds?", a: "We do not currently offer refunds. You can cancel your subscription at any time and you will not be charged again." },
  { q: "What happens when I hit the free plan limit?", a: "You'll be prompted to upgrade. Existing proposals and contracts are never deleted." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-6 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="dp-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Pricing</span>
          <h1 className="mt-3 text-[clamp(34px,5vw,52px)] font-extrabold leading-[1.1] tracking-tight text-ink">Plans that grow with you</h1>
          <p className="mt-4 text-[17px] text-ink-500">Start free. Upgrade when you&rsquo;re ready. No hidden fees.</p>
          <div className="mt-8 inline-flex rounded-full border border-line bg-white p-1 shadow-soft" role="group" aria-label="Billing period">
            {[{ l: "Monthly", v: false }, { l: "Yearly", v: true }].map(o => (
              <button key={o.l} type="button" onClick={() => setYearly(o.v)} aria-pressed={yearly === o.v}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition ${yearly === o.v ? "bg-ink text-white" : "text-ink-500 hover:text-ink"}`}>
                {o.l}
                {o.v && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">Save 25%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map(plan => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isFree = plan.id === "free";
            const pop = !!plan.popular;
            return (
              <div key={plan.id} className={`relative flex h-full flex-col rounded-[28px] p-7 sm:p-8 ${pop ? "bg-gradient-to-b from-ink to-ink-800 text-white shadow-float ring-1 ring-brand-400/40 lg:-my-3" : "border border-line bg-white shadow-soft"}`}>
                {pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-4 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white shadow-glow">Most popular</span>}
                <div className="font-display text-[20px] font-bold">{plan.name}</div>
                <div className={`text-[13.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>{plan.tagline}</div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-[52px] font-extrabold leading-none tabular-nums">${price}</span>
                  <span className={`pb-2 text-[14px] ${pop ? "text-ink-300" : "text-ink-400"}`}>/mo</span>
                </div>
                <div className={`mt-1 h-5 text-[12.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>
                  {yearly && !isFree ? `Billed $${plan.yearlyTotal}/year` : !yearly && !isFree ? `Switch to yearly and save $${(plan.monthlyPrice - plan.yearlyPrice) * 12}/yr` : "Free forever"}
                </div>
                <Link href={isFree ? "/sign-up" : `/sign-up?plan=${plan.id}&period=${yearly ? "yearly" : "monthly"}`}
                  className={`mt-6 block rounded-2xl py-3.5 text-center text-[15px] font-semibold ${pop ? "dp-btn-primary text-white" : "border border-line bg-canvas text-ink hover:border-brand-300"}`}>
                  {isFree ? "Start free — no card" : pop ? "Start with Pro" : "Get Business"}
                </Link>
                <ul className="mt-7 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-[14.5px] ${pop ? "text-ink-200" : "text-ink-600"}`}>
                      <CheckOutlined className={`mt-1 text-[12px] ${pop ? "text-brand-300" : "text-emerald-600"}`} />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded?.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-ink-300">
                      <CloseOutlined className="mt-1 text-[12px]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-[13.5px] text-ink-400">
          All plans include AI generation, Stripe payment links, web proposal URLs, a cover page, 15 contract types, and support.
        </p>
      </section>

      <section className="px-5 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[32px] font-extrabold text-ink">Questions, answered.</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQ.map(item => (
              <div key={item.q} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                <div className="font-display text-[16px] font-bold text-ink">{item.q}</div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-gradient-to-br from-ink via-ink-800 to-brand-900 px-6 py-14 text-center text-white shadow-float sm:px-12">
          <div className="dp-grid absolute inset-0 opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-[30px] font-extrabold sm:text-[36px]">Need more than 5 team members?</h2>
            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-ink-300">Talk to us about an Enterprise plan — custom pricing, SLA, dedicated support, and SSO.</p>
            <div className="mt-8">
              <ButtonLink href="/sign-up?plan=business" variant="light" size="lg" className="font-bold">Contact sales</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

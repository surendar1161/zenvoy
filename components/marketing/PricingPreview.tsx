"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0, yearlyPrice: 0,
    features: ["5 proposals/month", "2 contracts/month", "All 15 contract types", "19+ templates", "Brand kit", "Stripe payment links"],
    missing: ["E-signatures", "Analytics", "Client portals"],
  },
  {
    name: "Pro",
    monthlyPrice: 12, yearlyPrice: 9,
    popular: true,
    features: ["Unlimited proposals & contracts", "Digital e-signatures", "Proposal analytics", "Client portals", "Content library", "White-label branding", "Priority support"],
    missing: [],
  },
  {
    name: "Business",
    monthlyPrice: 29, yearlyPrice: 22,
    features: ["Everything in Pro", "5 team members", "API access", "Custom domain", "Dedicated onboarding"],
    missing: [],
  },
];

export default function PricingPreview() {
  const [yearly, setYearly] = useState(true);

  return (
    <section aria-label="Pricing" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Pricing</span>
          <h2 className="mt-3 text-[32px] font-extrabold leading-tight text-ink sm:text-[42px]">Simple, honest pricing.</h2>
          <p className="mt-3 text-[16px] text-ink-500">Start free. Upgrade when you&rsquo;re ready.</p>
          <div className="mt-7 inline-flex rounded-full border border-line bg-white p-1 shadow-soft" role="group" aria-label="Billing period">
            {[{ l: "Monthly", v: false }, { l: "Yearly", v: true }].map(o => (
              <button key={o.l} type="button" onClick={() => setYearly(o.v)} aria-pressed={yearly === o.v}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition ${yearly === o.v ? "bg-ink text-white" : "text-ink-500 hover:text-ink"}`}>
                {o.l}
                {o.v && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">Save 25%</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map(plan => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const pop = !!plan.popular;
            return (
              <div key={plan.name} className={`flex h-full flex-col rounded-[28px] p-7 sm:p-8 ${pop ? "bg-gradient-to-b from-ink to-ink-800 text-white shadow-float ring-1 ring-brand-400/40 lg:-my-3" : "border border-line bg-white shadow-soft"}`}>
                {pop && <span className="mb-4 w-fit rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Most popular</span>}
                <div className="font-display text-[20px] font-bold">{plan.name}</div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-[52px] font-extrabold leading-none tabular-nums">${price}</span>
                  <span className={`pb-2 text-[14px] ${pop ? "text-ink-300" : "text-ink-400"}`}>/mo</span>
                </div>
                <Link href={`/sign-up?plan=${plan.name.toLowerCase()}&period=${yearly ? "yearly" : "monthly"}`}
                  className={`mt-6 block rounded-2xl py-3.5 text-center text-[15px] font-semibold ${pop ? "dp-btn-primary text-white" : "border border-line bg-canvas text-ink hover:border-brand-300"}`}>
                  {plan.name === "Free" ? "Start free" : `Get ${plan.name}`}
                </Link>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-[14px] ${pop ? "text-ink-200" : "text-ink-600"}`}>
                      <CheckOutlined className={`mt-1 text-[12px] ${pop ? "text-brand-300" : "text-emerald-600"}`} />
                      {f}
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-ink-300">
                      <CloseOutlined className="mt-1 text-[12px]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

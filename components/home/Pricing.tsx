"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Reveal, useAnimatedNumber } from "@/components/site/motion";

const PLANS = [
  { name: "Free", tag: "For trying it out", monthly: 0, yearly: 0,
    features: ["5 proposals / month", "2 contracts / month", "All 15 contract types", "19+ templates", "Brand kit & Stripe links"] },
  { name: "Pro", tag: "For solo freelancers", monthly: 12, yearly: 9, popular: true,
    features: ["Unlimited proposals & contracts", "Digital e-signatures", "Proposal analytics", "Client portals", "White-label, no DealPilot branding", "Priority support"] },
  { name: "Business", tag: "For small studios", monthly: 29, yearly: 22,
    features: ["Everything in Pro", "5 team members", "Manager approvals", "Custom domain & API access", "Dedicated onboarding call"] },
];

function Price({ value }: { value: number }) {
  const v = useAnimatedNumber(value, 400);
  return <>{Math.round(v)}</>;
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-20 py-16 sm:py-24" aria-label="Pricing">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Pricing</span>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[46px]">Simple, honest pricing.</h2>
          <p className="mt-4 text-[17px] text-ink-500">Start free. Upgrade when you&rsquo;re closing more deals than the free plan allows.</p>

          <div className="mt-8 inline-flex rounded-full border border-line bg-white p-1 shadow-soft" role="group" aria-label="Billing period">
            {[{ l: "Monthly", v: false }, { l: "Yearly", v: true }].map(o => (
              <button key={o.l} onClick={() => setYearly(o.v)} aria-pressed={yearly === o.v}
                className={`relative rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-300 ${yearly === o.v ? "bg-ink text-white shadow-soft" : "text-ink-500 hover:text-ink"}`}>
                {o.l}
                {o.v && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">Save 25%</span>}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? p.yearly : p.monthly;
            const pop = !!p.popular;
            return (
              <Reveal key={p.name} delay={i * 90} className={pop ? "lg:-my-4" : ""}>
                <div className={`relative flex h-full flex-col rounded-[28px] p-7 transition-all duration-300 hover:-translate-y-1 sm:p-8 ${
                  pop ? "bg-gradient-to-b from-ink to-ink-800 text-white shadow-float ring-1 ring-brand-400/40" : "border border-line bg-white shadow-soft hover:shadow-lift"
                }`}>
                  {pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-4 py-1 text-[11.5px] font-bold uppercase tracking-wider text-white shadow-glow">Most popular</span>}
                  <div className="font-display text-[20px] font-bold">{p.name}</div>
                  <div className={`text-[13.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>{p.tag}</div>

                  <div className="mt-6 flex items-end gap-1.5">
                    <span className="font-display text-[56px] font-extrabold leading-none tabular-nums">$<Price value={price} /></span>
                    <span className={`pb-2 text-[14px] ${pop ? "text-ink-300" : "text-ink-400"}`}>/ month</span>
                  </div>
                  <div className={`mt-1 h-5 text-[12.5px] ${pop ? "text-ink-300" : "text-ink-400"}`}>{yearly && price > 0 ? `Billed $${price * 12} per year` : price === 0 ? "Free forever" : "Billed monthly"}</div>

                  <Link href={`/sign-up?plan=${p.name.toLowerCase()}&period=${yearly ? "yearly" : "monthly"}`}
                    className={`mt-6 block rounded-2xl py-3.5 text-center text-[15px] font-semibold transition-all ${
                      pop ? "dp-btn-primary text-white" : "border border-line bg-canvas text-ink hover:border-brand-300 hover:bg-white hover:shadow-soft"
                    }`}>
                    {p.name === "Free" ? "Start free" : `Get ${p.name}`}
                  </Link>

                  <ul className="mt-7 space-y-3">
                    {p.features.map(f => (
                      <li key={f} className={`flex items-start gap-3 text-[14.5px] ${pop ? "text-ink-300" : "text-ink-500"}`}>
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${pop ? "bg-brand-500/20 text-brand-300" : "bg-emerald-50 text-emerald-600"}`}><CheckOutlined /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-10 text-center text-[13.5px] text-ink-400">Cancel anytime · No hidden fees · All plans include Claude-powered generation</p>
      </div>
    </section>
  );
}

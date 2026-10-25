"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Reveal } from "@/components/site/motion";

const FAQ = [
  { q: "How does the AI generate proposals?", a: "You answer five questions, or paste a job post. Claude writes a fully tailored proposal in under 60 seconds, mirroring your client's language and addressing their specific pain points. You can regenerate any section and pick from three alternatives." },
  { q: "Are the contracts legally binding?", a: "Contracts follow the right legal frameworks for the jurisdiction you choose (UCC, ESIGN, state-specific rules and more). We always recommend a licensed attorney review high-value or complex engagements before signing." },
  { q: "Do my clients need an account?", a: "No. Clients open proposals and portals from a unique link. They can sign, pay, message you and download files with no login and no app." },
  { q: "Can I use my own branding?", a: "Yes. Upload your logo, set your colours and choose your font. Proposals, contracts, portals and cover pages all use your brand, and clients never see DealPilot on Pro and Business." },
  { q: "Which payment providers do you support?", a: "Stripe powers deposit links, milestone payments and invoices. PayPal and GoCardless are on the roadmap." },
  { q: "Is there a free trial?", a: "The Free plan is free forever with no credit card: 5 proposals and 2 contracts a month. Upgrade to Pro when you want unlimited everything." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <Reveal className="text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">FAQ</span>
          <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[42px]">Questions, answered.</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div className={`rounded-2xl border bg-white transition-all duration-300 ${on ? "border-brand-200 shadow-lift" : "border-line shadow-soft hover:border-brand-200"}`}>
                  <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(on ? null : i)} aria-expanded={on}>
                    <span className="font-display text-[16.5px] font-bold text-ink">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] transition-all duration-300 ${on ? "rotate-45 bg-brand-600 text-white" : "bg-canvas text-ink-500"}`}><PlusOutlined /></span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="px-6 pb-5 text-[15px] leading-relaxed text-ink-500">{f.a}</p></div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

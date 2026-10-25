"use client";

import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

interface FAQ {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
}

export default function FAQSection({ title = "Frequently Asked Questions", subtitle, faqs }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-label="FAQ" className="border-t border-line px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">FAQ</span>
          <h2 className="mt-3 text-[32px] font-extrabold leading-tight text-ink sm:text-[40px]">{title}</h2>
          {subtitle && <p className="mt-3 text-[16px] text-ink-500">{subtitle}</p>}
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const on = open === i;
            return (
              <div key={item.q} className={`rounded-2xl border bg-white transition-all duration-300 ${on ? "border-brand-200 shadow-lift" : "border-line shadow-soft"}`}>
                <button type="button" className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(on ? null : i)} aria-expanded={on}>
                  <span className="font-display text-[16px] font-bold text-ink">{item.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] transition-all duration-300 ${on ? "rotate-45 bg-brand-600 text-white" : "bg-canvas text-ink-500"}`}>
                    <PlusOutlined />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-ink-500">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

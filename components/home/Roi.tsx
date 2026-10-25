"use client";

import { useAnimatedNumber, Reveal } from "@/components/site/motion";
import { useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";

const WITH_DEALPILOT_MIN = 10; // generation + a quick human review

function Slider({ label, value, min, max, step = 1, format, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; format: (n: number) => string; onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <label className="text-[14.5px] font-semibold text-ink-700">{label}</label>
        <span className="font-display text-[20px] font-extrabold tabular-nums text-ink">{format(value)}</span>
      </div>
      <input
        type="range" className="dp-range" min={min} max={max} step={step} value={value}
        style={{ ["--p" as string]: `${pct}%` }}
        onChange={e => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

export default function Roi() {
  const [perMonth, setPerMonth] = useState(8);
  const [minutes, setMinutes] = useState(120);
  const [rate, setRate] = useState(60);

  const hours = Math.max(0, (perMonth * 12 * (minutes - WITH_DEALPILOT_MIN)) / 60);
  const value = hours * rate;
  const hShown = useAnimatedNumber(hours, 500);
  const vShown = useAnimatedNumber(value, 500);
  const days = hours / 8;

  return (
    <section className="py-16 sm:py-24" aria-label="Time savings calculator">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="grid overflow-hidden rounded-[32px] border border-line bg-white shadow-lift grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="p-7 sm:p-10">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-emerald-600"><ClockCircleOutlined /> Time calculator</span>
            <h2 className="mt-3 text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">What is an hour of your time worth?</h2>
            <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-ink-500">Slide to match your reality. See what you get back every year when proposals take minutes, not evenings.</p>
            <div className="mt-8 space-y-7">
              <Slider label="Proposals you send per month" value={perMonth} min={1} max={40} format={n => `${n}`} onChange={setPerMonth} />
              <Slider label="Time per proposal today" value={minutes} min={30} max={240} step={5} format={n => `${Math.floor(n / 60)}h ${String(n % 60).padStart(2, "0")}m`} onChange={setMinutes} />
              <Slider label="Your hourly rate" value={rate} min={20} max={200} step={5} format={n => `$${n}`} onChange={setRate} />
            </div>
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden bg-gradient-to-br from-ink via-ink-800 to-brand-900 p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" aria-hidden />
            <div className="relative">
              <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-300">You get back</div>
              <div className="mt-2 font-display text-[64px] font-extrabold leading-none tabular-nums sm:text-[76px]">{Math.round(hShown)}<span className="ml-2 text-[24px] font-bold text-ink-300">hours / year</span></div>
              <div className="mt-2 text-[15px] text-ink-300">That&rsquo;s about <b className="text-white">{days.toFixed(days >= 10 ? 0 : 1)} full working days</b> back in your calendar.</div>
              <div className="my-7 h-px bg-white/10" />
              <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Worth roughly</div>
              <div className="mt-1 font-display text-[42px] font-extrabold tabular-nums text-emerald-300">${Math.round(vShown).toLocaleString()}</div>
              <p className="mt-5 text-[12px] leading-relaxed text-ink-400">Estimate assumes ~{WITH_DEALPILOT_MIN} minutes per proposal with DealPilot (generation plus a quick review). Your results will vary.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

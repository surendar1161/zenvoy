"use client";

import Link from "next/link";
import { ConfigProvider } from "antd";
import { CheckOutlined, EyeOutlined, EditOutlined, DollarOutlined } from "@ant-design/icons";
import { antdTheme } from "@/lib/theme";
import Logo from "@/components/site/Logo";

type Variant = "signin" | "signup" | "recover";

const COPY: Record<Variant, { title: string; sub: string; bullets?: string[] }> = {
  signin: {
    title: "Your envoy kept working while you were away.",
    sub: "Pick up where you left off. Proposals opened, contracts signed, deposits paid.",
  },
  signup: {
    title: "Win more clients with proposals that close themselves.",
    sub: "Free to start. No credit card required.",
    bullets: [
      "AI proposals in under 60 seconds",
      "Stripe payment links, auto-generated",
      "Contracts and e-signatures built in",
      "A branded portal your clients will love",
    ],
  },
  recover: {
    title: "Back in flight in a minute.",
    sub: "We'll get you safely back to your deals.",
  },
};

const EVENTS = [
  { icon: <EyeOutlined />, tone: "bg-brand-50 text-brand-600", t: "Acme Corp opened your proposal", s: "2 min ago", cls: "animate-float" },
  { icon: <EditOutlined />, tone: "bg-emerald-50 text-emerald-600", t: "Jordan Lee signed the contract", s: "Just now", cls: "animate-float-slow ml-8" },
  { icon: <DollarOutlined />, tone: "bg-violet-50 text-violet-600", t: "$2,400 deposit received", s: "Stripe", cls: "animate-float" },
];

/**
 * Split-screen shell for every auth screen. Includes the Ant Design theme so forms
 * pick up brand colours, radii and type (the old auth pages had no provider at all).
 */
export default function AuthShell({ variant = "signin", children }: { variant?: Variant; children: React.ReactNode }) {
  const copy = COPY[variant];

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="dp-auth grid min-h-screen bg-canvas lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-ink via-ink-800 to-brand-900 text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16" aria-hidden={false}>
          <div className="dp-grid absolute inset-0 opacity-25" aria-hidden />
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-aurora rounded-full bg-brand-500/40 blur-[110px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 animate-aurora rounded-full bg-violet-500/40 blur-[110px]" style={{ animationDelay: "-6s" }} aria-hidden />

          <Link href="/" className="relative w-fit" aria-label="DealPilot home"><Logo light /></Link>

          <div className="relative max-w-md">
            <h1 className="text-[34px] font-extrabold leading-[1.1] xl:text-[40px]">{copy.title}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-300">{copy.sub}</p>

            {copy.bullets ? (
              <ul className="mt-8 space-y-3.5">
                {copy.bullets.map(b => (
                  <li key={b} className="flex items-center gap-3 text-[15px] text-white/90">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-[11px] text-emerald-300"><CheckOutlined /></span>
                    {b}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 space-y-3" aria-hidden>
                {EVENTS.map(e => (
                  <div key={e.t} className={`flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-ink shadow-float ${e.cls}`}>
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${e.tone}`}>{e.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold">{e.t}</div>
                      <div className="text-[11.5px] text-ink-400">{e.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <figure className="relative max-w-md border-t border-white/10 pt-6">
            <blockquote className="text-[14.5px] leading-relaxed text-ink-300">
              &ldquo;I used to spend 2 hours on every proposal. Now it&rsquo;s done in 60 seconds, and my win rate actually went up.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[13px] font-semibold text-white">Marcus R. <span className="font-normal text-ink-400">· UX designer, London</span></figcaption>
          </figure>
        </aside>

        {/* Form side */}
        <main className="relative flex flex-col items-center justify-center px-5 py-10 sm:px-8">
          <div className="dp-grid absolute inset-0 opacity-60 lg:opacity-40" aria-hidden />
          <div className="relative w-full max-w-[440px]">
            <Link href="/" className="mb-8 block w-fit lg:hidden" aria-label="DealPilot home"><Logo /></Link>
            {children}
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
}

/** Heading block used above each auth form. */
export function AuthHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-[28px] font-extrabold leading-tight text-ink sm:text-[32px]">{title}</h2>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{sub}</p>}
    </div>
  );
}

/** White card that holds the form. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">{children}</div>;
}

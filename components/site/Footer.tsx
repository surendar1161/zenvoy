import Link from "next/link";
import Logo from "./Logo";

const COLS = [
  { h: "Product", l: [["AI proposals", "/ai-proposal-generator"], ["Contracts", "/features/contracts"], ["E-signatures", "/features/e-signatures"], ["Invoicing", "/features/invoicing"], ["Client portal", "/features/client-portal"]] },
  { h: "For", l: [["Designers", "/for/designers"], ["Web developers", "/for/web-developers"], ["Copywriters", "/for/copywriters"], ["Consultants", "/for/consultants"], ["Agencies", "/for/marketing-agencies"]] },
  { h: "Compare", l: [["vs Bonsai", "/alternative/bonsai"], ["vs HoneyBook", "/alternative/honeybook"], ["vs PandaDoc", "/alternative/pandadoc"], ["vs Proposify", "/alternative/proposify"]] },
  { h: "Resources", l: [["Blog", "/blog"], ["Proposal templates", "/proposal-templates"], ["Free proposal maker", "/free-proposal-maker"], ["Pricing", "/pricing"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white" aria-label="Footer">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/"><Logo /></Link>
          <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-ink-400">Your AI envoy for every client, every deal. Calm tools for freelancers who&rsquo;d rather be creating.</p>
        </div>
        {COLS.map(c => (
          <nav key={c.h} aria-label={c.h}>
            <div className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink">{c.h}</div>
            <ul className="mt-4 space-y-2.5">
              {c.l.map(([t, h]) => <li key={t}><Link href={h} className="text-[14px] text-ink-400 transition hover:text-brand-600">{t}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-[12.5px] text-ink-300 sm:px-6">
          <span>© {new Date().getFullYear()} DealPilot. All rights reserved.</span>
          <span>Built with Claude AI · Stripe · Supabase</span>
        </div>
      </div>
    </footer>
  );
}

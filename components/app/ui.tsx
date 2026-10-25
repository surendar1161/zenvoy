import Link from "next/link";
import type { ReactNode } from "react";

/** Shared "Calm Flight" primitives for authenticated pages. */

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto px-5 py-8 sm:px-7 sm:py-10 ${wide ? "max-w-[1300px]" : "max-w-[1100px]"}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title, sub, action, count,
}: { title: string; sub?: string; action?: ReactNode; count?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[30px] font-extrabold tracking-tight text-ink sm:text-[34px]">{title}</h1>
        {sub && <p className="mt-1 max-w-xl text-[15px] text-ink-500">{sub}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {count != null && count !== "" && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-[12.5px] font-bold text-brand-700">{count}</span>
        )}
        {action}
      </div>
    </div>
  );
}

const STAT_TONES = {
  brand: "bg-brand-50 text-brand-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  rose: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
  slate: "bg-slate-100 text-ink-500",
} as const;

export function Stat({
  icon, label, value, sub, tone = "brand",
}: { icon?: ReactNode; label: string; value: ReactNode; sub?: string; tone?: keyof typeof STAT_TONES }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-400">{label}</div>
          <div className="mt-1 font-display text-[26px] font-extrabold leading-none tabular-nums text-ink">{value}</div>
          {sub && <div className="mt-2 text-[12.5px] text-ink-400">{sub}</div>}
        </div>
        {icon && <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[16px] ${STAT_TONES[tone]}`}>{icon}</span>}
      </div>
    </Card>
  );
}

export function Card({
  children, className = "", padded = true, href,
}: { children: ReactNode; className?: string; padded?: boolean; href?: string }) {
  const cls = `rounded-3xl border border-line bg-white shadow-soft ${padded ? "p-6" : ""} ${className}`;
  if (href) return <Link href={href} className={`${cls} block transition hover:-translate-y-0.5 hover:shadow-lift`}>{children}</Link>;
  return <div className={cls}>{children}</div>;
}

export function SectionTitle({
  icon, title, href, hrefLabel = "View all",
}: { icon?: ReactNode; title: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-[14px] text-brand-600">{icon}</span>}
        <h2 className="font-display text-[16px] font-bold text-ink">{title}</h2>
      </div>
      {href && <Link href={href} className="text-[13px] font-semibold text-brand-600 hover:text-brand-700">{hrefLabel}</Link>}
    </div>
  );
}

const TONES = {
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-800 border-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  slate: "bg-slate-50 text-ink-500 border-line",
} as const;

export function Banner({
  tone = "brand", icon, title, body, action,
}: { tone?: keyof typeof TONES; icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 ${TONES[tone]}`}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 text-[18px]">{icon}</span>}
        <div className="min-w-0">
          <div className="text-[14px] font-bold">{title}</div>
          {body && <div className="mt-0.5 text-[13px] opacity-80">{body}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-slate-100 text-ink-500",
    sent: "bg-brand-50 text-brand-700",
    viewed: "bg-cyan-50 text-cyan-700",
    accepted: "bg-emerald-50 text-emerald-700",
    signed: "bg-emerald-50 text-emerald-700",
    declined: "bg-rose-50 text-rose-700",
    expired: "bg-amber-50 text-amber-700",
    paid: "bg-emerald-50 text-emerald-700",
    overdue: "bg-rose-50 text-rose-700",
    cancelled: "bg-slate-100 text-ink-400",
    reviewed: "bg-brand-50 text-brand-700",
    terminated: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${map[status] ?? "bg-slate-100 text-ink-500"}`}>
      {status}
    </span>
  );
}

export function Trend({ value, label }: { value: number; label?: string }) {
  if (!Number.isFinite(value) || value === 0) {
    return <span className="text-[12px] font-medium text-ink-300">{label ?? "No change"}</span>;
  }
  const up = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${up ? "text-emerald-600" : "text-rose-500"}`}>
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      {Math.abs(Math.round(value))}%{label ? ` ${label}` : ""}
    </span>
  );
}

export function EmptyState({
  icon, title, body, children,
}: { icon: ReactNode; title: string; body: string; children?: ReactNode }) {
  return (
    <Card className="border-dashed py-16 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-[28px] text-brand-600">{icon}</span>
      <h3 className="mt-5 font-display text-[22px] font-extrabold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-500">{body}</p>
      {children && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </Card>
  );
}

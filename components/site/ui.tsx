import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

/**
 * "Calm Flight" marketing primitives (Tailwind).
 * Dashboard / form screens use the Ant Design theme in lib/theme.ts,
 * which is driven by the same tokens, so both stay visually in sync.
 */

type Variant = "primary" | "secondary" | "light" | "ghost";
type Size = "md" | "lg";

const BASE = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const SIZES: Record<Size, string> = {
  md: "h-10 rounded-xl px-4 text-[14px]",
  lg: "h-[52px] rounded-2xl px-7 text-[16px]",
};
const VARIANTS: Record<Variant, string> = {
  primary: "dp-btn-primary text-white",
  secondary: "border border-line bg-white text-ink-700 shadow-soft hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift",
  light: "bg-white text-ink shadow-lift hover:-translate-y-0.5 hover:shadow-float",
  ghost: "text-ink-700 hover:bg-white/80 hover:text-brand-600",
};

export function btnClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${extra}`.trim();
}

export function ButtonLink({
  href, variant = "primary", size = "md", className = "", children,
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode }) {
  return <Link href={href} className={btnClass(variant, size, className)}>{children}</Link>;
}

export function Button({
  variant = "primary", size = "md", className = "", ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={btnClass(variant, size, className)} {...rest} />;
}

const EYEBROW_TONES = { brand: "text-brand-600", violet: "text-violet-600", emerald: "text-emerald-600" } as const;

/** Centered section intro: eyebrow + H2 + optional sub-copy. */
export function SectionHeading({
  eyebrow, title, sub, tone = "brand", align = "center",
}: { eyebrow?: string; title: ReactNode; sub?: ReactNode; tone?: keyof typeof EYEBROW_TONES; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <span className={`text-[13px] font-semibold uppercase tracking-[0.16em] ${EYEBROW_TONES[tone]}`}>{eyebrow}</span>}
      <h2 className="mt-3 text-[34px] font-extrabold leading-tight text-ink sm:text-[46px]">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed text-ink-500">{sub}</p>}
    </div>
  );
}

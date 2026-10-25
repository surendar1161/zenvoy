export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-400 via-brand-600 to-violet-600 shadow-[0_6px_16px_rgba(2,132,199,.4)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 3 2.5 10.6l7 2.9 2.9 7 9.1-17.5Z" />
        <path d="m9.5 13.5 5-5" />
      </svg>
    </span>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className={`font-display text-[19px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Deal<span className={light ? "text-brand-300" : "text-brand-600"}>Pilot</span>
      </span>
    </span>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuOutlined, CloseOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Logo from "./Logo";
import { ButtonLink } from "./ui";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#why", label: "Why DealPilot" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

/**
 * Floating glass nav. On the home page it starts transparent over the hero;
 * on every other public page (`solid`) it is always glass so content never clashes.
 */
export default function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const glass = solid || scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-300 sm:px-5 ${
          glass ? "dp-glass shadow-lift" : "border border-transparent"
        }`}
        aria-label="Primary"
      >
        <Link href="/" aria-label="DealPilot home"><Logo /></Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(l => (
            <li key={l.label}>
              <Link href={l.href} className="rounded-lg px-3.5 py-2 text-[14px] font-medium text-ink-500 transition-colors hover:bg-white/80 hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/sign-in" className="rounded-lg px-3.5 py-2 text-[14px] font-semibold text-ink-700 transition-colors hover:text-brand-600">Sign in</Link>
          <ButtonLink href="/sign-up">Start free <ArrowRightOutlined className="text-[11px]" /></ButtonLink>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-700 hover:bg-white/80 md:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </nav>

      {open && (
        <div className="dp-glass mx-auto mt-2 max-w-6xl animate-pop rounded-2xl p-3 shadow-lift md:hidden">
          {LINKS.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-medium text-ink-700 hover:bg-white">
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/sign-in" className="rounded-xl border border-line bg-white px-4 py-3 text-center text-[14px] font-semibold text-ink-700">Sign in</Link>
            <Link href="/sign-up" className="dp-btn-primary rounded-xl px-4 py-3 text-center text-[14px] font-semibold text-white">Start free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

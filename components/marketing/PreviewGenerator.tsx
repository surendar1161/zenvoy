"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { BRIEF_MAX, BRIEF_MIN } from "@/lib/public-preview";
import { saveHandoff } from "@/lib/preview-handoff";
import type { ProposalTool } from "@/lib/proposal-catalog";

export default function PreviewGenerator({ tool }: { tool: ProposalTool }) {
  const [brief, setBrief] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [signUpPrompt, setSignUpPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const source = `${tool.slug.slice(0, 32)}-preview`;
  const signUpHref = `/sign-up?source=${source}`;

  async function generate() {
    setError("");
    setSignUpPrompt(false);
    setLoading(true);
    try {
      const res = await fetch("/api/public-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: tool.slug, brief }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSignUpPrompt(!!data.signUp);
        return;
      }
      setPreview(data.preview);
      saveHandoff({ slug: tool.slug, projectType: tool.name, brief: brief.trim() });
      trackEvent("preview_generated", { generator: tool.slug });
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tooShort = brief.trim().length < BRIEF_MIN;

  return (
    <section id="try-it" aria-label={`Try the ${tool.name} generator`} className="border-t border-line bg-canvas px-5 py-14 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-600">Try it now · no sign-up</p>
        <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-ink">Paste the brief, see the opening of your {tool.noun}</h2>

        <label htmlFor="brief" className="sr-only">Project brief</label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value.slice(0, BRIEF_MAX))}
          rows={6}
          placeholder={`Paste the client's message or job post. Example: "We need ${tool.who === "freelancers" ? "someone" : "a " + tool.who.replace(/s$/, "")} to help with ${tool.work}. Budget is flexible, we want to start next month."`}
          className="mt-5 w-full rounded-2xl border border-line bg-white p-4 text-[15px] leading-relaxed text-ink shadow-soft outline-none focus:border-brand-400"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12.5px] text-ink-400">{brief.length}/{BRIEF_MAX} · Don&rsquo;t paste anything confidential. Previews are free, 3 per hour.</span>
          <button
            type="button"
            onClick={generate}
            disabled={loading || tooShort}
            className="dp-btn-primary rounded-2xl px-6 py-3 text-[15px] font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Writing…" : "Preview my proposal"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
            {error}{" "}
            {signUpPrompt && <Link href={signUpHref} className="font-semibold underline">Sign up free</Link>}
          </p>
        )}

        {preview && (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-line bg-white shadow-soft" aria-live="polite">
            <div className="whitespace-pre-wrap p-6 text-[15px] leading-relaxed text-ink-700">{preview}</div>
            <div className="relative border-t border-line bg-gradient-to-b from-white to-canvas p-6 text-center">
              <p className="text-[14px] text-ink-500">
                The full {tool.noun} also has deliverables, timeline, fee and payment terms, a branded link, e-signature and a deposit payment link.
              </p>
              <Link
                href={signUpHref}
                onClick={() => trackEvent("preview_cta_click", { generator: tool.slug })}
                className="dp-btn-primary mt-4 inline-block rounded-2xl px-6 py-3 text-[15px] font-semibold text-white"
              >
                Get the full proposal free
              </Link>
              <p className="mt-2 text-[12.5px] text-ink-400">Free plan: 5 proposals/month · No credit card</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import BlogArticle from "@/components/marketing/BlogArticle";
import { FEATURED_PROPOSAL_TOOLS } from "@/lib/proposal-catalog";

const p = { fontSize: 16, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" } as const;
const h2 = { fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "40px 0 12px", letterSpacing: "-0.3px" } as const;

export default function BestAIProposalGeneratorsPage() {
  return (
    <BlogArticle
      tag="Roundup"
      title="11 Best AI Proposal Generators in 2026"
      subtitle="Eleven DealPilot generators for the briefs freelancers actually get. Each one writes a scoped proposal you can send, sign, and attach a payment to."
      date="November 9, 2026"
      dateIso="2026-11-09"
      path="/blog/best-ai-proposal-generators"
      readTime="8 min read"
      faqs={[
        {
          q: "What is the best AI proposal generator for freelancers?",
          a: "Start with the freelance proposal generator if the brief is general. If you already know the job — design, web, SEO, video, consulting — open that generator so the draft uses the right deliverables.",
        },
        {
          q: "Why use a generator instead of a chatbot?",
          a: "A chatbot returns paragraphs. These generators sit inside a proposal you can brand, e-sign, and connect to a Stripe deposit.",
        },
      ]}
    >
      <p style={p}>
        A proposal generator is only useful if the next step is sending it. This list is the eleven DealPilot generators to open first. The full catalog is on the{" "}
        <Link href="/generate/proposal">proposal generators</Link> page.
      </p>
      {FEATURED_PROPOSAL_TOOLS.map((tool, index) => (
        <section key={tool.slug}>
          <h2 style={h2}>
            {index + 1}. {tool.title}
          </h2>
          <p style={p}>{tool.subtitle}</p>
          <p style={p}>
            <Link href={tool.path}>{tool.title} →</Link>
          </p>
        </section>
      ))}
      <p style={p}>
        For a comparison against ChatGPT, Proposify, PandaDoc, HoneyBook, and Bonsai, read{" "}
        <Link href="/blog/best-ai-proposal-writers">9 best AI proposal writers</Link>.
      </p>
    </BlogArticle>
  );
}

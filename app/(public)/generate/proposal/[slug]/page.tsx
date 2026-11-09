import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProposalToolPage from "@/components/marketing/ProposalToolPage";
import { PROPOSAL_TOOLS, getProposalTool } from "@/lib/proposal-catalog";

type Params = { slug: string };

export function generateStaticParams() {
  return PROPOSAL_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const tool = getProposalTool(params.slug);
  if (!tool) return { title: "Proposal generator" };
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: tool.path },
    openGraph: {
      type: "website",
      url: tool.path,
      title: `${tool.seoTitle} | DealPilot`,
      description: tool.seoDescription,
    },
  };
}

export default function Page({ params }: { params: Params }) {
  const tool = getProposalTool(params.slug);
  if (!tool) notFound();
  return <ProposalToolPage tool={tool} />;
}

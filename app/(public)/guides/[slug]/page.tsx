import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideArticle from "@/components/marketing/GuideArticle";
import { GUIDES, getGuide } from "@/lib/guides";
import { getPageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide" };
  return getPageMetadata(`/guides/${guide.slug}`);
}

export default function GuidePage({ params }: { params: Params }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}

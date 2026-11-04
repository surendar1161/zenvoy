import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratorLanding from "@/components/marketing/GeneratorLanding";
import { GENERATORS, getGenerator } from "@/lib/generators";
import { getPageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return GENERATORS.map((generator) => ({ slug: generator.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const generator = getGenerator(params.slug);
  if (!generator) return { title: "AI generator" };
  return getPageMetadata(`/ai-generators/${generator.slug}`);
}

export default function GeneratorPage({ params }: { params: Params }) {
  const generator = getGenerator(params.slug);
  if (!generator) notFound();
  return <GeneratorLanding generator={generator} />;
}

import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import Proof from "@/components/home/Proof";
import FeatureExplorer from "@/components/home/FeatureExplorer";
import Bento from "@/components/home/Bento";
import Roi from "@/components/home/Roi";
import Social from "@/components/home/Social";
import LeadMagnet from "@/components/home/LeadMagnet";
import Pricing from "@/components/home/Pricing";
import Faq from "@/components/home/Faq";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = getPageMetadata("/");

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Proof />
      <FeatureExplorer />
      <Bento />
      <Roi />
      <Social />
      <LeadMagnet />
      <Pricing />
      <Faq />
      <FinalCta />
    </main>
  );
}

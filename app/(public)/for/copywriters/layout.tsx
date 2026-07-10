import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/for/copywriters");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

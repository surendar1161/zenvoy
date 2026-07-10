import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/features/e-signatures");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

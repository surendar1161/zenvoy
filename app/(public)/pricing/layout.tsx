import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/pricing");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

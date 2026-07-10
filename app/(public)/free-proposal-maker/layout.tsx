import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/free-proposal-maker");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

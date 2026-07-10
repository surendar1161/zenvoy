import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/blog/how-to-follow-up-on-a-proposal");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

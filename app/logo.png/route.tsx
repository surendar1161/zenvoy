import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand-mark";

export const runtime = "edge";

/** Stable logo URL used by the Organization structured data. */
export function GET() {
  return new ImageResponse(<BrandMark size={512} />, { width: 512, height: 512 });
}

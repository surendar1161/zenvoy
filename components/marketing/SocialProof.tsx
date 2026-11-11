"use client";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface SocialProofProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

/**
 * Testimonials are intentionally not rendered. The quotes passed in by the pages
 * were placeholders written before launch, not statements from real customers.
 * Re-enable this section only with real, attributable quotes the customer agreed to.
 */
export default function SocialProof(_props: SocialProofProps) {
  return null;
}

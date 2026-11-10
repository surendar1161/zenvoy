import { track } from "@vercel/analytics";

type AnalyticsEvent =
  | "signup_email"
  | "signup_google"
  | "signup_completed"
  | "checkout_started"
  | "subscription_upgraded"
  | "preview_generated"
  | "preview_cta_click"
  | "proposal_generated"
  | "proposal_link_copied";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  try {
    track(event, properties);
  } catch {
    // Analytics should never block user flows
  }
  try {
    // Lets Google Tag Manager trigger conversions (for example a sign-up) from the same events.
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...properties });
  } catch {
    // Not in a browser, or blocked: ignore
  }
}

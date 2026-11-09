import { track } from "@vercel/analytics";

type AnalyticsEvent =
  | "signup_email"
  | "signup_google"
  | "signup_completed"
  | "checkout_started"
  | "subscription_upgraded"
  | "preview_generated"
  | "preview_cta_click";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  try {
    track(event, properties);
  } catch {
    // Analytics should never block user flows
  }
}

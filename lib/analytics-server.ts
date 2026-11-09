import { track } from "@vercel/analytics/server";

type Props = Record<string, string | number | boolean>;

/** Server-side funnel event. Never throws: analytics must not break an API route. */
export async function trackServer(event: string, properties?: Props): Promise<void> {
  try {
    await track(event, properties);
  } catch {
    /* ignore */
  }
}

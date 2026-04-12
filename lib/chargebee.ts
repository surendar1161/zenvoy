// eslint-disable-next-line @typescript-eslint/no-require-imports
const ChargeBee = require("chargebee");

type ChargebeeClient = {
  hosted_page: {
    checkout_new_for_items: (params: Record<string, unknown>) => Promise<{ hosted_page: { url: string; id: string } }>;
  };
  portal_session: {
    create: (params: Record<string, unknown>) => Promise<{ portal_session: { access_url: string } }>;
  };
};

let _cb: ChargebeeClient | null = null;

export function getChargebee(): ChargebeeClient {
  if (!_cb) {
    if (!process.env.CHARGEBEE_SITE || !process.env.CHARGEBEE_API_KEY) {
      throw new Error("CHARGEBEE_SITE and CHARGEBEE_API_KEY are required");
    }
    const instance = new ChargeBee.Chargebee();
    instance.configure({
      site: process.env.CHARGEBEE_SITE,
      api_key: process.env.CHARGEBEE_API_KEY,
    });
    _cb = instance as ChargebeeClient;
  }
  return _cb;
}

export const isChargebeeConfigured =
  !!process.env.CHARGEBEE_SITE &&
  !process.env.CHARGEBEE_SITE.includes("placeholder") &&
  !!process.env.CHARGEBEE_API_KEY &&
  !process.env.CHARGEBEE_API_KEY.includes("placeholder");

// Plan IDs — must match what you create in Chargebee dashboard
export const CHARGEBEE_PLANS = {
  pro_monthly:       process.env.CHARGEBEE_PRO_MONTHLY_PLAN_ID      ?? "pro-monthly",
  pro_yearly:        process.env.CHARGEBEE_PRO_YEARLY_PLAN_ID        ?? "pro-yearly",
  business_monthly:  process.env.CHARGEBEE_BUSINESS_MONTHLY_PLAN_ID  ?? "business-monthly",
  business_yearly:   process.env.CHARGEBEE_BUSINESS_YEARLY_PLAN_ID   ?? "business-yearly",
} as const;

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

// Product Catalog 2.0 item price IDs — must match Chargebee → Plans → Pricing → Plan Price Point ID.
export const CHARGEBEE_PLANS = {
  pro_monthly:       process.env.CHARGEBEE_PRO_MONTHLY_PLAN_ID      ?? "pro-monthly",
  pro_yearly:        process.env.CHARGEBEE_PRO_YEARLY_PLAN_ID        ?? "pro-yearly",
  business_monthly:  process.env.CHARGEBEE_BUSINESS_MONTHLY_PLAN_ID  ?? "business-monthly",
  business_yearly:   process.env.CHARGEBEE_BUSINESS_YEARLY_PLAN_ID   ?? "business-yearly",
} as const;

export function resolveChargebeePlanId(planKey: string): string | undefined {
  return CHARGEBEE_PLANS[planKey as keyof typeof CHARGEBEE_PLANS];
}

function chargebeeAuthHeader(apiKey: string) {
  return "Basic " + Buffer.from(`${apiKey}:`).toString("base64");
}

function buildCheckoutBody(params: {
  itemPriceId: string;
  redirectUrl: string;
  cancelUrl: string;
  userId: string;
  plan: string;
  billingPeriod: string;
  customerId?: string | null;
  email?: string | null;
  fullName?: string | null;
}) {
  const body = new URLSearchParams({
    "subscription_items[item_price_id][0]": params.itemPriceId,
    "subscription_items[quantity][0]": "1",
    redirect_url: params.redirectUrl,
    cancel_url: params.cancelUrl,
    "subscription[meta_data][supabase_user_id]": params.userId,
    "subscription[meta_data][plan]": params.plan,
    "subscription[meta_data][billing_period]": params.billingPeriod,
  });

  if (params.customerId) {
    body.set("customer[id]", params.customerId);
    body.set("customer[meta_data][supabase_user_id]", params.userId);
  } else {
    body.set("customer[email]", params.email ?? "");
    const [firstName, ...rest] = (params.fullName ?? "").split(" ");
    body.set("customer[first_name]", firstName ?? "");
    body.set("customer[last_name]", rest.join(" "));
    body.set("customer[meta_data][supabase_user_id]", params.userId);
  }

  return body;
}

export function chargebeeItemPriceNotFoundMessage(itemPriceId: string, site: string) {
  return (
    `${itemPriceId} not found as a Chargebee item price on site "${site}". ` +
    `Open each plan in Chargebee → Pricing → set USD price → copy "Plan Price Point ID", ` +
    `then set CHARGEBEE_*_PLAN_ID in Vercel to match.`
  );
}

export async function createChargebeeCheckoutSession(params: {
  site: string;
  apiKey: string;
  planId: string;
  plan: string;
  billingPeriod: string;
  userId: string;
  email?: string | null;
  fullName?: string | null;
  customerId?: string | null;
  redirectUrl: string;
  cancelUrl: string;
}) {
  const body = buildCheckoutBody({
    itemPriceId: params.planId,
    redirectUrl: params.redirectUrl,
    cancelUrl: params.cancelUrl,
    userId: params.userId,
    plan: params.plan,
    billingPeriod: params.billingPeriod,
    customerId: params.customerId,
    email: params.email,
    fullName: params.fullName,
  });

  const res = await fetch(`https://${params.site}.chargebee.com/api/v2/hosted_pages/checkout_new_for_items`, {
    method: "POST",
    headers: {
      Authorization: chargebeeAuthHeader(params.apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await res.json() as Record<string, unknown>;

  if (res.ok && data.hosted_page && typeof data.hosted_page === "object" && "url" in data.hosted_page) {
    const hostedPage = data.hosted_page as { url: string; id: string };
    return {
      ok: true as const,
      url: hostedPage.url,
      hostedPageId: hostedPage.id,
    };
  }

  const apiMessage = typeof data.message === "string" ? data.message : undefined;
  const message =
    apiMessage ??
    chargebeeItemPriceNotFoundMessage(params.planId, params.site);

  return {
    ok: false as const,
    status: res.status,
    error: message,
    detail: data,
    planId: params.planId,
    site: params.site,
  };
}

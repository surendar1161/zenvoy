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

/** Product Catalog 2.0 item prices (default) or legacy plan IDs. */
export type ChargebeeCatalog = "items" | "plans";

export function getChargebeeCatalog(): ChargebeeCatalog {
  const catalog = process.env.CHARGEBEE_CATALOG?.toLowerCase();
  if (catalog === "plans" || catalog === "legacy") return "plans";
  return "items";
}

// IDs must match Chargebee exactly — Item Price IDs (PC 2.0) or Plan IDs (legacy).
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

function isResourceNotFound(data: { api_error_code?: string }) {
  return data.api_error_code === "resource_not_found";
}

function buildCheckoutBody(params: {
  catalog: ChargebeeCatalog;
  planId: string;
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
    redirect_url: params.redirectUrl,
    cancel_url: params.cancelUrl,
    "subscription[meta_data][supabase_user_id]": params.userId,
    "subscription[meta_data][plan]": params.plan,
    "subscription[meta_data][billing_period]": params.billingPeriod,
  });

  if (params.catalog === "plans") {
    body.set("subscription[plan_id]", params.planId);
  } else {
    body.set("subscription_items[item_price_id][0]", params.planId);
    body.set("subscription_items[quantity][0]", "1");
  }

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

async function requestCheckout(
  site: string,
  apiKey: string,
  catalog: ChargebeeCatalog,
  body: URLSearchParams,
) {
  const endpoint = catalog === "plans"
    ? "hosted_pages/checkout_new"
    : "hosted_pages/checkout_new_for_items";

  const res = await fetch(`https://${site}.chargebee.com/api/v2/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: chargebeeAuthHeader(apiKey),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await res.json();
  return { res, data, catalog };
}

export function chargebeeNotFoundMessage(planId: string, site: string, catalog: ChargebeeCatalog) {
  return (
    `${planId} not found as a Chargebee item price on site "${site}". ` +
    `Plan IDs (e.g. pro-monthly) are not the same as Price Point IDs. ` +
    `Open each plan in Chargebee → Pricing → copy "Plan Price Point ID", ` +
    `then set CHARGEBEE_*_PLAN_ID in Vercel to those values. ` +
    `If price points are missing, click Set Price on each plan first.`
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
  const preferredCatalog = getChargebeeCatalog();
  const catalogsToTry: ChargebeeCatalog[] =
    preferredCatalog === "plans" ? ["plans"] : ["items", "plans"];

  let lastResult: { res: Response; data: Record<string, unknown>; catalog: ChargebeeCatalog } | null = null;

  for (const catalog of catalogsToTry) {
    const body = buildCheckoutBody({ ...params, catalog });
    const result = await requestCheckout(params.site, params.apiKey, catalog, body);
    lastResult = result;

    if (result.res.ok && result.data.hosted_page?.url) {
      return {
        ok: true as const,
        url: result.data.hosted_page.url as string,
        hostedPageId: result.data.hosted_page.id as string,
        catalog,
      };
    }

    if (!isResourceNotFound(result.data)) break;
  }

  const catalog = lastResult?.catalog ?? preferredCatalog;
  const message =
    (lastResult?.data.message as string | undefined) ??
    chargebeeNotFoundMessage(params.planId, params.site, catalog);

  return {
    ok: false as const,
    status: lastResult?.res.status ?? 500,
    error: message,
    detail: lastResult?.data,
    catalog,
    planId: params.planId,
    site: params.site,
  };
}

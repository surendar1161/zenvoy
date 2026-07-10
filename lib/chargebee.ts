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

export type ChargebeeItemPriceSummary = {
  id: string;
  item_id: string;
  name: string;
  currency_code: string;
  price: number;
  period_unit: string;
  status: string;
};

function chargebeeAuthHeader(apiKey: string) {
  return "Basic " + Buffer.from(`${apiKey}:`).toString("base64");
}

async function chargebeeGet(site: string, apiKey: string, path: string) {
  const res = await fetch(`https://${site}.chargebee.com/api/v2/${path}`, {
    headers: { Authorization: chargebeeAuthHeader(apiKey) },
  });
  const data = await res.json() as Record<string, unknown>;
  return { ok: res.ok, status: res.status, data };
}

export async function listChargebeeItemPrices(site: string, apiKey: string): Promise<ChargebeeItemPriceSummary[]> {
  const { ok, data } = await chargebeeGet(site, apiKey, "item_prices?limit=100&status[is]=active");
  if (!ok || !Array.isArray(data.list)) return [];

  return data.list
    .map((entry) => {
      const itemPrice = (entry as { item_price?: Record<string, unknown> }).item_price;
      if (!itemPrice || typeof itemPrice.id !== "string") return null;
      return {
        id: itemPrice.id,
        item_id: String(itemPrice.item_id ?? ""),
        name: String(itemPrice.name ?? ""),
        currency_code: String(itemPrice.currency_code ?? ""),
        price: Number(itemPrice.price ?? 0),
        period_unit: String(itemPrice.period_unit ?? ""),
        status: String(itemPrice.status ?? ""),
      };
    })
    .filter((row): row is ChargebeeItemPriceSummary => row !== null);
}

export async function validateChargebeePlanConfig(site: string, apiKey: string) {
  const configured = Object.entries(CHARGEBEE_PLANS).map(([key, id]) => ({ key, id }));
  const itemPrices = await listChargebeeItemPrices(site, apiKey);
  const activeIds = new Set(itemPrices.map((p) => p.id));

  const checks = await Promise.all(
    configured.map(async ({ key, id }) => ({
      key,
      configured_id: id,
      exists: activeIds.has(id) || (await chargebeeGet(site, apiKey, `item_prices/${encodeURIComponent(id)}`)).ok,
    })),
  );

  return {
    site,
    configured: checks,
    missing: checks.filter((c) => !c.exists).map((c) => c.configured_id),
    active_item_prices: itemPrices,
  };
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

function formatPriceCents(cents: number, currency: string) {
  if (currency === "USD") return `$${(cents / 100).toFixed(2)}`;
  return `${cents} ${currency}`;
}

export function chargebeeItemPriceNotFoundMessage(
  itemPriceId: string,
  site: string,
  available: ChargebeeItemPriceSummary[] = [],
) {
  const availableIds = available.map((p) => p.id);
  const hint = availableIds.length
    ? ` Active item price IDs in Chargebee: ${availableIds.join(", ")}. Update CHARGEBEE_*_PLAN_ID in Vercel to one of these.`
    : ` No active item prices found on site "${site}". Open each plan → Pricing → Set Price (USD) and set Plan Price Point ID.`;

  return `${itemPriceId} not found as a Chargebee item price.${hint}`;
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

  const isNotFound =
    data.api_error_code === "resource_not_found" ||
    data.error_code === "resource_not_found";

  let available: ChargebeeItemPriceSummary[] = [];
  if (isNotFound) {
    available = await listChargebeeItemPrices(params.site, params.apiKey);
  }

  const apiMessage = typeof data.message === "string" ? data.message : undefined;
  const message = isNotFound
    ? chargebeeItemPriceNotFoundMessage(params.planId, params.site, available)
    : (apiMessage ?? "Chargebee checkout failed");

  return {
    ok: false as const,
    status: res.status,
    error: message,
    detail: {
      ...data,
      requested_item_price_id: params.planId,
      available_item_prices: available.map((p) => ({
        id: p.id,
        item_id: p.item_id,
        price: formatPriceCents(p.price, p.currency_code),
        period: p.period_unit,
      })),
    },
    planId: params.planId,
    site: params.site,
  };
}

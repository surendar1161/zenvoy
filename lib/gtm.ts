/** Google Tag Manager container for dealpilot.co.in (override with NEXT_PUBLIC_GTM_ID). */
export const DEFAULT_GTM_ID = "GTM-PW6H8RDZ";

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]{4,12}$/;

export function isValidGtmId(id: string | undefined | null): id is string {
  return typeof id === "string" && GTM_ID_PATTERN.test(id);
}

/** Returns the container id to load, or null when it should not load. */
export function resolveGtmId(
  envId: string | undefined,
  nodeEnv: string | undefined,
): string | null {
  if (nodeEnv === "development") return null;
  const id = envId && envId.trim() !== "" ? envId.trim() : DEFAULT_GTM_ID;
  return isValidGtmId(id) ? id : null;
}

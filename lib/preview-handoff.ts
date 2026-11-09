/**
 * Carries the brief a visitor typed into the public generator preview over to
 * the signed-in generator after sign-up. Stored in localStorage, so it only
 * works in the same browser, and it expires after seven days.
 */

export const HANDOFF_KEY = "dealpilot_preview_handoff";
export const HANDOFF_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PreviewHandoff = {
  v: 1;
  slug: string;
  projectType: string;
  brief: string;
  savedAt: number;
};

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function defaultStore(): Store | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function saveHandoff(
  data: { slug: string; projectType: string; brief: string },
  store: Store | null = defaultStore(),
  now: number = Date.now(),
): void {
  if (!store) return;
  try {
    const value: PreviewHandoff = { v: 1, ...data, savedAt: now };
    store.setItem(HANDOFF_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable or full: the handoff is a convenience only */
  }
}

/** Returns the saved handoff, or null if absent, malformed, or expired. */
export function loadHandoff(
  store: Store | null = defaultStore(),
  now: number = Date.now(),
): PreviewHandoff | null {
  if (!store) return null;
  try {
    const raw = store.getItem(HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PreviewHandoff>;
    if (
      parsed?.v !== 1 ||
      typeof parsed.brief !== "string" ||
      typeof parsed.slug !== "string" ||
      typeof parsed.projectType !== "string" ||
      typeof parsed.savedAt !== "number"
    ) {
      store.removeItem(HANDOFF_KEY);
      return null;
    }
    if (now - parsed.savedAt > HANDOFF_TTL_MS || !parsed.brief.trim()) {
      store.removeItem(HANDOFF_KEY);
      return null;
    }
    return parsed as PreviewHandoff;
  } catch {
    return null;
  }
}

export function clearHandoff(store: Store | null = defaultStore()): void {
  try {
    store?.removeItem(HANDOFF_KEY);
  } catch {
    /* ignore */
  }
}

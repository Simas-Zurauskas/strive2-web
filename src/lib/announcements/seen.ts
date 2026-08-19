/**
 * Which announcements this browser has already seen.
 *
 * Stored in `localStorage`, matching what the app already does for this class
 * of state — dismissed chips (`screens/GenerateCourseScreen/internal/
 * DepthContextChip.tsx:120`), font scale, expanded modules, narration
 * position. Consequence, accepted deliberately: seen-state is per-device, so
 * reading on a laptop still leaves one dot on a phone. The cost of being wrong
 * is a single extra dot, which does not justify a schema change and an
 * endpoint.
 *
 * ── Everything here is defensive on purpose ──────────────────────────────
 * The stored value is NOT trustworthy. Any extension, any other script, and
 * the user themselves can write anything to this key, and a browser can refuse
 * the whole API: Safari in private mode throws on `window.localStorage`
 * PROPERTY ACCESS, before any method is called, and a full quota throws on
 * `setItem`. Every one of those degrades to "nothing seen" — the user sees an
 * announcement twice, which is the harmless direction to fail in.
 */

export const STORAGE_KEY = 'strive:announcements:seen';

/**
 * Resolve the real store, or null.
 *
 * Note this is a FUNCTION called inside the guarded helpers below, not a
 * default parameter expression. A default argument is evaluated before the
 * function body runs, so writing `storage = window.localStorage` in the
 * parameter list would put the one code path that actually ships outside every
 * try/catch in this file — and since the tests all inject a double, that path
 * would have had no coverage at all.
 */
const defaultStorage = (): Storage | null => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
};

/** Seen keys, or `[]` for anything unreadable. Never throws. */
export const getSeen = (storage?: Storage | null): string[] => {
  const store = storage === undefined ? defaultStorage() : storage;
  try {
    const raw = store?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter rather than cast: a hand-edited value can hold anything, and a
    // non-string in here would silently never match a key.
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
};

/**
 * Add keys to the seen set. Additive and idempotent.
 *
 * Additive matters for two reasons: two tabs racing on this key means the
 * loser only re-shows an already-read item rather than wiping the set, and a
 * key for an announcement no longer in the shipped list is preserved, so
 * re-adding that announcement later does not resurface it.
 */
export const markSeen = (keys: readonly string[], storage?: Storage | null): void => {
  const store = storage === undefined ? defaultStorage() : storage;
  try {
    const next = Array.from(new Set([...getSeen(store), ...keys]));
    store?.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or a disabled store. The dot stays; nothing else breaks.
  }
};

/** Keys in `allKeys` that are not in `seen`, in list order. */
export const unseenKeys = (allKeys: readonly string[], seen: readonly string[]): string[] => {
  const seenSet = new Set(seen);
  return allKeys.filter((k) => !seenSet.has(k));
};

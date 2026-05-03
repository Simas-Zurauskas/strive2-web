// Validates a `?redirect=` query value before using it for navigation. Returns
// the path if it is a safe same-origin path; otherwise returns the fallback.
//
// Why a manual check rather than `new URL(redirect, origin).pathname`:
// - `//evil.com/path` is a protocol-relative URL — browsers + Next.js router
//   treat it as cross-origin even though it starts with a slash.
// - `/\evil.com` and similar can also escape on some parsers.
// We accept only paths that start with a single `/` followed by something
// other than `/` or `\`, and reject control characters that could be used for
// header-injection if the value is reflected anywhere downstream.

const hasControlChar = (s: string): boolean => {
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
};

export const safeRedirect = (raw: string | null | undefined, fallback = '/'): string => {
  if (!raw) return fallback;
  if (typeof raw !== 'string') return fallback;
  if (!raw.startsWith('/')) return fallback;
  // Reject protocol-relative URLs (`//host/...`) and backslash variants.
  if (raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  if (hasControlChar(raw)) return fallback;
  if (raw.length > 1024) return fallback;
  return raw;
};

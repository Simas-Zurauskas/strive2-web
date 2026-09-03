type Format = 'short' | 'long' | 'cell';

// Date inputs in this app are almost always yyyy-mm-dd strings. We append a
// zero-time suffix so `new Date()` interprets them in local time instead of UTC.
const parse = (input: Date | string) =>
  typeof input === 'string' ? new Date(input.includes('T') ? input : `${input}T00:00:00`) : input;

export const formatDate = ({ input, format = 'short' }: { input: Date | string; format?: Format }) => {
  const date = parse(input);
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    case 'cell':
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// ── Editorial / content dates ────────────────────────────────────────────
//
// Blog frontmatter (`published`, `updated`) and KB frontmatter (`updated`) are
// CALENDAR dates: `2026-05-10` means the 10th of May everywhere on earth, not
// an instant. Formatting one through `new Date()` + `toLocaleDateString()`
// makes the output depend on TWO ambient values that differ between the Node
// render and the browser render of the very same component:
//
//   1. Locale. `toLocaleDateString(undefined, …)` resolves to the runtime
//      default — en-US on the server, the visitor's locale in the browser.
//      en-GB emits "10 May 2026" where en-US emits "May 10, 2026".
//   2. Time zone. `new Date('2026-05-10')` (no time part) is parsed as UTC
//      midnight. Rendered in America/Los_Angeles that prints "May 9, 2026".
//      Pinning the locale alone does NOT fix this — the server runs UTC and
//      roughly every US visitor is behind it.
//
// Either one is a hydration mismatch: React throws, discards the subtree and
// regenerates it, and the date visibly swaps after load. So: no `Date`, no
// `Intl`, no ambient anything. Split the ISO string and index a frozen table —
// the same twelve strings on both sides of the wire, on every machine, forever.
const CONTENT_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

/** 'long' → "May 10, 2026"; 'short' → "Jul 28, 2026". Both reproduce exactly
 *  what the server was already emitting via en-US, so no rendered copy moves
 *  and nothing an indexer already crawled changes. */
export type ContentDateStyle = 'long' | 'short';

export const formatContentDate = (iso: string, style: ContentDateStyle = 'long'): string => {
  const m = ISO_CALENDAR_DATE.exec(iso.trim());
  if (!m) return iso;
  const monthIndex = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) return iso;
  const month = CONTENT_MONTHS[monthIndex];
  return `${style === 'short' ? month.slice(0, 3) : month} ${day}, ${m[1]}`;
};

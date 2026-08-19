/**
 * The announcement record, and the one ordering rule the panel depends on.
 *
 * Content lives in `@/content/announcements` as a plain TS module rather than
 * as markdown files on disk. That is forced, not preferred: the repo's
 * markdown-on-disk loader is `fs` + `gray-matter` evaluated at module load
 * (`src/lib/kb/loader.ts:1-14`), which is server-only, and the panel is a
 * client component. A TS module holding markdown strings is importable from
 * one; a filesystem loader is not.
 */

export interface Announcement {
  /** Stable id. Never reuse or renumber one — it is the seen-state key. */
  key: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  title: string;
  /** Markdown. Rendered through the shared `Markdown` component. */
  body: string;
  /**
   * Optional illustration, shown above the body.
   *
   * `src` is a path under `public/`, never a remote URL: the content is ours,
   * it should not depend on a third party staying up, and a remote host would
   * need a `next.config` image domain entry to be usable here at all.
   * `alt` is required rather than optional — an announcement image that
   * carries meaning and has no alt text is a hole for anyone using a screen
   * reader, and making it optional is how that happens.
   */
  image?: { src: string; alt: string; width: number; height: number };
}

/**
 * Newest first — the requirement's "latest being on top".
 *
 * Copies before sorting: the shipped list is a module singleton shared by
 * every consumer, and `Array.prototype.sort` mutates in place.
 */
export const sortedAnnouncements = (list: readonly Announcement[]): Announcement[] =>
  [...list].sort((a, b) => b.date.localeCompare(a.date));

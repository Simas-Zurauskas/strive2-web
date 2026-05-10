// Next.js shallow-merges metadata between segments — when a child route
// defines `openGraph` or `twitter`, the parent's values for those keys are
// fully replaced, not deep-merged. Pages that override these blocks must
// spread these defaults to preserve the social card image.

export const DEFAULT_OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Strive — personal AI courses with live-generated lessons and daily review',
} as const;

export const DEFAULT_OG_IMAGES = [DEFAULT_OG_IMAGE];

export const DEFAULT_TWITTER_IMAGES = ['/og.png'];

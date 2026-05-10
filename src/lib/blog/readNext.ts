// Curated "Read next" map. One specific recommendation per post — the post
// the author wants the reader to land on after this one, regardless of
// chronological order or category overlap.
//
// Why curated: the auto-derived "Related reading" already shows three
// adjacent-by-category posts. The "Read next" slot is editorial — a single
// strong recommendation, like a magazine pull-quote rather than a search
// result.

// Server-only — depends on the loader. Import from app routes directly.
import { getBlogPost } from './loader';
import type { BlogPost } from './types';

const READ_NEXT_MAP: Record<string, string> = {
  'why-most-courses-dont-stick': 'active-recall-vs-rereading',
  'active-recall-vs-rereading': 'how-to-keep-what-you-learn',
  'the-forgetting-curve-140-years-on': 'why-most-courses-dont-stick',
  'how-to-keep-what-you-learn': 'active-recall-vs-rereading',
  'why-we-dont-use-vector-embeddings': 'lesson-streaming-block-by-block',
  'lesson-streaming-block-by-block': 'why-we-dont-use-vector-embeddings',
  'what-1820-people-want-to-learn': 'why-most-courses-dont-stick',
};

export const getReadNext = (post: BlogPost): BlogPost | undefined => {
  const targetSlug = READ_NEXT_MAP[post.slug];
  if (!targetSlug) return undefined;
  return getBlogPost(targetSlug);
};

'use client';

/**
 * House `*word*` convention → the one italic-serif emphasis a headline is
 * allowed. Same shape as `SourcesSection`'s renderer, kept local to this
 * directory so the comparison set can be deleted in one move.
 *
 * The `<em>` is styled by whichever heading it lands in — each candidate's
 * display type wants a different optical weight for the italic.
 */
export const renderEm = (raw: string) =>
  raw.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });

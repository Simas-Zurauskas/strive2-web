'use client';

/**
 * House `*word*` convention → the one italic-serif emphasis a headline is
 * allowed. Kept local to this directory so the set can be deleted in one
 * move.
 */
export const renderEm = (raw: string) =>
  raw.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });

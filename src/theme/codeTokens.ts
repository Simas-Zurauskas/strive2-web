/**
 * Code-syntax palette — used by the dark-themed mock code blocks on the
 * Landing page (`FeatureBento`, `LiveLessonMock`).
 *
 * The CSS variables are declared in `theme/GlobalStyles.tsx` (`--code-*`).
 * This module exposes them as a typed object for use inside styled-components
 * template literals, keeping component code free of raw hex values.
 *
 * Today the palette is dark-only (the mock code blocks render dark chrome
 * regardless of the active theme); a `light` variant can be wired in by
 * overriding `--code-*` under `:root` and `[data-theme="dark"]` separately.
 */

export type CodeToken =
  | 'bg'
  | 'text'
  | 'keyword'
  | 'string'
  | 'function'
  | 'comment'
  | 'operator'
  | 'number';

export const codeTokens: Record<CodeToken, string> = {
  bg: 'var(--code-bg)',
  text: 'var(--code-text)',
  keyword: 'var(--code-keyword)',
  string: 'var(--code-string)',
  function: 'var(--code-function)',
  comment: 'var(--code-comment)',
  operator: 'var(--code-operator)',
  number: 'var(--code-number)',
};

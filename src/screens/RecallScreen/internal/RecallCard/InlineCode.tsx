'use client';

import { Fragment } from 'react';
import * as S from './InlineCode.styles';

/**
 * Render a short string with Markdown-style backtick spans as inline <code>.
 * Used for recall card prompts + answers, which are code-heavy but short enough
 * that pulling in react-markdown would be overkill.
 *
 * `foo` → <code>foo</code>
 * Unmatched backticks are left as literal text.
 */
export const InlineCode = ({ text }: { text: string }) => {
  const tokens = text.split(/(`[^`]+`)/g);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.startsWith('`') && t.endsWith('`') && t.length > 2) {
          return <S.Code key={i}>{t.slice(1, -1)}</S.Code>;
        }
        return <Fragment key={i}>{t}</Fragment>;
      })}
    </>
  );
};

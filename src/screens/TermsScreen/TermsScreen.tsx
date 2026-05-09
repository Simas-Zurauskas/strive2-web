'use client';

import { Markdown } from '@/components';
import { TERMS_CONTENT } from './content';
import * as S from './TermsScreen.styles';

export const TermsScreen: React.FC = () => {
  return (
    <S.Layout>
      <S.Title>Terms of Service</S.Title>
      <S.LastUpdated>Last updated: May 9, 2026</S.LastUpdated>
      <S.MarkdownBody>
        <Markdown>{TERMS_CONTENT}</Markdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

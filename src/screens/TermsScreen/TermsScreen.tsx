'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TERMS_CONTENT } from './content';
import * as S from './TermsScreen.styles';

export const TermsScreen: React.FC = () => {
  return (
    <S.Layout>
      <S.Title>Terms of Service</S.Title>
      <S.LastUpdated>Last updated: April 9, 2026</S.LastUpdated>
      <S.MarkdownBody>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{TERMS_CONTENT}</ReactMarkdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

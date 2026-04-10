'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PRIVACY_CONTENT } from './content';
import * as S from './PrivacyScreen.styles';

export const PrivacyScreen: React.FC = () => {
  return (
    <S.Layout>
      <S.Title>Privacy Policy</S.Title>
      <S.LastUpdated>Last updated: April 9, 2026</S.LastUpdated>
      <S.MarkdownBody>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{PRIVACY_CONTENT}</ReactMarkdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

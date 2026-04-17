'use client';

import { Markdown } from '@/components';
import { PRIVACY_CONTENT } from './content';
import * as S from './PrivacyScreen.styles';

export const PrivacyScreen: React.FC = () => {
  return (
    <S.Layout>
      <S.Title>Privacy Policy</S.Title>
      <S.LastUpdated>Last updated: April 9, 2026</S.LastUpdated>
      <S.MarkdownBody>
        <Markdown>{PRIVACY_CONTENT}</Markdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

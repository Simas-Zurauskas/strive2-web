'use client';

import { Markdown } from '@/components';
import * as S from './PrivacyScreen.styles';

interface PrivacyScreenProps {
  body: string;
  updated?: string;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ body, updated }) => {
  return (
    <S.Layout>
      <S.Title>Privacy Policy</S.Title>
      {updated ? <S.LastUpdated>Last updated: {updated}</S.LastUpdated> : null}
      <S.MarkdownBody>
        <Markdown>{body}</Markdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

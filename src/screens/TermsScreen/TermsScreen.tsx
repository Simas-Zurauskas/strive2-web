'use client';

import { Markdown } from '@/components';
import * as S from './TermsScreen.styles';

interface TermsScreenProps {
  body: string;
  updated?: string;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ body, updated }) => {
  return (
    <S.Layout>
      <S.Title>Terms of Service</S.Title>
      {updated ? <S.LastUpdated>Last updated: {updated}</S.LastUpdated> : null}
      <S.MarkdownBody>
        <Markdown>{body}</Markdown>
      </S.MarkdownBody>
    </S.Layout>
  );
};

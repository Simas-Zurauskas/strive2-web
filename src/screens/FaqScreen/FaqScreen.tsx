'use client';

import { PageLayout } from '@/components';
import * as S from './FaqScreen.styles';

export const FaqScreen: React.FC = () => {
  return (
    <PageLayout>
      <S.ContentWrap>
        <S.PageHeader>
          <S.Title>FAQ</S.Title>
        </S.PageHeader>
      </S.ContentWrap>
    </PageLayout>
  );
};

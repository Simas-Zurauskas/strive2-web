'use client';

import { KbTopicCard } from './internal/KbTopicCard';
import * as S from './KbScreen.styles';
import type { KbTopic } from '@/lib/kb';

interface KbNotFoundScreenProps {
  topics: KbTopic[];
}

export const KbNotFoundScreen = ({ topics }: KbNotFoundScreenProps) => (
  <S.Layout>
    <S.NotFoundContainer>
      <S.Eyebrow>404</S.Eyebrow>
      <S.HeroTitle>We couldn&apos;t find that page</S.HeroTitle>
      <p>
        The article or topic you&apos;re looking for doesn&apos;t exist. Try browsing the topics below or
        returning to the help home.
      </p>
    </S.NotFoundContainer>
    <S.SectionHeading>Browse topics</S.SectionHeading>
    <S.TopicGrid>
      {topics.map((t) => (
        <KbTopicCard key={t.slug} topic={t} />
      ))}
    </S.TopicGrid>
  </S.Layout>
);

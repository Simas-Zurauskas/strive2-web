'use client';

import { KbSearchBar } from './internal/KbSearchBar';
import { KbTopicCard } from './internal/KbTopicCard';
import * as S from './KbScreen.styles';
import type { KbSearchEntry, KbTopic } from '@/lib/kb';

interface KbHubScreenProps {
  topics: KbTopic[];
  searchEntries: KbSearchEntry[];
}

export const KbHubScreen = ({ topics, searchEntries }: KbHubScreenProps) => (
  <S.Layout>
    <S.Eyebrow>Help center</S.Eyebrow>
    <S.HeroTitle>Reading material on how Strive works.</S.HeroTitle>
    <S.HeroSubtitle>
      Browse a topic or search the whole library. The product is built around a few teaching ideas —
      once you have those, the rest clicks into place.
    </S.HeroSubtitle>
    <KbSearchBar entries={searchEntries} />
    <S.SectionHeading>Topics</S.SectionHeading>
    <S.TopicGrid>
      {topics.map((t) => (
        <KbTopicCard key={t.slug} topic={t} />
      ))}
    </S.TopicGrid>
  </S.Layout>
);

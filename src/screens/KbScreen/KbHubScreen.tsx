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
    <S.HeroTitle>How can we help you learn?</S.HeroTitle>
    <S.HeroSubtitle>
      Browse the topics below or search across every article. Strive is built around a few teaching ideas —
      once you understand them, the rest of the product clicks into place.
    </S.HeroSubtitle>
    <KbSearchBar entries={searchEntries} />
    <S.SectionHeading>Browse topics</S.SectionHeading>
    <S.TopicGrid>
      {topics.map((t) => (
        <KbTopicCard key={t.slug} topic={t} />
      ))}
    </S.TopicGrid>
  </S.Layout>
);

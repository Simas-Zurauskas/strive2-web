'use client';

import * as S from './LearnScreen.styles';
import type { LearnCategory, LearnTopic } from '@/lib/learn';

interface LearnHubScreenProps {
  topics: readonly LearnTopic[];
}

// Display order matches v1 demand evidence (USER_BASE.md) and product
// surface area: business + programming dominate, languages + data are
// strong specialty clusters, creator/maths/science/design round out.
const CATEGORY_ORDER: readonly LearnCategory[] = [
  'business',
  'programming',
  'language',
  'data',
  'creator',
  'math',
  'science',
  'design',
];

const CATEGORY_LABELS: Record<LearnCategory, string> = {
  business: 'Business, marketing & money',
  programming: 'Programming & engineering',
  language: 'Languages',
  data: 'Data & analytics',
  creator: 'Creator & writing',
  math: 'Maths & exam prep',
  science: 'Science',
  design: 'Design',
};

const groupByCategory = (
  topics: readonly LearnTopic[],
): { category: LearnCategory; topics: LearnTopic[] }[] => {
  const map = new Map<LearnCategory, LearnTopic[]>();
  for (const t of topics) {
    const list = map.get(t.category) ?? [];
    list.push(t);
    map.set(t.category, list);
  }
  return CATEGORY_ORDER.flatMap((category) => {
    const list = map.get(category);
    if (!list || list.length === 0) return [];
    return [{ category, topics: list }];
  });
};

export const LearnHubScreen = ({ topics }: LearnHubScreenProps) => {
  const grouped = groupByCategory(topics);
  const totalCount = topics.length;

  return (
    <S.HubLayout>
      <S.HubHero>
        <S.Eyebrow>Learn anything on Strive</S.Eyebrow>
        <S.HeroTitle>Pick a topic. We’ll build the course around your goal.</S.HeroTitle>
        <S.HeroSubtitle>
          Every Strive course is generated for one learner — you. Browse {totalCount} topics to see
          what a course on each usually looks like, then tell the wizard your goal and what you
          already know. Modules, lessons, quizzes, and a daily recall queue come back shaped to fit.
        </S.HeroSubtitle>
      </S.HubHero>

      {grouped.map(({ category, topics: groupTopics }) => (
        <S.CategoryBlock key={category}>
          <S.CategoryHeading>
            {CATEGORY_LABELS[category]}
            <S.CategoryCount>{groupTopics.length} topics</S.CategoryCount>
          </S.CategoryHeading>
          <S.TopicGrid>
            {groupTopics.map((t) => (
              <S.TopicCardLink key={t.slug} href={`/learn/${t.slug}`}>
                <S.TopicCardHead>
                  <S.TopicCardTitle>{t.title}</S.TopicCardTitle>
                  <S.TopicCardCategory>{t.category}</S.TopicCardCategory>
                </S.TopicCardHead>
                <S.TopicCardSummary>{t.subhead}</S.TopicCardSummary>
                <S.TopicCardArrow>Learn {t.title} →</S.TopicCardArrow>
              </S.TopicCardLink>
            ))}
          </S.TopicGrid>
        </S.CategoryBlock>
      ))}
    </S.HubLayout>
  );
};

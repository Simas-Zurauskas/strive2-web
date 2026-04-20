'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useInsightQueue } from '@/hooks';
import { plural } from '@/lib/strings';
import * as S from './InsightsCard.styles';
import type { InsightQueueItem } from '@/api/types';

const OVERDUE_DAYS_THRESHOLD = 2;
const CLOZE_RE = /\{\{\s*blank\s*\}\}/gi;

const formatCourseList = (names: string[]): string => {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]} + ${names.length - 1} more`;
};

const formatTeaser = (item: InsightQueueItem): string => {
  // Cloze prompts ship with `{{ blank }}` markers — render them as a visible
  // gap so the teaser reads naturally on the home card.
  return item.prompt.replace(CLOZE_RE, '____');
};

const isOverdue = (dueAt: string | null): boolean => {
  if (!dueAt) return false;
  const ageMs = Date.now() - new Date(dueAt).getTime();
  return ageMs >= OVERDUE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;
};

export const InsightsCard = () => {
  const router = useRouter();
  const { data: queue } = useInsightQueue();

  const view = useMemo(() => {
    if (!queue) return null;
    const items = [...queue.due, ...queue.fresh];
    if (items.length === 0) return null;

    const courseNames = Array.from(new Set(items.map((i) => i.courseName)));
    return {
      count: items.length,
      teaser: formatTeaser(items[0]),
      courses: formatCourseList(courseNames),
      overdue: queue.due.length > 0 && isOverdue(queue.due[0].dueAt),
    };
  }, [queue]);

  if (!view) return null;

  return (
    <S.Container onClick={() => router.push('/insights')} aria-label="Open insights queue">
      <S.Header>
        <S.HeaderLeft>
          <S.HeaderIcon>&#9728;&#65039;</S.HeaderIcon>
          <S.HeaderTitle>Daily recall</S.HeaderTitle>
        </S.HeaderLeft>
        {view.overdue && <S.PulseDot aria-label="Overdue cards waiting" />}
      </S.Header>

      <S.CountBlock>
        <S.BigCount>{view.count}</S.BigCount>
        <S.CountLabel>{plural({ count: view.count, singular: 'card' })} waiting</S.CountLabel>
      </S.CountBlock>

      <S.CourseAttribution>from {view.courses}</S.CourseAttribution>

      <S.PromptTeaser>&ldquo;{view.teaser}&rdquo;</S.PromptTeaser>

      <S.CTA>
        <span>Start review</span>
        <S.CTAArrow>&rarr;</S.CTAArrow>
      </S.CTA>
    </S.Container>
  );
};

'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES } from '@/constants/routes';
import { useReviewsDue, useUnattemptedQuizzes } from '@/hooks';
import { plural } from '@/lib/strings';
import * as S from './QuizzesCard.styles';
import type { QuizMasteryTier } from '@/api/types';

const OVERDUE_DAYS_THRESHOLD = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

const tierLabel: Record<QuizMasteryTier, string> = {
  mastered: 'Mastered',
  passed: 'Passed',
  needs_review: 'Needs work',
};

const daysAgo = (iso: string | null): number | null => {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / DAY_MS);
};

export const QuizzesCard = () => {
  const router = useRouter();
  const { data: reviewsDue } = useReviewsDue();
  const { data: unattempted } = useUnattemptedQuizzes();

  const view = useMemo(() => {
    const reviews = reviewsDue ?? [];
    const fresh = unattempted ?? [];
    if (reviews.length === 0 && fresh.length === 0) return null;

    if (reviews.length > 0) {
      const featured = reviews[0];
      const overdueDays = daysAgo(featured.nextReviewAt);
      const isProgression = featured.reviewReason === 'progression';
      const stake = isProgression
        ? 'Newly unlocked'
        : overdueDays !== null && overdueDays >= 1
          ? `Overdue ${overdueDays}d`
          : 'Mastery fading';

      return {
        kind: 'review' as const,
        count: reviews.length,
        countLabel: `${plural({ count: reviews.length, singular: 'review' })} waiting`,
        featured,
        tier: featured.bestTier,
        stake,
        pulse: !isProgression && overdueDays !== null && overdueDays >= OVERDUE_DAYS_THRESHOLD,
        href: ROUTES.moduleQuiz(featured.courseSlug, featured.courseId, featured.moduleIndex, true),
        ctaLabel: 'Quick review',
        extraReviews: reviews.length - 1,
        extraFresh: fresh.length,
      };
    }

    const featured = fresh[0];
    return {
      kind: 'fresh' as const,
      count: fresh.length,
      countLabel: `${plural({ count: fresh.length, singular: 'quiz', many: 'quizzes' })} ready`,
      featured,
      tier: null,
      stake: 'Quick start',
      pulse: false,
      href: ROUTES.moduleQuiz(featured.courseSlug, featured.courseId, featured.moduleIndex, false),
      ctaLabel: 'Start quiz',
      extraReviews: 0,
      extraFresh: fresh.length - 1,
    };
  }, [reviewsDue, unattempted]);

  if (!view) return null;

  const footerParts: string[] = [];
  if (view.extraReviews > 0) {
    footerParts.push(`+${view.extraReviews} more ${plural({ count: view.extraReviews, singular: 'review' })}`);
  }
  if (view.extraFresh > 0) {
    footerParts.push(`${view.extraFresh} not yet taken`);
  }

  return (
    <S.Container onClick={() => router.push(view.href)} aria-label="Open most urgent quiz">
      <S.Header>
        <S.HeaderLeft>
          <S.HeaderIcon>&#127919;</S.HeaderIcon>
          <S.HeaderTitle>Quizzes</S.HeaderTitle>
        </S.HeaderLeft>
        {view.pulse && <S.PulseDot aria-label="Quiz review overdue" />}
      </S.Header>

      <S.CountBlock>
        <S.BigCount $variant={view.kind}>{view.count}</S.BigCount>
        <S.CountLabel>{view.countLabel}</S.CountLabel>
      </S.CountBlock>

      <S.Attribution>
        {view.featured.courseName} &middot; {view.featured.moduleName}
      </S.Attribution>

      <S.StakeRow>
        {view.tier && <S.TierBadge $tier={view.tier}>{tierLabel[view.tier]}</S.TierBadge>}
        <S.StakeText>{view.stake}</S.StakeText>
      </S.StakeRow>

      <S.CTA>
        <span>{view.ctaLabel}</span>
        <S.CTAArrow>&rarr;</S.CTAArrow>
      </S.CTA>

      {footerParts.length > 0 && <S.Footer>{footerParts.join(' \u00b7 ')}</S.Footer>}
    </S.Container>
  );
};

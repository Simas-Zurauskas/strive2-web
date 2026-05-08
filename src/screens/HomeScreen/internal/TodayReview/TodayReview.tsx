'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ROUTES } from '@/constants/routes';
import { useRecallQueue, useReviewsDue, useUnattemptedQuizzes } from '@/hooks';
import * as S from './TodayReview.styles';
import { SkeletonBlock } from '../_skeleton/skeleton.styles';

const OVERDUE_DAYS_THRESHOLD = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

const isOverdue = (iso: string | null): boolean => {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() >= OVERDUE_DAYS_THRESHOLD * DAY_MS;
};

const daysOverdue = (iso: string | null): number => {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS));
};

interface ActiveCell {
  kind: 'active';
  href: string;
  label: string;
  count: number;
  title: string;
  sub: string;
  pulse: boolean;
  ariaLabel: string;
}

interface CalmCell {
  kind: 'calm';
  label: string;
  title: string;
  sub: string;
}

type CellData = ActiveCell | CalmCell;

/**
 * Skeleton uses the real S.Cell so it inherits the same padding and the
 * 6rem min-height — guarantees zero layout shift when real data lands.
 * The active-cell layout (count + body stack) is what we render — when
 * the real cells turn out to be calm placeholders, they still occupy the
 * same min-height.
 */
const TodayReviewSkeleton = () => (
  <S.Wrap aria-hidden>
    <S.Head>
      <S.Label>Today&rsquo;s review</S.Label>
    </S.Head>
    <S.Strip>
      <S.Cell as="div" $passive>
        <SkeletonBlock $h="1.875rem" $w="1.625rem" $radius="var(--radius-sm)" />
        <S.Body>
          <SkeletonBlock $h="0.6875rem" $w="6rem" />
          <SkeletonBlock $h="1rem" $w="70%" />
          <SkeletonBlock $h="0.75rem" $w="50%" />
        </S.Body>
      </S.Cell>
      <S.Divider />
      <S.Cell as="div" $passive>
        <SkeletonBlock $h="1.875rem" $w="1.625rem" $radius="var(--radius-sm)" />
        <S.Body>
          <SkeletonBlock $h="0.6875rem" $w="6rem" />
          <SkeletonBlock $h="1rem" $w="65%" />
          <SkeletonBlock $h="0.75rem" $w="55%" />
        </S.Body>
      </S.Cell>
    </S.Strip>
  </S.Wrap>
);

export const TodayReview = () => {
  const router = useRouter();
  const { data: recall, isLoading: recallLoading } = useRecallQueue();
  const { data: quizReviews, isLoading: reviewsLoading } = useReviewsDue();
  const { data: unattempted, isLoading: unattemptedLoading } = useUnattemptedQuizzes();
  const isLoading = recallLoading || reviewsLoading || unattemptedLoading;

  const recallCell = useMemo<CellData>(() => {
    const due = recall?.due ?? [];
    const fresh = recall?.fresh ?? [];
    const count = due.length + fresh.length;
    if (count === 0) {
      return {
        kind: 'calm',
        label: 'Daily recall',
        title: 'All caught up',
        sub: 'No cards waiting today.',
      };
    }
    const featured = due[0] ?? fresh[0];
    return {
      kind: 'active',
      href: ROUTES.recall(),
      label: 'Daily recall',
      count,
      title: count === 1 ? '1 card waiting' : `${count} cards waiting`,
      sub: featured ? `From ${featured.courseName}` : '',
      pulse: due.length > 0 && isOverdue(due[0].dueAt),
      ariaLabel: 'Open recall queue',
    };
  }, [recall]);

  const quizCell = useMemo<CellData>(() => {
    const reviews = quizReviews ?? [];
    const fresh = unattempted ?? [];
    if (reviews.length === 0 && fresh.length === 0) {
      return {
        kind: 'calm',
        label: 'Next quiz',
        title: 'Nothing scheduled',
        sub: 'Quizzes unlock when you finish a module.',
      };
    }

    if (reviews.length > 0) {
      const featured = reviews[0];
      const overdueDays = daysOverdue(featured.nextReviewAt);
      const isProgression = featured.reviewReason === 'progression';
      const sub = isProgression
        ? `${featured.courseName} · Newly unlocked`
        : overdueDays >= 1
          ? `${featured.courseName} · Overdue ${overdueDays}d`
          : `${featured.courseName} · Up for review`;
      return {
        kind: 'active',
        href: ROUTES.moduleQuiz(featured.courseSlug, featured.courseId, featured.moduleIndex, true),
        label: reviews.length > 1 ? `Quiz reviews · ${reviews.length}` : 'Quiz review',
        count: reviews.length,
        title: featured.moduleName,
        sub,
        pulse: !isProgression && overdueDays >= OVERDUE_DAYS_THRESHOLD,
        ariaLabel: 'Open most urgent quiz',
      };
    }

    // No reviews due — surface the next unattempted quiz as "next quiz".
    const featured = fresh[0];
    return {
      kind: 'active',
      href: ROUTES.moduleQuiz(featured.courseSlug, featured.courseId, featured.moduleIndex, false),
      label: fresh.length > 1 ? `Next quiz · +${fresh.length - 1}` : 'Next quiz',
      count: fresh.length,
      title: featured.moduleName,
      sub: `${featured.courseName} · Newly unlocked`,
      pulse: false,
      ariaLabel: 'Start the next quiz',
    };
  }, [quizReviews, unattempted]);

  if (isLoading) return <TodayReviewSkeleton />;

  // Hide the entire strip only when both sides are calm AND the user has no
  // pending work anywhere — otherwise show the calm placeholder so the row
  // confirms "you're caught up here too."
  const allCalm = recallCell.kind === 'calm' && quizCell.kind === 'calm';
  if (allCalm) return null;

  const renderCell = (cell: CellData) => {
    if (cell.kind === 'calm') {
      return (
        <S.CellWrap>
          <S.Cell $passive type="button" tabIndex={-1}>
            <S.CountIcon>
              <Check size={18} strokeWidth={1.75} />
            </S.CountIcon>
            <S.Body>
              <S.TopRow>
                <S.CellLabel>{cell.label}</S.CellLabel>
              </S.TopRow>
              <S.CellTitleCalm>{cell.title}</S.CellTitleCalm>
              <S.CellSub>{cell.sub}</S.CellSub>
            </S.Body>
          </S.Cell>
        </S.CellWrap>
      );
    }

    return (
      <S.CellWrap>
        <S.Cell onClick={() => router.push(cell.href)} aria-label={cell.ariaLabel}>
          <S.Count $tone="active">{cell.count}</S.Count>
          <S.Body>
            <S.TopRow>
              <S.CellLabel>
                {cell.pulse && <S.PulseDot aria-label="Overdue" />}
                {cell.label}
              </S.CellLabel>
            </S.TopRow>
            <S.CellTitle>{cell.title}</S.CellTitle>
            <S.CellSub>{cell.sub}</S.CellSub>
          </S.Body>
          <S.Arrow>
            <ArrowRight size={16} strokeWidth={1.75} />
          </S.Arrow>
        </S.Cell>
      </S.CellWrap>
    );
  };

  return (
    <S.Wrap>
      <S.Head>
        <S.Label>Today&rsquo;s review</S.Label>
      </S.Head>
      <S.Strip>
        {renderCell(recallCell)}
        <S.Divider />
        {renderCell(quizCell)}
      </S.Strip>
    </S.Wrap>
  );
};

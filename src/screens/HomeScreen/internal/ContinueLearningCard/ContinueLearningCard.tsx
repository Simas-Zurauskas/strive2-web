'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { ROUTES } from '@/constants/routes';
import { useContinueLearning } from '@/hooks';
import * as S from './ContinueLearningCard.styles';
import { SkeletonBlock, SkeletonCard } from '../_skeleton/skeleton.styles';

const padTwo = (n: number) => n.toString().padStart(2, '0');

/**
 * Skeleton mirrors the real card's outer shape (1.3fr/1fr split, the
 * 16rem min-height enforced by S.Container, hairline border + radius).
 * Title is rendered as TWO stacked blocks — one full-width, one 65% —
 * to reserve the same vertical space a 2-line wrapped title takes. That
 * way short single-line titles don't shift the card up when they load.
 */
const ContinueLearningCardSkeleton = () => (
  <SkeletonCard
    role="presentation"
    aria-hidden
    style={{
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      minHeight: '16rem',
    }}
  >
    <div
      style={{
        padding: '2rem 2.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        justifyContent: 'center',
      }}
    >
      <SkeletonBlock $h="0.6875rem" $w="9rem" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <SkeletonBlock $h="1.75rem" $w="100%" />
        <SkeletonBlock $h="1.75rem" $w="65%" />
      </div>
      <SkeletonBlock $h="0.875rem" $w="55%" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <SkeletonBlock $h="2.25rem" $w="9rem" $radius="var(--radius-md)" />
        <SkeletonBlock $h="2.25rem" $w="6.5rem" $radius="var(--radius-md)" />
      </div>
    </div>
    <SkeletonBlock $h="100%" $w="100%" $radius="0" />
  </SkeletonCard>
);

export const ContinueLearningCard = () => {
  const router = useRouter();
  const { data, isLoading } = useContinueLearning();

  if (isLoading) return <ContinueLearningCardSkeleton />;
  if (!data) return null;

  const { courseSlug, courseId, courseName, moduleName, lessonName, moduleIndex, lessonIndex, courseProgress } =
    data;

  const lessonUrl = ROUTES.lesson(courseSlug, courseId, moduleIndex, lessonIndex);
  const courseUrl = ROUTES.course(courseSlug, courseId);

  return (
    <S.Container>
      <S.Body>
        <S.Eyebrow>Continue learning</S.Eyebrow>
        <S.Title>{lessonName}</S.Title>
        <S.Meta>
          Lesson {lessonIndex + 1} of {courseProgress.total}
          <S.MetaSep />
          {moduleName}
          <S.MetaSep />
          <span style={{ fontFamily: 'var(--font-heading-serif), Georgia, serif', fontStyle: 'italic' }}>
            {courseName}
          </span>
        </S.Meta>
        <S.Actions>
          <Button variant="primary" onClick={() => router.push(lessonUrl)}>
            Resume lesson
            <ArrowRight size={15} style={{ marginLeft: '0.375rem' }} />
          </Button>
          <Button variant="secondary" onClick={() => router.push(courseUrl)}>
            See module
          </Button>
        </S.Actions>
      </S.Body>
      <S.Cover $imageUrl={data.lessonHeroImageUrl} aria-hidden>
        <S.CoverLabel>
          Module {moduleIndex + 1} · Lesson {lessonIndex + 1}
        </S.CoverLabel>
        <S.CoverNumber>{padTwo(lessonIndex + 1)}</S.CoverNumber>
      </S.Cover>
    </S.Container>
  );
};

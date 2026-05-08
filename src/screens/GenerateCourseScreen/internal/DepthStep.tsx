'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CourseDepth, DepthPreviewsResponse } from '@/api/types';
import { Button, Badge, Eyebrow, HelpAnchor } from '@/components';
import * as S from './DepthStep.styles';

interface DepthStepProps {
  depthPreviews: DepthPreviewsResponse | null;
  previewsLoading: boolean;
  previewsError?: boolean;
  initialDepth: CourseDepth | null;
  hasExistingData: boolean;
  loading: boolean;
  onConfirm: (depth: CourseDepth) => void;
  onRetryPreviews?: () => void;
  onBack: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const depthLabels: Record<CourseDepth, string> = {
  overview: 'Overview',
  comprehensive: 'Comprehensive',
  deep_dive: 'Deep Dive',
};

const staticDescriptions: Record<CourseDepth, string> = {
  overview: 'Get a solid understanding of the key concepts.',
  comprehensive: 'Learn the topic thoroughly with practice and application.',
  deep_dive: 'Master the subject from foundations to advanced level.',
};

const depthKeys: CourseDepth[] = ['overview', 'comprehensive', 'deep_dive'];

/**
 * Render a `[min, max]` numeric range with a unit, collapsing the range
 * when both ends are equal and pluralising correctly. Returns null when
 * the input is missing or malformed — caller skips rendering the scope
 * line entirely on legacy courses where the backend hasn't backfilled
 * the field. Defensive: tuples that aren't `[finite, finite]` short-circuit.
 */
const formatRange = (range: [number, number] | undefined | null, unit: string): string | null => {
  if (!Array.isArray(range) || range.length !== 2) return null;
  const [min, max] = range;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) return `~${min} ${min === 1 ? unit : `${unit}s`}`;
  return `~${min}–${max} ${unit}s`;
};

/**
 * Build the scope line shown under each card label. Combines lesson count
 * and estimated hours when both are present; falls back to whichever is
 * available; returns null if neither are. The numbers come from the
 * backend's `(depth, isSoft)` lesson-count hint table — same source the
 * gate dialog uses, so cards and dialog stay numerically consistent.
 */
const formatCardScope = (preview: {
  lessonCountRange?: [number, number];
  estimatedHoursRange?: [number, number];
} | undefined): string | null => {
  if (!preview) return null;
  const lessons = formatRange(preview.lessonCountRange, 'lesson');
  const hours = formatRange(preview.estimatedHoursRange, 'hour');
  if (lessons && hours) return `${lessons} · ${hours}`;
  return lessons ?? hours;
};

export const DepthStep = ({
  depthPreviews,
  previewsLoading,
  previewsError,
  initialDepth,
  hasExistingData,
  loading,
  onConfirm,
  onRetryPreviews,
  onBack,
  onDirtyChange,
}: DepthStepProps) => {
  const recommended = depthPreviews?.recommended ?? 'comprehensive';
  const effectiveInitial = initialDepth ?? (recommended as CourseDepth);
  const [depth, setDepth] = useState<CourseDepth>(effectiveInitial);
  const depthUnchanged = hasExistingData && depth === initialDepth;

  useEffect(() => {
    onDirtyChange?.(depth !== effectiveInitial);
  }, [depth, effectiveInitial, onDirtyChange]);

  const recommendationReason = depthPreviews?.recommendationReason ?? '';

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>Depth</Eyebrow>
        <S.Title>
          How deep should we go? <HelpAnchor concept="course-depth" />
        </S.Title>
        {previewsLoading && !depthPreviews ? (
          <S.Subtitle>Preparing your options...</S.Subtitle>
        ) : (
          recommendationReason && (
            <S.RecommendationBar>
              <Badge variant="gold">Recommended: {depthLabels[recommended as CourseDepth]}</Badge>
              &mdash; {recommendationReason}
            </S.RecommendationBar>
          )
        )}
      </S.Header>

      <S.CardsContainer>
        {previewsError && !previewsLoading ? (
          <S.ErrorState>
            <p>Failed to generate personalized previews.</p>
            {onRetryPreviews && (
              <Button variant="secondary" type="button" onClick={onRetryPreviews}>
                Try again
              </Button>
            )}
          </S.ErrorState>
        ) : previewsLoading && !depthPreviews
          ? depthKeys.map((key) => (
              <S.SkeletonCard key={key}>
                <Skeleton width="40%" height={16} borderRadius={4} />
                <Skeleton width="85%" height={16} borderRadius={4} />
                <S.SkeletonBullets>
                  <Skeleton width="75%" height={16} borderRadius={4} />
                  <Skeleton width="65%" height={16} borderRadius={4} />
                  <Skeleton width="80%" height={16} borderRadius={4} />
                </S.SkeletonBullets>
              </S.SkeletonCard>
            ))
          : depthKeys.map((key) => {
              const preview = depthPreviews?.[key];
              const isRecommended = key === recommended;
              const scope = formatCardScope(
                preview as
                  | {
                      lessonCountRange?: [number, number];
                      estimatedHoursRange?: [number, number];
                    }
                  | undefined,
              );
              return (
                <S.DepthCard key={key} $selected={depth === key} onClick={() => setDepth(key)}>
                  <S.CardHeader>
                    <S.CardLabel>{depthLabels[key]}</S.CardLabel>
                    {isRecommended && <Badge variant="gold">Recommended</Badge>}
                    {scope && <S.CardScope>{scope}</S.CardScope>}
                  </S.CardHeader>
                  <S.CardSummary>{preview?.summary ?? staticDescriptions[key]}</S.CardSummary>
                  {preview?.bullets && (
                    <S.BulletList>
                      {preview.bullets.map((bullet, i) => (
                        <S.BulletItem key={i}>{bullet}</S.BulletItem>
                      ))}
                    </S.BulletList>
                  )}
                </S.DepthCard>
              );
            })}
      </S.CardsContainer>

      <S.Actions>
        <Button variant="secondary" type="button" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="button" onClick={() => onConfirm(depth)} loading={loading} disabled={previewsLoading && !depthPreviews}>
          {depthUnchanged ? 'Continue' : 'Generate Structure'}
        </Button>
      </S.Actions>
    </S.Container>
  );
};

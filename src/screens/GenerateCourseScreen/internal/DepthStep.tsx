'use client';

import { useEffect, useState } from 'react';
import { CourseDepth, DepthPreviewsResponse } from '@/api/types';
import { Button, Badge } from '@/components';
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
        <S.Eyebrow>Depth</S.Eyebrow>
        <S.Title>How deep should we go?</S.Title>
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
                <S.SkeletonLine $width="40%" />
                <S.SkeletonLine $width="85%" />
                <S.SkeletonBullets>
                  <S.SkeletonLine $width="75%" />
                  <S.SkeletonLine $width="65%" />
                  <S.SkeletonLine $width="80%" />
                </S.SkeletonBullets>
              </S.SkeletonCard>
            ))
          : depthKeys.map((key) => {
              const preview = depthPreviews?.[key];
              const isRecommended = key === recommended;
              return (
                <S.DepthCard key={key} $selected={depth === key} onClick={() => setDepth(key)}>
                  <S.CardHeader>
                    <S.CardLabel>{depthLabels[key]}</S.CardLabel>
                    {isRecommended && <Badge variant="gold">Recommended</Badge>}
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

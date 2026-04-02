'use client';

import { useState } from 'react';
import { CourseDepth, DepthPreviewsResponse } from '@/api/types';
import { Button, Badge } from '@/components';
import * as S from './DepthStep.styles';

interface DepthStepProps {
  depthPreviews: DepthPreviewsResponse | null;
  previewsLoading: boolean;
  initialDepth: CourseDepth | null;
  loading: boolean;
  onConfirm: (depth: CourseDepth) => void;
  onBack: () => void;
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
  initialDepth,
  loading,
  onConfirm,
  onBack,
}: DepthStepProps) => {
  const recommended = depthPreviews?.recommended ?? 'comprehensive';
  const [depth, setDepth] = useState<CourseDepth>(initialDepth ?? (recommended as CourseDepth));

  const recommendationReason = depthPreviews?.recommendationReason ?? '';

  return (
    <S.Container>
      <S.Header>
        <S.Title>Choose your course depth</S.Title>
        {previewsLoading && !depthPreviews ? (
          <S.Subtitle>Generating personalized previews...</S.Subtitle>
        ) : (
          recommendationReason && (
            <S.RecommendationBar>
              <Badge variant="accent">Recommended: {depthLabels[recommended as CourseDepth]}</Badge>
              &mdash; {recommendationReason}
            </S.RecommendationBar>
          )
        )}
      </S.Header>

      <S.CardsContainer>
        {previewsLoading && !depthPreviews
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
                    {isRecommended && <Badge variant="accent">Recommended</Badge>}
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
          {loading ? 'Generating structure...' : 'Confirm & Generate'}
        </Button>
      </S.Actions>
    </S.Container>
  );
};

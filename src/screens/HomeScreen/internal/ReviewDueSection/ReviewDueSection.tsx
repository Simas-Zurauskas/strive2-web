'use client';

import { useRouter } from 'next/navigation';
import { ReviewDueItem } from '@/api/routes/course';
import * as S from './ReviewDueSection.styles';

interface ReviewDueSectionProps {
  items: ReviewDueItem[];
}

export const ReviewDueSection = ({ items }: ReviewDueSectionProps) => {
  const router = useRouter();

  if (items.length === 0) return null;

  return (
    <S.Container>
      <S.Accent />
      <S.Content>
        <S.Label>Reviews due</S.Label>
        <S.ReviewList>
          {items.map((item) => (
            <S.ReviewItem
              key={`${item.courseId}-${item.moduleIndex}`}
              onClick={() => router.push(`/course/${item.courseId}/quiz/${item.moduleIndex}?review=true`)}
            >
              <S.ReviewItemContent>
                <S.CourseName>{item.courseName}</S.CourseName>
                <S.ModuleName>Module {item.moduleIndex + 1}: {item.moduleName}</S.ModuleName>
              </S.ReviewItemContent>
              <S.TierBadge $tier={item.bestTier}>{item.bestScore}%</S.TierBadge>
              <S.ReviewButton>Review &rarr;</S.ReviewButton>
            </S.ReviewItem>
          ))}
        </S.ReviewList>
      </S.Content>
    </S.Container>
  );
};

'use client';

import * as S from './DraftCard.styles';
import type { Course } from '@/api/types';

interface DraftCardProps {
  course: Pick<Course, '_id' | 'name' | 'goal' | 'updatedAt'>;
  isGenerating?: boolean;
  onClick: () => void;
}

const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(diffMs / 3_600_000);
  const d = Math.floor(diffMs / 86_400_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

export const DraftCard = ({ course, isGenerating = false, onClick }: DraftCardProps) => {
  return (
    <S.Container onClick={onClick} aria-label={`Resume draft: ${course.name || 'Untitled course'}`}>
      <S.TopRow>
        {isGenerating ? (
          <S.Eyebrow>
            <S.StatusDot $generating />
            <S.EyebrowAccent>Generating…</S.EyebrowAccent>
          </S.Eyebrow>
        ) : (
          <span />
        )}
        <S.TimeAgo>{relativeTime(course.updatedAt)}</S.TimeAgo>
      </S.TopRow>
      <S.Name>{course.name || 'Untitled course'}</S.Name>
      {course.goal && <S.Goal>{course.goal}</S.Goal>}
    </S.Container>
  );
};

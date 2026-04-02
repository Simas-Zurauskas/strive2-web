'use client';

import { Course, CourseStatus } from '@/api/types';
import { Badge } from '@/components/Badge';
import * as S from './CourseCard.styles';

interface CourseCardProps {
  course: Pick<Course, '_id' | 'name' | 'status' | 'goal' | 'depth' | 'structure' | 'updatedAt'>;
  isGenerating?: boolean;
  onClick: () => void;
}

const getStatusVariant = (status: CourseStatus): 'default' | 'success' | 'warning' => {
  switch (status) {
    case 'creating':
      return 'warning';
    case 'ready':
      return 'success';
    default:
      return 'default';
  }
};

const getRelativeTime = (dateString: string): string => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

export const CourseCard = ({ course, isGenerating = false, onClick }: CourseCardProps) => {
  const moduleCount = course.structure?.modules?.length ?? 0;
  const lessonCount =
    course.structure?.modules?.reduce((sum, mod) => sum + (mod.lessons?.length ?? 0), 0) ?? 0;

  return (
    <S.Container onClick={onClick}>
      <S.Header>
        <S.CourseName>{course.name || 'Untitled Course'}</S.CourseName>
        <Badge variant={getStatusVariant(course.status)}>{course.status}</Badge>
      </S.Header>

      {isGenerating && (
        <S.GeneratingBar>
          <S.Spinner />
          <S.GeneratingText>Generating...</S.GeneratingText>
        </S.GeneratingBar>
      )}

      <S.Meta>
        {course.depth && <Badge variant="accent">{course.depth}</Badge>}
        {moduleCount > 0 && (
          <S.MetaText>
            {moduleCount} module{moduleCount === 1 ? '' : 's'}, {lessonCount} lesson
            {lessonCount === 1 ? '' : 's'}
          </S.MetaText>
        )}
        <S.MetaText>{getRelativeTime(course.updatedAt)}</S.MetaText>
      </S.Meta>

      {course.goal && <S.Goal>{course.goal}</S.Goal>}
    </S.Container>
  );
};

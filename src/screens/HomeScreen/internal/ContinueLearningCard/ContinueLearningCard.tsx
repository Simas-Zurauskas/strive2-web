'use client';

import { useRouter } from 'next/navigation';
import { ContinueLearningResponse } from '@/api/routes/course';
import { Button } from '@/components';
import * as S from './ContinueLearningCard.styles';

interface ContinueLearningCardProps {
  data: ContinueLearningResponse;
}

export const ContinueLearningCard = ({ data }: ContinueLearningCardProps) => {
  const router = useRouter();
  const { courseName, moduleName, lessonName, moduleIndex, lessonIndex, courseProgress } = data;
  const courseSlug = data.courseSlug;
  const lessonUrl = `/course/${courseSlug}/lesson/${moduleIndex}/${lessonIndex}`;

  return (
    <S.Container onClick={() => router.push(lessonUrl)}>
      <S.Accent />
      <S.Content>
        <S.Label>Continue learning</S.Label>
        <S.CourseName>{courseName}</S.CourseName>
        <S.LessonInfo>
          {moduleName} &middot; {lessonName}
        </S.LessonInfo>
        <S.ProgressRow>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={courseProgress.percentage} />
          </S.ProgressBarTrack>
          <S.ProgressText>
            {courseProgress.completed}/{courseProgress.total} lessons
          </S.ProgressText>
        </S.ProgressRow>
      </S.Content>
      <S.Action>
        <Button variant="primary" onClick={(e) => { e.stopPropagation(); router.push(lessonUrl); }}>
          Continue
        </Button>
      </S.Action>
    </S.Container>
  );
};

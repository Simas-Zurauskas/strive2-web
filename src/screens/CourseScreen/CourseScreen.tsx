'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { deleteCourse, CourseQuizProgressItem } from '@/api/routes/course';
import { Badge, Card, AlertDialog } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useCourse, useCourseProgress } from '@/hooks';
import { QKeys } from '@/types';
import * as S from './CourseScreen.styles';

export const CourseScreen = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id as string;
  const { data: course, isLoading } = useCourse(courseId);
  const { data: progressData } = useCourseProgress(courseId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId),
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success(TOASTS.COURSE_DELETED);
      router.push('/');
    },
  });

  const shouldRedirectToWizard = !isLoading && course && course.status === 'creating';

  useEffect(() => {
    if (shouldRedirectToWizard) {
      router.push(`/generate-course?courseId=${courseId}`);
    }
  }, [shouldRedirectToWizard, router, courseId]);

  const progressMap = useMemo(() => {
    const map = new Map<string, string>();
    if (progressData?.lessons) {
      for (const lp of progressData.lessons) {
        map.set(`${lp.moduleIndex}-${lp.lessonIndex}`, lp.status);
      }
    }
    return map;
  }, [progressData]);

  const quizProgressMap = useMemo(() => {
    const map = new Map<number, CourseQuizProgressItem>();
    if (progressData?.quizzes) {
      for (const qp of progressData.quizzes) {
        map.set(qp.moduleIndex, qp);
      }
    }
    return map;
  }, [progressData]);

  if (isLoading) {
    return (
      <S.Layout>
        <S.Container>
          <S.EmptyState>Loading course...</S.EmptyState>
        </S.Container>
      </S.Layout>
    );
  }

  if (!course) {
    return (
      <S.Layout>
        <S.Container>
          <S.TopBar>
            <S.BackLink href="/"><ArrowLeft size={14} /> Back to courses</S.BackLink>
          </S.TopBar>
          <S.EmptyState>Course not found.</S.EmptyState>
        </S.Container>
      </S.Layout>
    );
  }

  if (shouldRedirectToWizard) {
    return null;
  }

  const modules = course.structure?.modules ?? [];
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  const stats = progressData?.stats;

  const getModuleProgress = (mi: number) => {
    const lessons = modules[mi]?.lessons ?? [];
    let completed = 0;
    for (let li = 0; li < lessons.length; li++) {
      if (progressMap.get(`${mi}-${li}`) === 'completed') completed++;
    }
    return { completed, total: lessons.length };
  };

  const getLessonStatus = (mi: number, li: number): 'completed' | 'in_progress' | 'default' => {
    const status = progressMap.get(`${mi}-${li}`);
    if (status === 'completed') return 'completed';
    if (status === 'in_progress') return 'in_progress';
    return 'default';
  };

  return (
    <S.Layout>
      <S.Container>
        <S.TopBar>
          <S.BackLink href="/"><ArrowLeft size={14} /> Back to courses</S.BackLink>
          <S.DeleteLink onClick={() => setShowDeleteDialog(true)}>Delete course</S.DeleteLink>
        </S.TopBar>

        <S.HeaderSection>
          <S.Eyebrow>
            {course.depth ? `${course.depth.replace('_', ' ')} course` : 'Course'}
          </S.Eyebrow>
          <S.Title>{course.name || 'Untitled Course'}</S.Title>
          <S.Goal>{course.goal}</S.Goal>
          <S.Meta>
            {course.depth && <Badge variant="gold">{course.depth.replace('_', ' ')}</Badge>}
            {modules.length > 0 && (
              <Badge variant="default">
                {modules.length} module{modules.length !== 1 ? 's' : ''} &middot; {totalLessons}{' '}
                lesson{totalLessons !== 1 ? 's' : ''}
              </Badge>
            )}
          </S.Meta>
        </S.HeaderSection>

        {stats && stats.percentage > 0 && (
          <S.ProgressSection>
            <S.ProgressHeader>
              <S.ProgressLabel>Progress</S.ProgressLabel>
              <S.ProgressValue>{stats.percentage}% complete</S.ProgressValue>
            </S.ProgressHeader>
            <S.ProgressBarTrack>
              <S.ProgressBarFill $percent={stats.percentage} />
            </S.ProgressBarTrack>
          </S.ProgressSection>
        )}

        <S.SectionHeader>
          <S.SectionEyebrow>Course Structure</S.SectionEyebrow>
        </S.SectionHeader>

        <S.Modules>
          {modules.map((mod, i) => {
            const mp = getModuleProgress(i);

            return (
              <Card
                key={`${i}-${mod.name}`}
                header={
                  <S.ModuleHeaderContent>
                    <S.ModuleHeaderLeft>
                      <S.ModuleCounter>Module {i + 1}</S.ModuleCounter>
                      <S.ModuleTitle>{mod.name}</S.ModuleTitle>
                    </S.ModuleHeaderLeft>
                    {mp.completed > 0 && (
                      <S.ModuleProgressText>
                        {mp.completed}/{mp.total}
                      </S.ModuleProgressText>
                    )}
                  </S.ModuleHeaderContent>
                }
              >
                <S.ModuleDescription>{mod.description}</S.ModuleDescription>
                <S.LessonList>
                  {mod.lessons?.map((lesson, j) => {
                    const status = getLessonStatus(i, j);

                    return (
                      <S.LessonItem
                        key={`${i}-${j}`}
                        $status={status}
                        onClick={() => router.push(`/course/${courseId}/lesson/${i}/${j}`)}
                      >
                        <S.LessonContent>
                          <S.LessonName>{lesson.name}</S.LessonName>
                          <S.LessonDescription>{lesson.description}</S.LessonDescription>
                        </S.LessonContent>
                      </S.LessonItem>
                    );
                  })}

                  {(() => {
                    const isComplete = mp.completed === mp.total && mp.total > 0;
                    const qp = quizProgressMap.get(i);

                    return (
                      <S.QuizRow
                        $locked={!isComplete}
                        onClick={() =>
                          isComplete &&
                          router.push(
                            `/course/${courseId}/quiz/${i}${qp?.reviewDue ? '?review=true' : ''}`
                          )
                        }
                      >
                        <S.QuizIcon $locked={!isComplete}>Q</S.QuizIcon>
                        <S.QuizLabel>Module Quiz</S.QuizLabel>
                        {qp?.reviewDue && <S.ReviewIndicator>Review due</S.ReviewIndicator>}
                        {qp?.bestTier && (
                          <S.QuizBadge $tier={qp.bestTier as S.QuizBadgeTier}>
                            {qp.bestScore}%
                          </S.QuizBadge>
                        )}
                      </S.QuizRow>
                    );
                  })()}
                </S.LessonList>
              </Card>
            );
          })}
        </S.Modules>
      </S.Container>

      <AlertDialog
        open={showDeleteDialog}
        title="Delete this course?"
        description="This will permanently delete the course and all its data. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </S.Layout>
  );
};

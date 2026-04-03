'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { updateCourse, deleteCourse, CourseQuizProgressItem } from '@/api/routes/course';
import { CourseStatus } from '@/api/types';
import { Badge, Button, Card } from '@/components';
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
  const [isEditing, setIsEditing] = useState(false);

  const statusMutation = useMutation({
    mutationFn: (status: CourseStatus) => updateCourse(courseId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success('Course deleted');
      router.push('/');
    },
  });

  const shouldRedirectToWizard = !isLoading && course && (course.status === 'creating' || isEditing);

  useEffect(() => {
    if (shouldRedirectToWizard) {
      router.push(`/generate-course?courseId=${courseId}`);
    }
  }, [shouldRedirectToWizard, router, courseId]);

  // Build progress lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, string>();
    if (progressData?.lessons) {
      for (const lp of progressData.lessons) {
        map.set(`${lp.moduleIndex}-${lp.lessonIndex}`, lp.status);
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
          <S.Nav>
            <Link href="/">&larr; Back to courses</Link>
          </S.Nav>
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

  const handleEdit = () => {
    statusMutation.mutate('creating', {
      onSuccess: () => {
        toast.info('Entering edit mode');
        setIsEditing(true);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this course? This cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

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

  const quizProgressMap = useMemo(() => {
    const map = new Map<number, CourseQuizProgressItem>();
    if (progressData?.quizzes) {
      for (const qp of progressData.quizzes) {
        map.set(qp.moduleIndex, qp);
      }
    }
    return map;
  }, [progressData]);

  return (
    <S.Layout>
      <S.Container>
        <S.Nav>
          <Link href="/">&larr; Back to courses</Link>
        </S.Nav>

        <S.Header>
          <S.Title>{course.name || 'Untitled Course'}</S.Title>
          <S.Meta>
            <Badge variant="success">Ready</Badge>
            {course.depth && <Badge variant="accent">{course.depth}</Badge>}
            {modules.length > 0 && (
              <Badge variant="default">
                {modules.length} module{modules.length !== 1 ? 's' : ''} &middot; {totalLessons} lesson
                {totalLessons !== 1 ? 's' : ''}
              </Badge>
            )}
          </S.Meta>
          {stats && stats.percentage > 0 && (
            <S.ProgressRow>
              <S.ProgressBarTrack style={{ flex: 1 }}>
                <S.ProgressBarFill $percent={stats.percentage} />
              </S.ProgressBarTrack>
              <S.ProgressText>{stats.percentage}% complete</S.ProgressText>
            </S.ProgressRow>
          )}
          <S.Goal>{course.goal}</S.Goal>
        </S.Header>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={handleEdit} loading={statusMutation.isPending}>
            Edit course
          </Button>
          <Button variant="secondary" onClick={handleDelete} loading={deleteMutation.isPending}>
            Delete
          </Button>
        </div>

        <S.Modules>
          {modules.map((mod, i) => {
            const mp = getModuleProgress(i);
            const headerSuffix = mp.completed > 0 ? ` (${mp.completed}/${mp.total} completed)` : '';

            return (
              <Card key={`${i}-${mod.name}`} header={`Module ${i + 1}: ${mod.name}${headerSuffix}`}>
                <S.ModuleDescription>{mod.description}</S.ModuleDescription>
                <S.LessonList>
                  {mod.lessons?.map((lesson, j) => {
                    const status = getLessonStatus(i, j);

                    return (
                      <S.LessonItem
                        key={`${i}-${j}`}
                        onClick={() => router.push(`/course/${courseId}/lesson/${i}/${j}`)}
                      >
                        <S.LessonStatusDot $status={status} />
                        <S.LessonContent>
                          <S.LessonName>{lesson.name}</S.LessonName>
                          <S.LessonDescription>{lesson.description}</S.LessonDescription>
                        </S.LessonContent>
                      </S.LessonItem>
                    );
                  })}

                  {/* Module Quiz row */}
                  {(() => {
                    const isComplete = mp.completed === mp.total && mp.total > 0;
                    const qp = quizProgressMap.get(i);

                    return (
                      <S.QuizRow
                        $locked={!isComplete}
                        onClick={() => isComplete && router.push(
                          `/course/${courseId}/quiz/${i}${qp?.reviewDue ? '?review=true' : ''}`
                        )}
                      >
                        {isComplete ? '\u{1F4DD}' : '\u{1F512}'} Module Quiz
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
    </S.Layout>
  );
};

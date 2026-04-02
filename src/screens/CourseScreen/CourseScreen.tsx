'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateCourse, deleteCourse } from '@/api/routes/course';
import { CourseStatus } from '@/api/types';
import { Badge, Button, Card } from '@/components';
import { useCourse } from '@/hooks';
import { QKeys } from '@/types';
import * as S from './CourseScreen.styles';

export const CourseScreen = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id as string;
  const { data: course, isLoading } = useCourse(courseId);
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
          {modules.map((mod, i) => (
            <Card key={`${i}-${mod.name}`} header={`Module ${i + 1}: ${mod.name}`}>
              <S.ModuleDescription>{mod.description}</S.ModuleDescription>
              <S.LessonList>
                {mod.lessons?.map((lesson, j) => (
                  <S.LessonItem
                    key={`${i}-${j}`}
                    onClick={() => router.push(`/course/${courseId}/lesson/${i}/${j}`)}
                  >
                    <S.LessonContent>
                      <S.LessonName>{lesson.name}</S.LessonName>
                      <S.LessonDescription>{lesson.description}</S.LessonDescription>
                    </S.LessonContent>
                  </S.LessonItem>
                ))}
              </S.LessonList>
            </Card>
          ))}
        </S.Modules>
      </S.Container>
    </S.Layout>
  );
};

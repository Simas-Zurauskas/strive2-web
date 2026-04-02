'use client';

import { useRouter } from 'next/navigation';
import { CourseCard, Button } from '@/components';
import { useAuth, useCourses } from '@/hooks';
import { useJobManager } from '@/hooks/useJobManager';
import * as S from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const { isJobRunningForCourse } = useJobManager();

  return (
    <S.Layout>
      <S.Header>
        <S.Title>My Courses</S.Title>
        <S.HeaderActions>
          {user?.email && (
            <S.UserEmailLink onClick={() => router.push('/profile')}>
              {user.email}
              {user.emailVerified ? (
                <S.VerifiedBadge title="Email verified">&#10003;</S.VerifiedBadge>
              ) : (
                <S.UnverifiedBadge title="Email not verified">&#10007;</S.UnverifiedBadge>
              )}
            </S.UserEmailLink>
          )}
          <Button variant="primary" onClick={() => router.push('/generate-course')}>
            New Course
          </Button>
        </S.HeaderActions>
      </S.Header>

      {isLoading && <S.LoadingText>Loading courses...</S.LoadingText>}

      {!isLoading && (!courses || courses.length === 0) && (
        <S.EmptyState>
          <S.EmptyText>No courses yet. Create your first course to get started.</S.EmptyText>
          <Button variant="primary" onClick={() => router.push('/generate-course')}>
            Create Course
          </Button>
        </S.EmptyState>
      )}

      {!isLoading && courses && courses.length > 0 && (
        <S.Grid>
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isGenerating={isJobRunningForCourse(course._id)}
              onClick={() => router.push(`/course/${course._id}`)}
            />
          ))}
        </S.Grid>
      )}
    </S.Layout>
  );
};

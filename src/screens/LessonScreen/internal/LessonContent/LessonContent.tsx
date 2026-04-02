'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { generateLesson } from '@/api/routes/course';
import { Button } from '@/components';
import { useLessonContent } from '@/hooks/useLessonContent';
import { useJobManager } from '@/hooks/useJobManager';
import { QKeys } from '@/types';
import { BlockRenderer } from './internal';
import * as S from './LessonContent.styles';

interface Lesson {
  name: string;
  description: string;
}

interface LessonContentProps {
  courseId: string;
  moduleName: string;
  moduleIndex: number;
  lessonIndex: number;
  lesson: Lesson;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenSidebar: () => void;
  sidebarOpen: boolean;
}

export const LessonContent = ({
  courseId,
  moduleName,
  moduleIndex,
  lessonIndex,
  lesson,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onOpenSidebar,
  sidebarOpen,
}: LessonContentProps) => {
  const queryClient = useQueryClient();
  const { trackJob, isJobRunningForCourse } = useJobManager();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: lessonContent, isLoading: isLoadingContent } = useLessonContent(courseId, moduleIndex, lessonIndex);
  const isJobRunning = isJobRunningForCourse(courseId);
  const hasContent = !!lessonContent?.blocks?.length;

  const generateMutation = useMutation({
    mutationFn: () => generateLesson(courseId, { moduleIndex, lessonIndex }),
    onSuccess: (data) => {
      setIsGenerating(true);
      trackJob({
        jobId: data.jobId,
        courseId,
        type: 'generate_lesson',
        onComplete: () => {
          setIsGenerating(false);
          queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
        },
      });
    },
  });

  const handleGenerate = () => {
    if (isJobRunning || generateMutation.isPending) return;
    generateMutation.mutate();
  };

  return (
    <S.Container>
      {/* Desktop sidebar toggle + breadcrumb */}
      <S.TopRow>
        {!sidebarOpen && (
          <S.SidebarToggle onClick={onOpenSidebar} aria-label="Open sidebar">
            &#9776;
          </S.SidebarToggle>
        )}
        <S.Breadcrumb>
          Module {moduleIndex + 1}: {moduleName}
          <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
          Lesson {lessonIndex + 1}
        </S.Breadcrumb>
      </S.TopRow>

      {/* Hero image */}
      {lessonContent?.heroImageUrl && (
        <S.HeroImage src={lessonContent.heroImageUrl} alt={lesson.name} />
      )}

      <S.Title>{lesson.name}</S.Title>

      {/* Content area — 3 states */}
      {hasContent ? (
        // State C: Content exists — render blocks
        <BlockRenderer blocks={lessonContent.blocks} />
      ) : isGenerating ? (
        // State B: Currently generating
        <S.Placeholder>
          <S.GeneratingText>Generating lesson content...</S.GeneratingText>
        </S.Placeholder>
      ) : (
        // State A: No content yet
        <S.Placeholder>
          {isLoadingContent ? (
            <S.PlaceholderText>Loading...</S.PlaceholderText>
          ) : (
            <>
              <S.PlaceholderText>
                {lesson.description}
              </S.PlaceholderText>
              <Button
                onClick={handleGenerate}
                loading={generateMutation.isPending}
                disabled={isJobRunning}
              >
                Generate this lesson
              </Button>
            </>
          )}
        </S.Placeholder>
      )}

      {/* Prev / Next navigation */}
      <S.Nav>
        <S.NavButton onClick={onPrev} $hidden={!hasPrev}>
          &larr; Previous
        </S.NavButton>
        <S.NavButton onClick={onNext} $hidden={!hasNext}>
          Next &rarr;
        </S.NavButton>
      </S.Nav>
    </S.Container>
  );
};

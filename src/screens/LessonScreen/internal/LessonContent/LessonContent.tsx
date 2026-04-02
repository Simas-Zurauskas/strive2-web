'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { streamLesson, LessonBlock } from '@/api/routes/course';
import { Button } from '@/components';
import { useLessonContent } from '@/hooks/useLessonContent';
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

  const { data: lessonContent, isLoading: isLoadingContent } = useLessonContent(courseId, moduleIndex, lessonIndex);
  const hasContent = !!lessonContent?.blocks?.length;

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBlocks, setStreamBlocks] = useState<LessonBlock[]>([]);
  const [streamImage, setStreamImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (isStreaming || isStarting) return;

    setIsStarting(true);
    setStreamBlocks([]);
    setStreamImage(null);

    try {
      setIsStreaming(true);
      setIsStarting(false);

      await streamLesson(courseId, { moduleIndex, lessonIndex }, (event) => {
        switch (event.type) {
          case 'blocks':
            setStreamBlocks((prev) => [...prev, ...event.blocks]);
            break;
          case 'hero_image':
            setStreamImage(event.url);
            break;
          case 'complete':
            setIsStreaming(false);
            queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
            break;
          case 'error':
            setIsStreaming(false);
            toast.error(event.message || 'Generation failed');
            break;
        }
      });
    } catch {
      setIsStreaming(false);
      setIsStarting(false);
      toast.error('Generation failed');
    }
  }, [courseId, moduleIndex, lessonIndex, isStreaming, isStarting, queryClient]);

  // Determine what to render
  const showStreamContent = isStreaming && streamBlocks.length > 0;
  const heroImage = hasContent ? lessonContent?.heroImageUrl : streamImage;
  const blocks = hasContent ? lessonContent.blocks : showStreamContent ? streamBlocks : null;

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
      {heroImage && <S.HeroImage src={heroImage} alt={lesson.name} />}

      <S.Title>{lesson.name}</S.Title>

      {/* Content area */}
      {blocks ? (
        <>
          <BlockRenderer blocks={blocks} />
          {isStreaming && <S.StreamingIndicator>Still generating...</S.StreamingIndicator>}
        </>
      ) : isStreaming || isStarting ? (
        <S.Placeholder>
          <S.GeneratingText>Generating lesson content...</S.GeneratingText>
        </S.Placeholder>
      ) : (
        <S.Placeholder>
          {isLoadingContent ? (
            <S.PlaceholderText>Loading...</S.PlaceholderText>
          ) : (
            <>
              <S.PlaceholderText>{lesson.description}</S.PlaceholderText>
              <Button onClick={handleGenerate}>Generate this lesson</Button>
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

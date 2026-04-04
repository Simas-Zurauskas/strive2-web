'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { streamLesson, LessonBlock, PlaceholderBlock, CourseProgressResponse } from '@/api/routes/course';
import { Button } from '@/components';
import { useLessonContent, useUpsertProgress } from '@/hooks';
import { celebrateLessonComplete, celebrateModuleComplete, celebrateCourseComplete } from '@/lib/celebrations';
import { QKeys } from '@/types';
import { BlockRenderer, NotesPanel } from './internal';
import * as S from './LessonContent.styles';

interface Lesson {
  name: string;
  description: string;
}

interface Module {
  name: string;
  lessons: Lesson[];
}

interface LessonContentProps {
  courseId: string;
  moduleName: string;
  moduleIndex: number;
  lessonIndex: number;
  lesson: Lesson;
  modules: Module[];
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenSidebar: () => void;
  sidebarOpen: boolean;
  isGenerationRunning: boolean;
  progressData?: CourseProgressResponse;
}

export const LessonContent = ({
  courseId,
  moduleName,
  moduleIndex,
  lessonIndex,
  lesson,
  modules,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onOpenSidebar,
  sidebarOpen,
  isGenerationRunning,
  progressData,
}: LessonContentProps) => {
  const queryClient = useQueryClient();
  const upsertProgress = useUpsertProgress();

  const { data: lessonContent, isLoading: isLoadingContent } = useLessonContent(
    courseId,
    moduleIndex,
    lessonIndex,
    isGenerationRunning,
  );
  const hasContent = !!lessonContent?.blocks?.length;

  // Check if previous lesson is generated (required before generating this one)
  const isFirstLesson = moduleIndex === 0 && lessonIndex === 0;
  const prevCoords = isFirstLesson
    ? null
    : lessonIndex > 0
      ? { mi: moduleIndex, li: lessonIndex - 1 }
      : { mi: moduleIndex - 1, li: modules[moduleIndex - 1]?.lessons?.length - 1 };

  const { data: prevLessonContent } = useLessonContent(
    courseId,
    prevCoords?.mi ?? 0,
    prevCoords?.li ?? 0,
    false,
    !isFirstLesson && !hasContent,
  );

  const isPrevLessonGenerated = isFirstLesson || !!prevLessonContent?.blocks?.length;

  // Streaming state — 'streaming' = content generating, 'finishing' = interactive + links pending
  const [streamPhase, setStreamPhase] = useState<'idle' | 'streaming' | 'finishing'>('idle');
  const [streamBlocks, setStreamBlocks] = useState<LessonBlock[]>([]);
  const [streamImage, setStreamImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [placeholders, setPlaceholders] = useState<PlaceholderBlock[]>([]);

  const isStreaming = streamPhase !== 'idle';
  const isActivelyGenerating = streamPhase === 'streaming';
  const abortRef = useRef<AbortController | null>(null);

  // Generation options
  const [includeImage, setIncludeImage] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(true);

  // Progress state
  const currentLessonProgress = progressData?.lessons?.find(
    (lp) => lp.moduleIndex === moduleIndex && lp.lessonIndex === lessonIndex,
  );
  const isCompleted = currentLessonProgress?.status === 'completed';
  const isBookmarked = currentLessonProgress?.bookmarked ?? false;

  const handleGenerate = useCallback(async () => {
    if (isStreaming || isStarting) return;

    setIsStarting(true);
    setStreamBlocks([]);
    setStreamImage(null);
    setPlaceholders([]);

    try {
      setStreamPhase('streaming');
      setIsStarting(false);

      await streamLesson(courseId, { moduleIndex, lessonIndex, includeImage, includeLinks }, (event) => {
        switch (event.type) {
          case 'block':
            setStreamBlocks((prev) => [...prev, event.block]);
            // Remove placeholder matching this block type
            if (event.block.type === 'quiz' || event.block.type === 'exercise') {
              setPlaceholders((prev) => {
                const idx = prev.findIndex((p) => p.type === event.block.type);
                return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev;
              });
            }
            break;
          case 'blocks':
            setStreamBlocks((prev) => [...prev, ...event.blocks]);
            break;
          case 'hero_image':
            setStreamImage(event.url);
            break;
          case 'content_ready':
            setStreamPhase('finishing');
            setPlaceholders(event.placeholders);
            break;
          case 'complete':
            setStreamPhase('idle');
            setPlaceholders([]);
            queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
            queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS, courseId] });
            break;
          case 'error':
            setStreamPhase('idle');
            setPlaceholders([]);
            toast.error(event.message || 'Generation failed');
            break;
        }
      });
    } catch {
      setStreamPhase('idle');
      setIsStarting(false);
      setPlaceholders([]);
      toast.error('Generation failed');
    }
  }, [courseId, moduleIndex, lessonIndex, isStreaming, isStarting, includeImage, includeLinks, queryClient]);

  const handleMarkComplete = useCallback(() => {
    upsertProgress.mutate(
      { courseId, moduleIndex, lessonIndex, data: { status: 'completed' } },
      {
        onSuccess: () => {
          // Calculate what this completion means
          const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
          const completedBefore = progressData?.stats?.completed ?? 0;
          const completedNow = completedBefore + 1;

          // Check module completion
          const moduleLessons = modules[moduleIndex]?.lessons?.length ?? 0;
          let moduleCompletedBefore = 0;
          for (let li = 0; li < moduleLessons; li++) {
            const lp = progressData?.lessons?.find((p) => p.moduleIndex === moduleIndex && p.lessonIndex === li);
            if (lp?.status === 'completed') moduleCompletedBefore++;
          }
          const isModuleComplete = moduleCompletedBefore + 1 === moduleLessons;
          const isCourseComplete = completedNow === totalLessons;

          // Fire celebrations (biggest first)
          if (isCourseComplete) {
            celebrateCourseComplete();
            toast.success('Congratulations! Course complete!');
          } else if (isModuleComplete) {
            celebrateModuleComplete();
            toast.success(`Module ${moduleIndex + 1} complete! Take the quiz to test your knowledge.`);
          } else {
            celebrateLessonComplete();
            // Goal-gradient: encourage when close to finishing module
            const moduleRemaining = moduleLessons - (moduleCompletedBefore + 1);
            if (moduleRemaining === 1) {
              toast.success('Just 1 more lesson in this module!');
            } else {
              toast.success('Lesson complete!');
            }
          }
        },
      },
    );
  }, [courseId, moduleIndex, lessonIndex, modules, progressData, upsertProgress]);

  const handleToggleBookmark = useCallback(() => {
    upsertProgress.mutate({
      courseId,
      moduleIndex,
      lessonIndex,
      data: { bookmarked: !isBookmarked },
    });
  }, [courseId, moduleIndex, lessonIndex, isBookmarked, upsertProgress]);

  // Determine what to render — stream image takes priority (arrives before DB save)
  const showStreamContent = isStreaming && streamBlocks.length > 0;
  const heroImage = streamImage || lessonContent?.heroImageUrl || null;
  const blocks = hasContent ? lessonContent.blocks : showStreamContent ? streamBlocks : null;

  return (
    <S.Container>
      {/* Desktop sidebar toggle + breadcrumb + bookmark */}
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
        {(isStreaming || isGenerationRunning) && <S.GeneratingDot />}
        {hasContent && (
          <S.BookmarkButton
            $active={isBookmarked}
            onClick={handleToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
          >
            {isBookmarked ? '★' : '☆'}
          </S.BookmarkButton>
        )}
      </S.TopRow>

      {/* Hero image / skeleton */}
      {heroImage ? (
        <S.HeroImage src={heroImage} alt={lesson.name} />
      ) : (isStreaming || isStarting) && includeImage ? (
        <S.HeroImageSkeleton />
      ) : isGenerationRunning && (lessonContent?.includeHeroImage ?? true) ? (
        <S.HeroImageSkeleton />
      ) : null}

      <S.Title>{lesson.name}</S.Title>

      {/* Content area — priority: saved content > streaming > loading > generate button */}
      {blocks ? (
        <>
          <BlockRenderer
            blocks={blocks}
            placeholders={placeholders}
            progressData={currentLessonProgress ? {
              quizResponses: currentLessonProgress.quizResponses,
              exerciseAttempts: currentLessonProgress.exerciseAttempts,
            } : undefined}
            onQuizAnswer={(response) => {
              upsertProgress.mutate({
                courseId, moduleIndex, lessonIndex,
                data: { quizResponse: response },
              });
            }}
            onExerciseAttempt={(attempt) => {
              upsertProgress.mutate({
                courseId, moduleIndex, lessonIndex,
                data: { exerciseAttempt: attempt },
              });
            }}
          />
          {isActivelyGenerating && <S.StreamingIndicator>Generating...</S.StreamingIndicator>}
          {streamPhase === 'finishing' && !placeholders.length && <S.FinishingIndicator>Finishing up...</S.FinishingIndicator>}
          {!isStreaming && isGenerationRunning && <S.StreamingIndicator>Generating...</S.StreamingIndicator>}
        </>
      ) : isStreaming || isStarting ? (
        <S.StreamingIndicator>Generating...</S.StreamingIndicator>
      ) : isLoadingContent ? (
        <S.Placeholder>
          <S.GeneratingText>Loading...</S.GeneratingText>
        </S.Placeholder>
      ) : (
        <S.Placeholder>
          <S.PlaceholderText>{lesson.description}</S.PlaceholderText>

          {isPrevLessonGenerated ? (
            <>
              <S.GenerateOptions>
                <S.ToggleLabel>
                  <input type="checkbox" checked={includeImage} onChange={(e) => setIncludeImage(e.target.checked)} />
                  Hero image
                </S.ToggleLabel>
                <S.ToggleLabel>
                  <input type="checkbox" checked={includeLinks} onChange={(e) => setIncludeLinks(e.target.checked)} />
                  Further reading
                </S.ToggleLabel>
              </S.GenerateOptions>

              <Button onClick={handleGenerate} disabled={isGenerationRunning}>
                {isGenerationRunning ? 'Another lesson is generating...' : 'Generate this lesson'}
              </Button>
            </>
          ) : (
            <S.PlaceholderText>Generate the previous lesson first to unlock this one.</S.PlaceholderText>
          )}
        </S.Placeholder>
      )}

      {/* Notes panel */}
      {hasContent && !isStreaming && !isGenerationRunning && (
        <NotesPanel
          courseId={courseId}
          moduleIndex={moduleIndex}
          lessonIndex={lessonIndex}
          initialNotes={currentLessonProgress?.notes ?? null}
        />
      )}

      {/* Mark as Complete */}
      {hasContent && !isStreaming && !isGenerationRunning && (
        <S.CompleteSection>
          {isCompleted ? (
            <S.CompletedIndicator>&#10003; Lesson completed</S.CompletedIndicator>
          ) : (
            <S.CompleteButton
              onClick={handleMarkComplete}
              disabled={upsertProgress.isPending}
            >
              &#10003; Mark as complete
            </S.CompleteButton>
          )}
        </S.CompleteSection>
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

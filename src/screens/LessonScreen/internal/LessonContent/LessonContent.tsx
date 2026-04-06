'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { streamLesson, LessonBlock, PlaceholderBlock, CourseProgressResponse } from '@/api/routes/course';
import { Button } from '@/components';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { useLessonContent, useUpsertProgress } from '@/hooks';
import { celebrateLessonComplete, celebrateModuleComplete, celebrateCourseComplete } from '@/lib/celebrations';
import { QKeys } from '@/types';
import { BlockRenderer, FontScaler, getSavedScale, FONT_SCALE_KEY, LessonHero, NotesPanel } from './internal';
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
  const [fontScale, setFontScale] = useState(getSavedScale);

  const handleFontScale = (scale: number) => {
    setFontScale(scale);
    localStorage.setItem(FONT_SCALE_KEY, String(scale));
  };

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
            toast.error(toastMessage(event.message, TOASTS.GENERATION_FAILED));
            break;
        }
      });
    } catch {
      setStreamPhase('idle');
      setIsStarting(false);
      setPlaceholders([]);
      toast.error(TOASTS.GENERATION_FAILED);
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
            toast.success(TOASTS.COURSE_COMPLETE);
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
              toast.success(TOASTS.LESSON_COMPLETE);
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

  // Eyebrow text
  const eyebrowText = `Module ${String(moduleIndex + 1).padStart(2, '0')} \u00B7 Lesson ${String(lessonIndex + 1).padStart(2, '0')}`;

  // Nav helper: get adjacent lesson name
  const getPrevLessonName = () => {
    if (!hasPrev) return null;
    if (lessonIndex > 0) return modules[moduleIndex]?.lessons[lessonIndex - 1]?.name;
    const prevMod = modules[moduleIndex - 1];
    return prevMod?.lessons[prevMod.lessons.length - 1]?.name;
  };

  const getNextLessonName = () => {
    if (!hasNext) return null;
    if (lessonIndex < (modules[moduleIndex]?.lessons?.length ?? 0) - 1) {
      return modules[moduleIndex]?.lessons[lessonIndex + 1]?.name;
    }
    return modules[moduleIndex + 1]?.lessons[0]?.name;
  };

  return (
    <S.Container>
      <LessonHero
        heroImage={heroImage}
        eyebrowText={eyebrowText}
        lessonName={lesson.name}
        isBookmarked={isBookmarked}
        hasContent={hasContent}
        isGenerating={isStreaming || isGenerationRunning}
        showSkeleton={
          ((isStreaming || isStarting) && includeImage) ||
          (isGenerationRunning && (lessonContent?.includeHeroImage ?? true))
        }
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Font scaler + lesson description + content blocks — all scaled together */}
      {blocks && <FontScaler scale={fontScale} onChange={handleFontScale} />}

      <S.ScaledContent $scale={fontScale}>
        {lesson.description && blocks && <S.LessonDescription>{lesson.description}</S.LessonDescription>}

        {/* Content area — priority: saved content > streaming > loading > generate button */}
        {blocks ? (
          <>
            <BlockRenderer
            blocks={blocks}
            placeholders={placeholders}
            progressData={
              currentLessonProgress
                ? {
                    quizResponses: currentLessonProgress.quizResponses,
                    exerciseAttempts: currentLessonProgress.exerciseAttempts,
                  }
                : undefined
            }
            onQuizAnswer={(response) => {
              upsertProgress.mutate({
                courseId,
                moduleIndex,
                lessonIndex,
                data: { quizResponse: response },
              });
            }}
            onExerciseAttempt={(attempt) => {
              upsertProgress.mutate({
                courseId,
                moduleIndex,
                lessonIndex,
                data: { exerciseAttempt: attempt },
              });
            }}
          />
          {isActivelyGenerating && <S.StreamingIndicator>Generating...</S.StreamingIndicator>}
          {streamPhase === 'finishing' && !placeholders.length && (
            <S.FinishingIndicator>Finishing up...</S.FinishingIndicator>
          )}
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
            <S.CompleteButton onClick={handleMarkComplete} disabled={upsertProgress.isPending}>
              &#10003; Mark as complete
            </S.CompleteButton>
          )}
        </S.CompleteSection>
      )}

      </S.ScaledContent>

      {/* Prev / Next navigation */}
      <S.Nav>
        <S.NavButton onClick={onPrev} $hidden={!hasPrev} $direction="prev">
          <S.NavLabel>&larr; Previous Lesson</S.NavLabel>
          {hasPrev && <S.NavLessonName>{getPrevLessonName()}</S.NavLessonName>}
        </S.NavButton>
        <S.NavButton onClick={onNext} $hidden={!hasNext} $direction="next">
          <S.NavLabel>Next Lesson &rarr;</S.NavLabel>
          {hasNext && <S.NavLessonName>{getNextLessonName()}</S.NavLessonName>}
        </S.NavButton>
      </S.Nav>
    </S.Container>
  );
};

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { streamLesson, PlaceholderBlock } from '@/api/routes/course';
import type { CourseProgressResponse } from '@/api/routes/course';
import type { Course, LessonBlock } from '@/api/types';
import { Button, Checkbox } from '@/components';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { useJobManager, useLessonContent, useUpsertProgress } from '@/hooks';
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
  lessons?: Lesson[];
}

interface LessonContentProps {
  courseId: string;
  courseObjectId: string | undefined;
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
  isThisLessonGenerating: boolean;
  progressData?: CourseProgressResponse;
}

export const LessonContent = ({
  courseId,
  courseObjectId,
  moduleIndex,
  lessonIndex,
  lesson,
  modules,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  isGenerationRunning,
  isThisLessonGenerating: isThisLessonGeneratingWs,
  progressData,
}: LessonContentProps) => {
  const queryClient = useQueryClient();
  const { generatingLesson, setGeneratingLesson } = useJobManager();
  // Use both sources: WS-based generatingLesson (instant) + server activeJobId (survives reload)
  const isAnyLessonGenerating = !!generatingLesson || isGenerationRunning;
  const upsertProgress = useUpsertProgress();
  const [fontScale, setFontScale] = useState(getSavedScale);

  const handleFontScale = (scale: number) => {
    setFontScale(scale);
    localStorage.setItem(FONT_SCALE_KEY, String(scale));
  };

  // Poll when generating: WS match OR reload fallback (activeJobId set but no WS state yet)
  const shouldPoll = isThisLessonGeneratingWs || (!generatingLesson && isGenerationRunning);
  const { data: lessonContent, isLoading: isLoadingContent } = useLessonContent(
    courseId,
    moduleIndex,
    lessonIndex,
    shouldPoll,
  );
  const hasContent = !!lessonContent?.blocks?.length;

  // Check if previous lesson is generated (required before generating this one)
  const isFirstLesson = moduleIndex === 0 && lessonIndex === 0;
  const prevCoords = isFirstLesson
    ? null
    : lessonIndex > 0
      ? { mi: moduleIndex, li: lessonIndex - 1 }
      : { mi: moduleIndex - 1, li: (modules[moduleIndex - 1]?.lessons?.length ?? 1) - 1 };

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

  const abortRef = useRef<AbortController | null>(null);

  // Abort any in-flight stream when the component unmounts (lesson change or navigation)
  useEffect(() => {
    console.log(`[DEBUG] LessonContent MOUNT m${moduleIndex}/l${lessonIndex}`);
    return () => {
      console.log(`[DEBUG] LessonContent UNMOUNT m${moduleIndex}/l${lessonIndex}`);
      abortRef.current?.abort();
    };
  }, []);

  const isStreaming = streamPhase !== 'idle';
  const isActivelyGenerating = streamPhase === 'streaming';
  // True when THIS specific lesson is being generated:
  // - isStreaming: local SSE stream is active (user stayed on page)
  // - isThisLessonGeneratingWs: WebSocket told us this lesson's coordinates match (navigate away/back, other tabs)
  // - reloadFallback: page reload loses WS state — use activeJobId + hasContent (partial save = generating)
  const reloadFallback = !generatingLesson && isGenerationRunning && hasContent && !(lessonContent as Record<string, unknown>)?.completed;
  const isThisLessonGenerating = isStreaming || isThisLessonGeneratingWs || reloadFallback;
  // Generation options (persisted to localStorage)
  const [includeImage, setIncludeImage] = useState(() => localStorage.getItem('gen_includeImage') !== 'false');
  const [includeLinks, setIncludeLinks] = useState(() => localStorage.getItem('gen_includeLinks') !== 'false');

  const handleIncludeImage = (v: boolean) => {
    setIncludeImage(v);
    localStorage.setItem('gen_includeImage', String(v));
  };

  const handleIncludeLinks = (v: boolean) => {
    setIncludeLinks(v);
    localStorage.setItem('gen_includeLinks', String(v));
  };

  // Progress state
  const currentLessonProgress = progressData?.lessons?.find(
    (lp) => lp.moduleIndex === moduleIndex && lp.lessonIndex === lessonIndex,
  );
  const isCompleted = currentLessonProgress?.status === 'completed';
  const isBookmarked = currentLessonProgress?.bookmarked ?? false;

  const handleGenerate = useCallback(async () => {
    if (isStreaming || isStarting) return;
    console.log(`[DEBUG] handleGenerate START m${moduleIndex}/l${lessonIndex}`);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Optimistically track which lesson is generating (before WS event arrives)
    // Use courseObjectId (MongoDB _id) to match what the server sends via WebSocket
    if (courseObjectId) {
      setGeneratingLesson({ courseId: courseObjectId, moduleIndex, lessonIndex });
    }
    console.log(`[DEBUG] handleGenerate OPTIMISTIC generatingLesson set (objectId=${courseObjectId})`);

    setIsStarting(true);
    setStreamBlocks([]);
    setStreamImage(null);
    setPlaceholders([]);

    try {
      setStreamPhase('streaming');
      setIsStarting(false);

      await streamLesson({ courseId, moduleIndex, lessonIndex, includeImage, includeLinks, signal: controller.signal, onEvent: (event) => {
        console.log(`[DEBUG] stream event: ${event.type}`);
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
            console.log(`[DEBUG] stream COMPLETE — clearing state`);
            setStreamPhase('idle');
            setPlaceholders([]);
            setGeneratingLesson(null);
            // Optimistically clear activeJobId so navigation to other lessons immediately shows "Create lesson"
            queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
              old ? { ...old, activeJobId: undefined } : old,
            );
            queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
            queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS, courseId] });
            queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
            break;
          case 'error':
            console.log(`[DEBUG] stream ERROR: ${event.message} — clearing state`);
            setStreamPhase('idle');
            setPlaceholders([]);
            setGeneratingLesson(null);
            queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
              old ? { ...old, activeJobId: undefined } : old,
            );
            queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
            queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
            queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS, courseId] });
            toast.error(toastMessage(event.message, TOASTS.GENERATION_FAILED));
            break;
        }
      } });
    } catch (err: unknown) {
      console.log(`[DEBUG] stream CATCH: ${err} | abort=${err instanceof DOMException && err.name === 'AbortError'}`);
      if (err instanceof DOMException && err.name === 'AbortError') return; // navigated away — WS handles cleanup
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
          const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
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
            // Auto-advance to next lesson after a brief pause
            if (hasNext) setTimeout(onNext, 800);
          }
        },
      },
    );
  }, [courseId, moduleIndex, lessonIndex, modules, progressData, upsertProgress, hasNext, onNext]);

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
    if (lessonIndex > 0) return modules[moduleIndex]?.lessons?.[lessonIndex - 1]?.name;
    const prevMod = modules[moduleIndex - 1];
    return prevMod?.lessons?.[(prevMod.lessons?.length ?? 1) - 1]?.name;
  };

  const getNextLessonName = () => {
    if (!hasNext) return null;
    if (lessonIndex < (modules[moduleIndex]?.lessons?.length ?? 0) - 1) {
      return modules[moduleIndex]?.lessons?.[lessonIndex + 1]?.name;
    }
    return modules[moduleIndex + 1]?.lessons?.[0]?.name;
  };

  console.log(`[DEBUG] LessonContent RENDER m${moduleIndex}/l${lessonIndex} | isGenRunning=${isGenerationRunning} thisGenerating=${isThisLessonGenerating} | hasContent=${hasContent} blocks=${blocks?.length ?? 0} | isStreaming=${isStreaming} phase=${streamPhase} | heroImage=${!!heroImage} | showComplete=${hasContent && !isThisLessonGenerating}`);

  if (isLoadingContent) {
    return (
      <S.Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.5 }}>
          Loading...
        </div>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <LessonHero
        heroImage={heroImage}
        eyebrowText={eyebrowText}
        lessonName={lesson.name}
        isBookmarked={isBookmarked}
        hasContent={hasContent}
        isGenerating={isThisLessonGenerating}
        showSkeleton={
          ((isStreaming || isStarting) && includeImage) ||
          (isThisLessonGenerating && !isStreaming && (lessonContent?.includeHeroImage ?? true) && !lessonContent?.heroImageUrl)
        }
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Font scaler + lesson description + content blocks — all scaled together */}
      {blocks && <FontScaler scale={fontScale} onChange={handleFontScale} />}

      <S.ScaledContent $scale={fontScale}>
        {lesson.description && <S.LessonDescription>{lesson.description}</S.LessonDescription>}

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
            {isActivelyGenerating && <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>}
            {streamPhase === 'finishing' && !placeholders.length && (
              <S.FinishingIndicator>Finishing up...</S.FinishingIndicator>
            )}
            {!isStreaming && isThisLessonGenerating && <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>}
          </>
        ) : isStreaming || isStarting || isThisLessonGenerating ? (
          <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>
        ) : (
          <S.Placeholder>
            {isPrevLessonGenerated ? (
              <>
                <S.GenerateOptions>
                  <S.GenerateOptionsHeading>Optional extras</S.GenerateOptionsHeading>
                  <Checkbox
                    label="Hero image"
                    description="Decorative cover image for the lesson"
                    checked={includeImage}
                    onChange={(e) => handleIncludeImage(e.target.checked)}
                  />
                  <Checkbox
                    label="Further reading"
                    description="AI-curated links to deepen your understanding"
                    checked={includeLinks}
                    onChange={(e) => handleIncludeLinks(e.target.checked)}
                  />
                </S.GenerateOptions>

                <Button onClick={handleGenerate} disabled={isAnyLessonGenerating}>
                  {isAnyLessonGenerating ? 'Another lesson is being created...' : 'Create lesson'}
                </Button>
              </>
            ) : (
              <S.PlaceholderText>Create the previous lesson first to unlock this one.</S.PlaceholderText>
            )}
          </S.Placeholder>
        )}

        {/* Notes panel */}
        {hasContent && !isThisLessonGenerating && (
          <NotesPanel
            courseId={courseId}
            moduleIndex={moduleIndex}
            lessonIndex={lessonIndex}
            initialNotes={currentLessonProgress?.notes ?? null}
          />
        )}

        {/* Mark as Complete */}
        {hasContent && !isThisLessonGenerating && (
          <S.CompleteSection>
            <AnimatePresence mode="wait" initial={false}>
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <S.CompletedBanner>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                    </svg>
                    Lesson completed
                  </S.CompletedBanner>
                </motion.div>
              ) : (
                <motion.div
                  key="incomplete"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <S.CompleteButton onClick={handleMarkComplete} disabled={upsertProgress.isPending}>
                    {upsertProgress.isPending ? (
                      <S.Spinner />
                    ) : (
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                      </svg>
                    )}
                    {upsertProgress.isPending ? 'Completing...' : hasNext ? 'Complete & continue' : 'Mark as complete'}
                  </S.CompleteButton>
                </motion.div>
              )}
            </AnimatePresence>
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

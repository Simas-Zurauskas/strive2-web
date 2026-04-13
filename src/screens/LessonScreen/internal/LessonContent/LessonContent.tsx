'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Button, Checkbox } from '@/components';
import { useJobManager, useLessonContent } from '@/hooks';
import {
  BlockRenderer,
  FontScaler,
  getSavedScale,
  FONT_SCALE_KEY,
  LessonHero,
  NotesPanel,
  useLessonStream,
  useLessonCompletion,
} from './internal';
import * as S from './LessonContent.styles';
import type { CourseProgressResponse } from '@/api/routes/course';

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
  const { generatingLesson } = useJobManager();
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

  const stream = useLessonStream({
    courseId,
    courseObjectId,
    moduleIndex,
    lessonIndex,
    isGenerationRunning,
    hasContent,
    lessonCompleted: !!(lessonContent as Record<string, unknown>)?.completed,
  });

  const completion = useLessonCompletion({
    courseId,
    moduleIndex,
    lessonIndex,
    modules,
    progressData,
    hasNext,
    onNext,
  });

  const isThisLessonGenerating = stream.isThisLessonGenerating || isThisLessonGeneratingWs;
  const heroImage = stream.streamImage || lessonContent?.heroImageUrl || null;
  const showHeroSkeleton =
    ((stream.isStreaming || stream.isStarting) && stream.includeImage) ||
    (isThisLessonGenerating && !stream.isStreaming && (lessonContent?.includeHeroImage ?? true) && !lessonContent?.heroImageUrl);

  // Determine what to render — stream takes priority over saved content during streaming
  const showStreamContent = stream.isStreaming && stream.streamBlocks.length > 0;
  const blocks = hasContent ? lessonContent.blocks : showStreamContent ? stream.streamBlocks : null;

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
        isBookmarked={completion.isBookmarked}
        hasContent={hasContent}
        isGenerating={isThisLessonGenerating}
        showSkeleton={showHeroSkeleton}
        onToggleBookmark={completion.handleToggleBookmark}
      />

      {blocks && <FontScaler scale={fontScale} onChange={handleFontScale} />}

      <S.ScaledContent $scale={fontScale}>
        {lesson.description && <S.LessonDescription>{lesson.description}</S.LessonDescription>}

        {blocks ? (
          <>
            <BlockRenderer
              blocks={blocks}
              placeholders={stream.placeholders}
              progressData={
                completion.currentLessonProgress
                  ? {
                      quizResponses: completion.currentLessonProgress.quizResponses,
                      exerciseAttempts: completion.currentLessonProgress.exerciseAttempts,
                    }
                  : undefined
              }
              onQuizAnswer={(response) => {
                completion.upsertProgress.mutate({
                  courseId,
                  moduleIndex,
                  lessonIndex,
                  data: { quizResponse: response },
                });
              }}
              onExerciseAttempt={(attempt) => {
                completion.upsertProgress.mutate({
                  courseId,
                  moduleIndex,
                  lessonIndex,
                  data: { exerciseAttempt: attempt },
                });
              }}
            />
            {stream.isActivelyGenerating && <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>}
            {stream.streamPhase === 'finishing' && !stream.placeholders.length && (
              <S.FinishingIndicator>Finishing up...</S.FinishingIndicator>
            )}
            {!stream.isStreaming && isThisLessonGenerating && <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>}
          </>
        ) : stream.isStreaming || stream.isStarting || isThisLessonGenerating ? (
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
                    checked={stream.includeImage}
                    onChange={(e) => stream.handleIncludeImage(e.target.checked)}
                  />
                  <Checkbox
                    label="Further reading"
                    description="AI-curated links to deepen your understanding"
                    checked={stream.includeLinks}
                    onChange={(e) => stream.handleIncludeLinks(e.target.checked)}
                  />
                </S.GenerateOptions>

                <Button onClick={stream.handleGenerate} disabled={stream.isAnyLessonGenerating}>
                  {stream.isAnyLessonGenerating ? 'Another lesson is being created...' : 'Create lesson'}
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
            initialNotes={completion.currentLessonProgress?.notes ?? null}
          />
        )}

        {/* Mark as Complete */}
        {hasContent && !isThisLessonGenerating && (
          <S.CompleteSection>
            <AnimatePresence mode="wait" initial={false}>
              {completion.isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <S.CompletedBanner>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                    </svg>
                    Lesson completed
                  </S.CompletedBanner>
                </motion.div>
              ) : (
                <motion.div key="incomplete" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}>
                  <S.CompleteButton onClick={completion.handleMarkComplete} disabled={completion.upsertProgress.isPending}>
                    {completion.upsertProgress.isPending ? (
                      <S.Spinner />
                    ) : (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                      </svg>
                    )}
                    {completion.upsertProgress.isPending ? 'Completing...' : hasNext ? 'Complete & continue' : 'Mark as complete'}
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

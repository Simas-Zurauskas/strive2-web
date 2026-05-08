'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Button, Checkbox, HelpAnchor, TextLoader } from '@/components';
import {
  useJobManager,
  useLessonContent,
  useLessonStream,
  useRegenerateHero,
  useRegenerateLinks,
} from '@/hooks';
import { useBillingSummary } from '@/hooks/useBilling';
import {
  BlockRenderer,
  FontScaler,
  getSavedScale,
  FONT_SCALE_KEY,
  LessonHero,
  LinksBlockSkeleton,
  LinksEmptyPlaceholder,
  NarrationPlayer,
  NotesPanel,
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
  onOpenQuiz: () => void;
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
  onOpenQuiz,
  isGenerationRunning,
  isThisLessonGenerating: isThisLessonGeneratingWs,
  progressData,
}: LessonContentProps) => {
  const { generatingLesson } = useJobManager();
  const [fontScale, setFontScale] = useState(getSavedScale);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const handleFontScale = (scale: number) => {
    setFontScale(scale);
    localStorage.setItem(FONT_SCALE_KEY, String(scale));
  };

  // Poll when generating: WS match OR reload fallback (activeJobId set but no WS state yet)
  const shouldPoll = isThisLessonGeneratingWs || (!generatingLesson && isGenerationRunning);
  const { data: lessonContent, isLoading: isLoadingContent } = useLessonContent({
    courseId,
    moduleIndex,
    lessonIndex,
    isGenerating: shouldPoll,
  });
  const hasContent = !!lessonContent?.blocks?.length;

  // Check if previous lesson is generated (required before generating this one)
  const isFirstLesson = moduleIndex === 0 && lessonIndex === 0;
  const prevCoords = isFirstLesson
    ? null
    : lessonIndex > 0
      ? { mi: moduleIndex, li: lessonIndex - 1 }
      : { mi: moduleIndex - 1, li: (modules[moduleIndex - 1]?.lessons?.length ?? 1) - 1 };

  const { data: prevLessonContent } = useLessonContent({
    courseId,
    moduleIndex: prevCoords?.mi ?? 0,
    lessonIndex: prevCoords?.li ?? 0,
    isGenerating: false,
    enabled: !isFirstLesson && !hasContent,
  });
  const isPrevLessonGenerated = isFirstLesson || !!prevLessonContent?.blocks?.length;

  const stream = useLessonStream({
    courseId,
    courseObjectId,
    moduleIndex,
    lessonIndex,
    isGenerationRunning,
  });

  const completion = useLessonCompletion({
    courseId,
    moduleIndex,
    lessonIndex,
    modules,
    progressData,
    hasNext,
    onNext,
    onOpenQuiz,
  });

  // Gate the Create Lesson CTA on the user having any allowance left. Real
  // cost is debited server-side post-hoc from measured provider spend —
  // there's nothing to compute on the client. While the billing summary is
  // loading we assume affordable (affordable = summary undefined) so the
  // button doesn't flicker disabled on fresh mount.
  const { data: billing } = useBillingSummary();
  const affordable = billing ? billing.credits.total >= 1 : true;

  const regenerateHero = useRegenerateHero();
  const regenerateLinks = useRegenerateLinks();
  const isThisLessonGenerating = stream.isThisLessonGenerating || isThisLessonGeneratingWs;
  const heroImage = stream.streamImage || lessonContent?.heroImageUrl || null;
  const showHeroSkeleton =
    ((stream.isStreaming || stream.isStarting) && stream.includeImage) ||
    (isThisLessonGenerating && !stream.isStreaming && (lessonContent?.includeHeroImage ?? true) && !lessonContent?.heroImageUrl) ||
    regenerateHero.isRegenerating;
  // Offer the on-demand "Generate hero image" button only when the lesson is
  // fully loaded, has no image, and no other generation for this course is
  // running. The server enforces the one-active-job-per-course rule anyway,
  // but gating the UI avoids a click that we know will fail.
  const canRegenerateHero =
    hasContent &&
    !heroImage &&
    !isThisLessonGenerating &&
    !isGenerationRunning &&
    !regenerateHero.isRegenerating;

  // Determine what to render — stream takes priority over saved content during streaming
  const showStreamContent = stream.isStreaming && stream.streamBlocks.length > 0;
  const blocks = hasContent ? lessonContent.blocks : showStreamContent ? stream.streamBlocks : null;

  // Post-hoc links regen: if the lesson was generated without a curated-links
  // block, we show a placeholder at the end of the lesson offering to
  // generate one on demand. Swapped for a skeleton while the regen job runs.
  const hasLinksBlock = !!blocks?.some((b) => b.type === 'links');
  const showLinksPlaceholder =
    hasContent &&
    !hasLinksBlock &&
    !isThisLessonGenerating &&
    !regenerateLinks.isRegenerating;
  const showLinksSkeleton = regenerateLinks.isRegenerating && !hasLinksBlock;
  const canRegenerateLinks = hasContent && !isThisLessonGenerating && !isGenerationRunning;

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
        <TextLoader />
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
        canRegenerateHero={canRegenerateHero}
        onToggleBookmark={completion.handleToggleBookmark}
        onRegenerateHero={() =>
          regenerateHero.regenerate({ courseId, moduleIndex, lessonIndex })
        }
      />

      {hasContent && !isThisLessonGenerating && (
        <NarrationPlayer
          courseId={courseId}
          moduleIndex={moduleIndex}
          lessonIndex={lessonIndex}
          audioUrl={lessonContent?.audioUrl ?? null}
          audioVoice={lessonContent?.audioVoice ?? null}
          hasContent={hasContent}
        />
      )}

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
            {showLinksSkeleton && <LinksBlockSkeleton />}
            {showLinksPlaceholder && (
              <LinksEmptyPlaceholder
                disabled={!canRegenerateLinks}
                onGenerate={() =>
                  regenerateLinks.regenerate({ courseId, moduleIndex, lessonIndex })
                }
              />
            )}
            {isThisLessonGenerating && (
              stream.streamPhase === 'finishing' ? (
                <S.FinishingIndicator>Finishing touches...</S.FinishingIndicator>
              ) : (
                <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>
              )
            )}
          </>
        ) : isThisLessonGenerating ? (
          <S.StreamingIndicator>Creating lesson...</S.StreamingIndicator>
        ) : (
          <S.Placeholder>
            {isPrevLessonGenerated ? (
              <>
                <S.PlaceholderHeader>
                  <S.PlaceholderRule aria-hidden />
                  <S.PlaceholderEyebrow>Ready to generate</S.PlaceholderEyebrow>
                  <S.PlaceholderTitle>This lesson is yours to start.</S.PlaceholderTitle>
                  <S.PlaceholderLead>
                    Pick what to include, then we&rsquo;ll build the lesson around your goal.
                  </S.PlaceholderLead>
                </S.PlaceholderHeader>

                <S.GenerateOptionsBlock>
                  <S.GenerateOptionsCaption>
                    Optional <HelpAnchor concept="lesson-extras" size="sm" />
                  </S.GenerateOptionsCaption>
                  <S.GenerateOptions>
                    <S.GenerateOptionRow>
                      <Checkbox
                        label="Hero image"
                        description="Decorative cover image for the lesson"
                        checked={stream.includeImage}
                        onChange={(e) => stream.handleIncludeImage(e.target.checked)}
                      />
                    </S.GenerateOptionRow>
                    <S.GenerateOptionRow>
                      <Checkbox
                        label="Further reading"
                        description="AI-curated links to deepen your understanding"
                        checked={stream.includeLinks}
                        onChange={(e) => stream.handleIncludeLinks(e.target.checked)}
                      />
                    </S.GenerateOptionRow>
                  </S.GenerateOptions>
                </S.GenerateOptionsBlock>

                <Button onClick={stream.handleGenerate} disabled={stream.isAnyLessonGenerating || !affordable}>
                  {stream.isAnyLessonGenerating
                    ? 'Another lesson is being created…'
                    : !affordable
                    ? 'Out of allowance'
                    : 'Create lesson'}
                </Button>
              </>
            ) : (
              <S.PlaceholderText>
                Generate the previous lesson first — they unlock in order.
              </S.PlaceholderText>
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
                  key="finished"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.3, ease: 'easeOut' }}
                >
                  <S.CompletedBanner>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                    </svg>
                    Lesson finished.
                  </S.CompletedBanner>
                </motion.div>
              ) : (
                <motion.div
                  key="unfinished"
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 0.15 }}
                >
                  <S.CompleteButton
                    onClick={completion.handleMarkComplete}
                    disabled={completion.upsertProgress.isPending}
                  >
                    {completion.upsertProgress.isPending ? (
                      <>
                        <S.Spinner />
                        Saving…
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                        </svg>
                        {hasNext ? 'Mark as finished — next lesson' : 'Mark as finished'}
                        {hasNext && (
                          <svg
                            className="arrow"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        )}
                      </>
                    )}
                  </S.CompleteButton>
                </motion.div>
              )}
            </AnimatePresence>
            <HelpAnchor concept="lesson-completion" size="sm" />
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

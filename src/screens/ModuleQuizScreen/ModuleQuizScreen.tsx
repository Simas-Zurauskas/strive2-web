'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useCourse, useScrollToTopOnStep } from '@/hooks';
import { analytics } from '@/lib/analytics';
import { useQuizState, QuizResults, QuizQuestion, QuizLanding, QuizLoadingShell } from './internal';

export const ModuleQuizScreen = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true';
  const fromQuizzes = searchParams.get('from') === 'quizzes';

  const courseSlug = params.slug as string;
  const moduleIndex = Number(params.moduleIndex);

  const { data: course } = useCourse(courseSlug);
  const courseBasePath = `/course/${course?.slug ?? courseSlug}`;

  const quiz = useQuizState({ courseSlug, moduleIndex });

  const mod = course?.structure?.modules?.[moduleIndex];
  const modules = course?.structure?.modules ?? [];

  // Step identity for the in-place screen swaps this route performs:
  // landing -> question N -> results -> (Retake) -> question 0. Every one of
  // those arrows replaces the whole screen WITHOUT a route change, so the
  // protected layout's pathname-keyed scroll reset never fires and the
  // learner lands wherever the previous step's button happened to be —
  // measured at 375x667, next-question held scrollY 530 (stem above the
  // viewport, option A at -81) and Retake held 1256 on a 2108px document.
  // `null` until the course resolves so the loading shell does not count as
  // the first step. Must stay above the early returns below — it is a hook.
  const stepKey = !course || !mod
    ? null
    : quiz.results
      ? 'results'
      : quiz.quizStarted && quiz.questions.length > 0
        ? `question:${quiz.currentQuestion}`
        : 'landing';
  useScrollToTopOnStep(stepKey);

  useEffect(() => {
    if (course?.activeJobId) {
      quiz.detectActiveJob(course.activeJobId);
    }
  }, [course?.activeJobId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Where the back-link points: when the user landed via the global Quizzes
  // index, return there; otherwise back to the course module list.
  const backHref = fromQuizzes ? '/quizzes' : courseBasePath;
  const backLabel = fromQuizzes ? 'Back to quizzes' : 'Back to module';
  const onBack = () => router.push(backHref);

  // ── Loading: course not yet hydrated ──────────────────

  if (!course || !mod) {
    return <QuizLoadingShell onBack={onBack} backLabel={backLabel} />;
  }

  // ── Results view ──────────────────────────────────────

  if (quiz.results) {
    return (
      <QuizResults
        results={quiz.results}
        mod={mod}
        moduleIndex={moduleIndex}
        courseBasePath={courseBasePath}
        isReviewMode={isReviewMode}
        fromQuizzes={fromQuizzes}
        isGenerating={quiz.isGenerating}
        isResetting={quiz.isResetting}
        onRetake={quiz.handleRetake}
        onNextModule={() => router.push(`${courseBasePath}/lesson/${moduleIndex + 1}/0`)}
        onBackToCourses={() => router.push(ROUTES.home())}
        onBackToReviews={() => router.push('/quizzes')}
        onDevReset={quiz.handleDevReset}
        hasNextModule={moduleIndex < modules.length - 1}
        backLabel={backLabel}
        onBack={onBack}
      />
    );
  }

  // ── Taking quiz ───────────────────────────────────────

  if (quiz.quizStarted && quiz.questions.length > 0) {
    return (
      <QuizQuestion
        question={quiz.question}
        mod={mod}
        moduleIndex={moduleIndex}
        currentQuestion={quiz.currentQuestion}
        totalQuestions={quiz.totalQuestions}
        selectedOption={quiz.selectedOption}
        isReviewMode={isReviewMode}
        isSubmitting={quiz.isSubmitting}
        isResetting={quiz.isResetting}
        onSelectOption={quiz.handleSelectOption}
        onNext={quiz.handleNext}
        onDevReset={quiz.handleDevReset}
        backLabel={backLabel}
        onBack={onBack}
      />
    );
  }

  // ── Loading: quiz content fetching ────────────────────

  if (quiz.isLoadingContent) {
    return <QuizLoadingShell onBack={onBack} backLabel={backLabel} />;
  }

  // ── Pre-quiz / generate ───────────────────────────────

  return (
    <QuizLanding
      mod={mod}
      moduleIndex={moduleIndex}
      totalQuestions={quiz.totalQuestions}
      quizProgress={quiz.quizProgress ?? undefined}
      isReviewMode={isReviewMode}
      isGenerating={quiz.isGenerating}
      hasQuizContent={!!quiz.quizContent && !quiz.quizStarted}
      onStart={() => {
        analytics.track('module_quiz_started', {
          course_id: course?._id,
          module_index: moduleIndex,
          is_retake: (quiz.quizProgress?.attempts?.length ?? 0) > 0,
        });
        quiz.setQuizStarted(true);
      }}
      onGenerate={quiz.handleGenerate}
      backLabel={backLabel}
      onBack={onBack}
    />
  );
};

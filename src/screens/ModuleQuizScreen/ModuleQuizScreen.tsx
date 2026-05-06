'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useCourse } from '@/hooks';
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
      onStart={() => quiz.setQuizStarted(true)}
      onGenerate={quiz.handleGenerate}
      backLabel={backLabel}
      onBack={onBack}
    />
  );
};

'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { TextLoader } from '@/components';
import { useCourse } from '@/hooks';
import { useQuizState, QuizResults, QuizQuestion, QuizLanding } from './internal';
import * as S from './ModuleQuizScreen.styles';

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

  const quiz = useQuizState(courseSlug, moduleIndex);

  const mod = course?.structure?.modules?.[moduleIndex];
  const modules = course?.structure?.modules ?? [];

  // ── Detect active quiz job on mount (navigate-back case) ──
  useEffect(() => {
    if (course?.activeJobId) {
      quiz.detectActiveJob(course.activeJobId);
    }
  }, [course?.activeJobId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ───────────────────────────────────────────

  if (!course || !mod) {
    return (
      <S.Container>
        <S.Content>
          <TextLoader />
        </S.Content>
      </S.Container>
    );
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
        onBackToCourses={() => router.push('/')}
        onBackToReviews={() => router.push('/quizzes')}
        onDevReset={quiz.handleDevReset}
        hasNextModule={moduleIndex < modules.length - 1}
      />
    );
  }

  // ── Taking quiz (one question at a time) ──────────────

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
      />
    );
  }

  // ── Loading quiz content ───────────────────────────────

  if (quiz.isLoadingContent) {
    return (
      <S.Container>
        <S.Content>
          <TextLoader />
        </S.Content>
      </S.Container>
    );
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
    />
  );
};

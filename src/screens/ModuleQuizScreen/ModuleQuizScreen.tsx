'use client';

import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getJobStatus } from '@/api/routes/course';
import type { ModuleQuizQuestion, QuizAttemptResult } from '@/api/types';
import { TOASTS } from '@/constants/toasts';
import { DEV_MODE } from '@/conf/env';
import {
  useCourse,
  useJobManager,
  useModuleQuizContent,
  useModuleQuizProgress,
  useGenerateModuleQuiz,
  useSubmitQuizAttempt,
  useResetModuleQuiz,
} from '@/hooks';
import { celebrateModuleComplete } from '@/lib/celebrations';
import * as S from './ModuleQuizScreen.styles';

const LETTERS = ['A', 'B', 'C', 'D'];

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export const ModuleQuizScreen = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true';

  const courseId = params.id as string;
  const moduleIndex = Number(params.moduleIndex);

  const { data: course } = useCourse(courseId);
  const { data: quizContent, refetch: refetchQuiz } = useModuleQuizContent(courseId, moduleIndex);
  const { data: quizProgress } = useModuleQuizProgress(courseId, moduleIndex);
  const generateQuiz = useGenerateModuleQuiz();
  const submitAttempt = useSubmitQuizAttempt();
  const { trackJob, isJobRunningForCourse } = useJobManager();
  const resetQuiz = useResetModuleQuiz();

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [responses, setResponses] = useState<{ questionId: string; selectedOption: number }[]>([]);
  const [results, setResults] = useState<QuizAttemptResult | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const isGeneratingRef = useRef(false);

  const mod = course?.structure?.modules?.[moduleIndex];
  const questions: ModuleQuizQuestion[] = quizContent?.questions ?? [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  // ── Detect active quiz job on mount (navigate-back case) ──

  useEffect(() => {
    if (!course?.activeJobId || isGeneratingRef.current) return;

    const checkActiveJob = async () => {
      try {
        const job = await getJobStatus(course.activeJobId!);
        if (
          job.type === 'generate_module_quiz' &&
          job.metadata?.moduleIndex === moduleIndex &&
          (job.status === 'pending' || job.status === 'processing')
        ) {
          isGeneratingRef.current = true;
          setIsGenerating(true);
          trackJob({
            jobId: course.activeJobId!,
            courseId,
            type: 'generate_module_quiz',
            onComplete: () => {
              isGeneratingRef.current = false;
              refetchQuiz();
              setIsGenerating(false);
              setQuizStarted(true);
            },
          });
        }
      } catch {
        // Job not found or already completed — ignore
      }
    };

    checkActiveJob();
  }, [course?.activeJobId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset generating state when no job is running (handles failure case via JobManager).
  // Also guard against the brief window during mutateAsync where trackJob hasn't been called yet.
  const isJobRunning = isJobRunningForCourse(courseId);
  useEffect(() => {
    if (isGenerating && !isJobRunning && !generateQuiz.isPending) {
      isGeneratingRef.current = false;
      setIsGenerating(false); // eslint-disable-line react-hooks/set-state-in-effect -- sync with external job state
    }
  }, [isGenerating, isJobRunning, generateQuiz.isPending]);

  // ── Generate quiz ─────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    isGeneratingRef.current = true;
    try {
      const { jobId } = await generateQuiz.mutateAsync({ courseId, moduleIndex });

      trackJob({
        jobId,
        courseId,
        type: 'generate_module_quiz',
        onComplete: () => {
          isGeneratingRef.current = false;
          refetchQuiz();
          setIsGenerating(false);
          setQuizStarted(true);
        },
      });
    } catch {
      isGeneratingRef.current = false;
      setIsGenerating(false);
      toast.error(TOASTS.QUIZ_START_ERROR);
    }
  }, [courseId, moduleIndex, generateQuiz, refetchQuiz, trackJob]);

  // ── Answer handling ───────────────────────────────────

  const handleSelectOption = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;

    const updatedResponses = [...responses, { questionId: question.id, selectedOption }];
    setResponses(updatedResponses);
    setAnswered(true);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      try {
        const result = await submitAttempt.mutateAsync({
          courseId,
          moduleIndex,
          responses: updatedResponses,
        });
        setResults(result);

        if (result.masteryTier === 'mastered') {
          celebrateModuleComplete();
          toast.success(TOASTS.MODULE_MASTERED);
        }
      } catch {
        toast.error(TOASTS.QUIZ_SUBMIT_ERROR);
      }
    }
  };

  // ── Retake ────────────────────────────────────────────

  const handleRetake = () => {
    setResults(null);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswered(false);
    setResponses([]);
    setQuizStarted(false);
    handleGenerate();
  };

  // ── Dev: reset quiz ───────────────────────────────────

  const handleDevReset = useCallback(async () => {
    try {
      await resetQuiz.mutateAsync({ courseId, moduleIndex });
      setResults(null);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswered(false);
      setResponses([]);
      setQuizStarted(false);
      toast.success('Quiz reset (dev)');
    } catch {
      toast.error('Failed to reset quiz');
    }
  }, [courseId, moduleIndex, resetQuiz]);

  // ── Loading ───────────────────────────────────────────

  if (!course || !mod) {
    return (
      <S.Container>
        <S.Content>
          <S.LoadingContainer>Loading...</S.LoadingContainer>
        </S.Content>
      </S.Container>
    );
  }

  // ── Results view ──────────────────────────────────────

  if (results) {
    const modules = course.structure?.modules ?? [];
    const hasNextModule = moduleIndex < modules.length - 1;

    return (
      <S.Container>
        <S.Content>
          <S.TopBar>
            <S.BackLink onClick={() => router.push(`/course/${courseId}/lesson/${moduleIndex}/0`)}>
              <ArrowLeft size={14} /> Back to course
            </S.BackLink>
            {DEV_MODE && (
              <S.DevResetButton onClick={handleDevReset} disabled={resetQuiz.isPending}>
                <Trash2 size={10} /> Reset Quiz
              </S.DevResetButton>
            )}
          </S.TopBar>

          <S.ResultsHeader>
            <S.Eyebrow>{isReviewMode ? 'Review Results' : 'Quiz Results'}</S.Eyebrow>
            <S.Title>{mod.name}</S.Title>
            <S.ScoreDisplay>{results.score}%</S.ScoreDisplay>
            <S.MasteryBadge $tier={results.masteryTier}>
              {results.masteryTier === 'mastered'
                ? 'Mastered'
                : results.masteryTier === 'passed'
                  ? 'Passed'
                  : 'Needs Review'}
            </S.MasteryBadge>
            {results.reviewIntervalDays > 0 && (
              <S.NextReviewInfo>
                Next review in {results.reviewIntervalDays} day
                {results.reviewIntervalDays !== 1 ? 's' : ''} or sooner as you progress
              </S.NextReviewInfo>
            )}
          </S.ResultsHeader>

          <S.ResultsList>
            {results.questions.map((q, i) => (
              <S.ResultItem key={q.id} $correct={q.correct}>
                <S.ResultItemHeader $correct={q.correct}>
                  <S.ResultIndicator $correct={q.correct}>
                    {q.correct ? '\u2713' : '\u2717'}
                  </S.ResultIndicator>
                  <span>
                    Q{i + 1}: {q.question}
                  </span>
                </S.ResultItemHeader>
                <S.ResultExplanation>
                  <strong>Correct: {LETTERS[q.correctIndex]}</strong> — {q.explanation}
                  {q.sourceLessons.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {q.sourceLessons.map((li) => (
                        <S.SourceTag
                          key={li}
                          as="a"
                          onClick={() =>
                            router.push(`/course/${courseId}/lesson/${moduleIndex}/${li}`)
                          }
                          style={{ cursor: 'pointer', marginRight: '0.375rem' }}
                        >
                          Lesson {li + 1}: {mod.lessons?.[li]?.name}
                        </S.SourceTag>
                      ))}
                    </div>
                  )}
                </S.ResultExplanation>
              </S.ResultItem>
            ))}
          </S.ResultsList>

          <S.ActionButtons>
            <S.SecondaryButton onClick={handleRetake} disabled={isGenerating}>
              Retake Quiz
            </S.SecondaryButton>
            {hasNextModule && (
              <S.StartButton
                onClick={() => router.push(`/course/${courseId}/lesson/${moduleIndex + 1}/0`)}
              >
                Continue to Next Module <ArrowRight size={14} />
              </S.StartButton>
            )}
            {!hasNextModule && (
              <S.StartButton onClick={() => router.push('/')}>
                Back to Courses
              </S.StartButton>
            )}
          </S.ActionButtons>
        </S.Content>
      </S.Container>
    );
  }

  // ── Taking quiz (one question at a time) ──────────────

  if (quizStarted && questions.length > 0) {
    const getOptionState = (index: number): OptionState => {
      if (index === selectedOption) return 'selected';
      return 'default';
    };

    return (
      <S.Container>
        <S.Content>
          <S.TopBar>
            <S.BackLink onClick={() => router.push(`/course/${courseId}/lesson/${moduleIndex}/0`)}>
              <ArrowLeft size={14} /> Back to course
            </S.BackLink>
            {DEV_MODE && (
              <S.DevResetButton onClick={handleDevReset} disabled={resetQuiz.isPending}>
                <Trash2 size={10} /> Reset Quiz
              </S.DevResetButton>
            )}
          </S.TopBar>

          <S.HeaderSection>
            <S.Eyebrow>
              {isReviewMode ? 'Spaced Review' : `Module ${moduleIndex + 1} Quiz`}
            </S.Eyebrow>
            <S.Title>{mod.name}</S.Title>
          </S.HeaderSection>

          <S.ProgressBarContainer>
            <S.ProgressBarTrack>
              <S.ProgressBarFill $percent={((currentQuestion + 1) / totalQuestions) * 100} />
            </S.ProgressBarTrack>
            <S.ProgressText>
              {currentQuestion + 1} / {totalQuestions}
            </S.ProgressText>
          </S.ProgressBarContainer>

          <S.QuestionCard>
            <S.QuestionText>{question.question}</S.QuestionText>
            <S.OptionsContainer>
              {question.options.map((opt, i) => (
                <S.Option key={i} $state={getOptionState(i)} onClick={() => handleSelectOption(i)}>
                  <S.OptionLetter $state={getOptionState(i)}>{LETTERS[i]}</S.OptionLetter>
                  {opt}
                </S.Option>
              ))}
            </S.OptionsContainer>
            {question.isInterleaved && (
              <S.Explanation>
                <S.SourceTag>
                  Review question from Module {(question.interleavedModuleIndex ?? 0) + 1}
                </S.SourceTag>
              </S.Explanation>
            )}
          </S.QuestionCard>

          {selectedOption !== null && (
            <S.NextButton onClick={handleNext} disabled={submitAttempt.isPending}>
              {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}{' '}
              <ArrowRight size={14} />
            </S.NextButton>
          )}
        </S.Content>
      </S.Container>
    );
  }

  // ── Pre-quiz / generate ───────────────────────────────

  return (
    <S.Container>
      <S.Content>
        <S.TopBar>
          <S.BackLink onClick={() => router.push(`/course/${courseId}/lesson/${moduleIndex}/0`)}>
            <ArrowLeft size={14} /> Back to course
          </S.BackLink>
        </S.TopBar>

        <S.HeaderSection>
          <S.Eyebrow>
            {isReviewMode ? 'Spaced Review' : `Module ${moduleIndex + 1} Quiz`}
          </S.Eyebrow>
          <S.Title>{mod.name}</S.Title>
        </S.HeaderSection>

        {quizProgress && quizProgress.bestTier && (
          <S.PreviousAttempt>
            <span>Previous best:</span>
            <S.MasteryBadge $tier={quizProgress.bestTier}>
              {quizProgress.bestScore}% —{' '}
              {quizProgress.bestTier === 'mastered'
                ? 'Mastered'
                : quizProgress.bestTier === 'passed'
                  ? 'Passed'
                  : 'Needs Review'}
            </S.MasteryBadge>
            <span style={{ color: 'inherit', opacity: 0.5 }}>
              ({quizProgress.attempts.length} attempt
              {quizProgress.attempts.length !== 1 ? 's' : ''})
            </span>
          </S.PreviousAttempt>
        )}

        {isGenerating ? (
          <S.LoadingContainer>
            <S.Spinner />
            <span>Creating quiz questions...</span>
          </S.LoadingContainer>
        ) : quizContent && !quizStarted ? (
          <>
            <S.DescriptionText>
              {totalQuestions} questions testing your understanding across all lessons in this
              module.
            </S.DescriptionText>
            <S.StartButton onClick={() => setQuizStarted(true)}>
              {quizProgress ? 'Retake Quiz' : 'Start Quiz'}
            </S.StartButton>
          </>
        ) : (
          <>
            <S.DescriptionText>
              Test your understanding across all {mod.lessons?.length ?? 0} lessons in this module.
            </S.DescriptionText>
            <S.StartButton onClick={handleGenerate} disabled={isGenerating}>
              {quizProgress ? 'Create New Quiz' : 'Start Quiz'}
            </S.StartButton>
          </>
        )}
      </S.Content>
    </S.Container>
  );
};

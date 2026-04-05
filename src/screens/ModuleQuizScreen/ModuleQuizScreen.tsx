'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useCourse,
  useModuleQuizContent,
  useModuleQuizProgress,
  useGenerateModuleQuiz,
  useSubmitQuizAttempt,
} from '@/hooks';
import { getJobStatus, ModuleQuizQuestion, QuizAttemptResult } from '@/api/routes/course';
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [responses, setResponses] = useState<{ questionId: string; selectedOption: number }[]>([]);
  const [results, setResults] = useState<QuizAttemptResult | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mod = course?.structure?.modules?.[moduleIndex];
  const questions: ModuleQuizQuestion[] = quizContent?.questions ?? [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Generate quiz ─────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setIsGenerating(true);
    try {
      const { jobId } = await generateQuiz.mutateAsync({ courseId, moduleIndex });

      // Poll job status
      pollRef.current = setInterval(async () => {
        try {
          const job = await getJobStatus(jobId);
          if (job.status === 'completed') {
            if (pollRef.current) clearInterval(pollRef.current);
            await refetchQuiz();
            setIsGenerating(false);
            setQuizStarted(true);
          } else if (job.status === 'failed') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsGenerating(false);
            toast.error('Quiz generation failed. Please try again.');
          }
        } catch {
          // ignore polling errors
        }
      }, 2000);
    } catch {
      setIsGenerating(false);
      toast.error('Failed to start quiz generation');
    }
  }, [courseId, moduleIndex, generateQuiz, refetchQuiz]);

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
      // Submit all responses
      try {
        const result = await submitAttempt.mutateAsync({
          courseId,
          moduleIndex,
          responses: updatedResponses,
        });
        setResults(result);

        if (result.masteryTier === 'mastered') {
          celebrateModuleComplete();
          toast.success('Module mastered!');
        }
      } catch {
        toast.error('Failed to submit quiz');
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
          <S.BackLink onClick={() => router.push(`/course/${courseId}`)}>
            &larr; Back to course
          </S.BackLink>

          <S.ResultsHeader>
            <S.Title>{isReviewMode ? 'Review Results' : 'Module Quiz Results'}</S.Title>
            <S.Subtitle>{mod.name}</S.Subtitle>
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
                Next review in {results.reviewIntervalDays} day{results.reviewIntervalDays !== 1 ? 's' : ''} or sooner as you progress
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
                  <span>Q{i + 1}: {q.question}</span>
                </S.ResultItemHeader>
                <S.ResultExplanation>
                  <strong>Correct: {LETTERS[q.correctIndex]}</strong> — {q.explanation}
                  {q.sourceLessons.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {q.sourceLessons.map((li) => (
                        <S.SourceTag
                          key={li}
                          as="a"
                          onClick={() => router.push(`/course/${courseId}/lesson/${moduleIndex}/${li}`)}
                          style={{ cursor: 'pointer', marginRight: '0.25rem' }}
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
                Continue to Next Module &rarr;
              </S.StartButton>
            )}
            {!hasNextModule && (
              <S.StartButton onClick={() => router.push(`/course/${courseId}`)}>
                Back to Course
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
          <S.BackLink onClick={() => router.push(`/course/${courseId}`)}>
            &larr; Back to course
          </S.BackLink>
          <S.Title>{isReviewMode ? `Module ${moduleIndex + 1} Review` : `Module ${moduleIndex + 1} Quiz`}</S.Title>
          <S.Subtitle>{isReviewMode ? `Spaced review \u2014 ${mod.name}` : mod.name}</S.Subtitle>

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
                <S.Option
                  key={i}
                  $state={getOptionState(i)}
                  onClick={() => handleSelectOption(i)}
                  >
                  <S.OptionLetter $state={getOptionState(i)}>
                    {LETTERS[i]}
                  </S.OptionLetter>
                  {opt}
                </S.Option>
              ))}
            </S.OptionsContainer>
            {question.isInterleaved && (
              <S.Explanation>
                <S.SourceTag>Review question from Module {(question.interleavedModuleIndex ?? 0) + 1}</S.SourceTag>
              </S.Explanation>
            )}
          </S.QuestionCard>

          {selectedOption !== null && (
            <S.NextButton onClick={handleNext} disabled={submitAttempt.isPending}>
              {currentQuestion < totalQuestions - 1 ? 'Next Question \u2192' : 'See Results'}
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
        <S.BackLink onClick={() => router.push(`/course/${courseId}`)}>
          &larr; Back to course
        </S.BackLink>
        <S.Title>{isReviewMode ? `Module ${moduleIndex + 1} Review` : `Module ${moduleIndex + 1} Quiz`}</S.Title>
        <S.Subtitle>{isReviewMode ? `Spaced review \u2014 ${mod.name}` : mod.name}</S.Subtitle>

        {quizProgress && quizProgress.bestTier && (
          <S.PreviousAttempt>
            <span>Previous best:</span>
            <S.MasteryBadge $tier={quizProgress.bestTier}>
              {quizProgress.bestScore}% — {quizProgress.bestTier === 'mastered'
                ? 'Mastered'
                : quizProgress.bestTier === 'passed'
                  ? 'Passed'
                  : 'Needs Review'}
            </S.MasteryBadge>
            <span style={{ color: 'inherit', opacity: 0.5 }}>
              ({quizProgress.attempts.length} attempt{quizProgress.attempts.length !== 1 ? 's' : ''})
            </span>
          </S.PreviousAttempt>
        )}

        {isGenerating ? (
          <S.LoadingContainer>
            <S.Spinner />
            <span>Generating quiz questions...</span>
          </S.LoadingContainer>
        ) : quizContent && !quizStarted ? (
          <>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
              {totalQuestions} questions testing your understanding across all lessons in this module.
            </p>
            <S.StartButton onClick={() => setQuizStarted(true)}>
              {quizProgress ? 'Retake Quiz' : 'Start Quiz'}
            </S.StartButton>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
              Test your understanding across all {mod.lessons?.length ?? 0} lessons in this module.
            </p>
            <S.StartButton onClick={handleGenerate} disabled={isGenerating}>
              {quizProgress ? 'Generate New Quiz' : 'Start Quiz'}
            </S.StartButton>
          </>
        )}
      </S.Content>
    </S.Container>
  );
};

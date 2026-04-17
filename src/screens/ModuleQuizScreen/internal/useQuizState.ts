import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getJobStatus } from '@/api/routes/course';
import { TOASTS } from '@/constants/toasts';
import {
  useGenerateModuleQuiz,
  useJobManager,
  useModuleQuizContent,
  useModuleQuizProgress,
  useResetModuleQuiz,
  useSubmitQuizAttempt,
} from '@/hooks';
import { celebrateModuleComplete } from '@/lib/celebrations';
import type { ModuleQuizQuestion, QuizAttemptResult } from '@/api/types';

export const useQuizState = (courseSlug: string, moduleIndex: number) => {
  const { data: quizContent, refetch: refetchQuiz, isLoading: isLoadingContent } = useModuleQuizContent(courseSlug, moduleIndex);
  const { data: quizProgress, isLoading: isLoadingProgress } = useModuleQuizProgress(courseSlug, moduleIndex);
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

  const questions: ModuleQuizQuestion[] = quizContent?.questions ?? [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  // ── Detect active quiz job on mount (navigate-back case) ──

  const detectActiveJob = useCallback(
    (activeJobId: string) => {
      if (isGeneratingRef.current) return;

      const checkActiveJob = async () => {
        try {
          const job = await getJobStatus(activeJobId);
          if (
            job.type === 'generate_module_quiz' &&
            job.metadata?.moduleIndex === moduleIndex &&
            (job.status === 'pending' || job.status === 'processing')
          ) {
            isGeneratingRef.current = true;
            setIsGenerating(true);
            trackJob({
              jobId: activeJobId,
              courseId: courseSlug,
              type: 'generate_module_quiz',
              onComplete: async () => {
                await refetchQuiz();
                isGeneratingRef.current = false;
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
    },
    [courseSlug, moduleIndex, refetchQuiz, trackJob],
  );

  // Reset generating state when no job is running (handles failure case via JobManager).
  const isJobRunning = isJobRunningForCourse(courseSlug);
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
      const { jobId } = await generateQuiz.mutateAsync({ courseId: courseSlug, moduleIndex });

      trackJob({
        jobId,
        courseId: courseSlug,
        type: 'generate_module_quiz',
        onComplete: async () => {
          await refetchQuiz();
          isGeneratingRef.current = false;
          setIsGenerating(false);
          setQuizStarted(true);
        },
      });
    } catch {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  }, [courseSlug, moduleIndex, generateQuiz, refetchQuiz, trackJob]);

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
          courseId: courseSlug,
          moduleIndex,
          responses: updatedResponses,
        });
        setResults(result);

        if (result.masteryTier === 'mastered') {
          celebrateModuleComplete();
          toast.success(TOASTS.MODULE_MASTERED);
        }
      } catch {
        // Global mutation error handler toasts QUIZ_SUBMIT_ERROR
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
    setQuizStarted(true);
  };

  // ── Dev: reset quiz ───────────────────────────────────

  const handleDevReset = useCallback(async () => {
    try {
      await resetQuiz.mutateAsync({ courseId: courseSlug, moduleIndex });
      setResults(null);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswered(false);
      setResponses([]);
      setQuizStarted(false);
      toast('Quiz reset (dev)');
    } catch {
      // Global mutation error handler toasts the failure
    }
  }, [courseSlug, moduleIndex, resetQuiz]);

  return {
    quizContent,
    quizProgress,
    questions,
    totalQuestions,
    question,
    currentQuestion,
    selectedOption,
    results,
    quizStarted,
    isGenerating,
    isSubmitting: submitAttempt.isPending,
    isLoadingContent: isLoadingContent || isLoadingProgress,
    isResetting: resetQuiz.isPending,
    detectActiveJob,
    handleGenerate,
    handleSelectOption,
    handleNext,
    handleRetake,
    handleDevReset,
    setQuizStarted,
  };
};

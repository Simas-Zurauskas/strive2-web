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

export const useQuizState = ({ courseSlug, moduleIndex }: { courseSlug: string; moduleIndex: number }) => {
  const { data: quizContent, refetch: refetchQuiz, isLoading: isLoadingContent } = useModuleQuizContent({ courseId: courseSlug, moduleIndex });
  const { data: quizProgress, isLoading: isLoadingProgress } = useModuleQuizProgress({ courseId: courseSlug, moduleIndex });
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
  // Snapshot of `quizContent` at the moment a generation cycle begins. The
  // belt-and-braces effect below uses reference inequality against this
  // snapshot to know whether the cache holds *fresh* questions vs. stale
  // ones from a prior attempt — important on the "Create new quiz" path
  // where the previous attempt's content is still in cache.
  const generationStartContentRef = useRef<typeof quizContent | null>(null);
  // Live mirror of `quizContent` so the callbacks below can read its
  // current value at click-time without listing it in their dep arrays.
  // Putting `quizContent` in deps would re-create the callback on every
  // cache refresh and prevent React Compiler from preserving manual
  // memoization. The effect-write pattern keeps deps stable; we don't
  // write during render because that would trip the no-refs-in-render
  // rule (and cause stale reads in concurrent renders).
  const quizContentRef = useRef(quizContent);
  useEffect(() => {
    quizContentRef.current = quizContent;
  }, [quizContent]);

  // The trackJob registration outlives this hook because JobManager is
  // a global singleton — the `onComplete` callback can fire after the
  // user navigates away from the quiz screen. Use a mounted-ref guard
  // to skip setState calls in that window. (The ref-only writes are
  // safe to keep — they don't trigger renders.)
  const isMountedRef = useRef(true);
  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

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
            generationStartContentRef.current = quizContentRef.current;
            isGeneratingRef.current = true;
            setIsGenerating(true);
            trackJob({
              jobId: activeJobId,
              courseId: courseSlug,
              type: 'generate_module_quiz',
              onComplete: async () => {
                await refetchQuiz();
                isGeneratingRef.current = false;
                if (!isMountedRef.current) return;
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync UI state with external job-runner state when no job is active
      setIsGenerating(false);
    }
  }, [isGenerating, isJobRunning, generateQuiz.isPending]);

  // Belt-and-braces: if FRESH quiz content lands in the react-query cache
  // while we're still in the generating state (the trackJob `onComplete`
  // callback can be missed if the socket disconnects right at completion —
  // the user would otherwise be stuck on the generation panel until they
  // reload), force the UI to transition. JobManager invalidates
  // MODULE_QUIZ_CONTENT on `generate_module_quiz` completion, so a fresh
  // fetch is guaranteed regardless of which tab/socket saw the event.
  //
  // The ref-comparison is what distinguishes "fresh content arrived" from
  // "stale content from a prior attempt is still in cache" — without it
  // this effect would fire immediately on the "Create new quiz" path
  // (because `quizContent` already has the previous attempt's questions).
  useEffect(() => {
    if (!isGenerating) return;
    if (totalQuestions === 0) return;
    if (quizContent === generationStartContentRef.current) return;
    isGeneratingRef.current = false;
    generationStartContentRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- recover from missed socket completion event; ref guards above prevent loops
    setIsGenerating(false);
    setQuizStarted(true);
  }, [isGenerating, totalQuestions, quizContent]);

  // ── Generate quiz ─────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    // Snapshot whatever's in the cache now — the belt-and-braces effect
    // uses this to detect when fresh content arrives. If we're regenerating
    // over an existing quiz, the previous attempt's questions are in
    // `quizContent` until JobManager invalidates the cache on completion.
    generationStartContentRef.current = quizContentRef.current;
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
          if (!isMountedRef.current) return;
          setIsGenerating(false);
          setQuizStarted(true);
        },
      });
    } catch {
      isGeneratingRef.current = false;
      if (!isMountedRef.current) return;
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

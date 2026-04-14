import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { TOASTS } from '@/constants/toasts';
import { useJobManager } from '@/hooks/useJobManager';
import { QKeys } from '@/types';
import type { useWizardMutations } from './useWizardMutations';
import type { Course, CourseDepth, DepthPreviewsResponse } from '@/api/types';

type Step = 1 | 2 | 3 | 4;

interface UseWizardHandlersParams {
  courseId: string | null;
  setCourseId: (id: string) => void;
  step: Step;
  setStep: (s: Step) => void;
  goal: string;
  setGoal: (g: string) => void;
  generatedForGoal: string;
  setGeneratedForGoal: (g: string) => void;
  answers: Record<string, string | string[]>;
  setAnswers: (a: Record<string, string | string[]>) => void;
  depth: CourseDepth | null;
  setDepth: (d: CourseDepth | null) => void;
  course: Course | undefined;
  mutations: ReturnType<typeof useWizardMutations>;
  confirmOverwrite: (message: string, action: () => void, title?: string, confirmLabel?: string) => void;
}

export const useWizardHandlers = ({
  courseId,
  setCourseId,
  setStep,
  setGoal,
  setGeneratedForGoal,
  answers,
  setAnswers,
  depth,
  setDepth,
  course,
  mutations,
  confirmOverwrite,
}: UseWizardHandlersParams) => {
  const router = useRouter();
  const { trackJob, isJobRunningForCourse } = useJobManager();
  const isStepDirtyRef = useRef(false);

  const {
    createCourseMutation,
    clarifyMutation,
    updateCourseMutation,
    structureMutation,
    depthPreviewsMutation,
    deleteMutation,
    queryClient,
  } = mutations;

  const clarifyData = course?.clarifyData ?? null;
  const depthPreviews = (course?.depthPreviews as DepthPreviewsResponse) ?? null;
  const structureData = course?.structure?.modules ?? null;
  const isJobRunning = courseId ? isJobRunningForCourse(courseId) : false;

  const handleDirtyChange = useCallback((isDirty: boolean) => {
    isStepDirtyRef.current = isDirty;
  }, []);

  // ── Goal ──────────────────────────────────────────────

  const executeGoalSubmit = useCallback(
    (goalValue: string) => {
      setAnswers({} as Record<string, string | string[]>);
      setDepth(null);
      setGoal(goalValue);

      if (courseId) {
        queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
          old
            ? {
                ...old,
                clarifyData: undefined,
                depthPreviews: undefined,
                structure: undefined,
                depth: undefined,
                answers: undefined,
              }
            : old,
        );
      }

      const startClarify = (targetCourseId: string) => {
        clarifyMutation.mutate(targetCourseId, {
          onSuccess: (clarifyResult) => {
            trackJob({
              jobId: clarifyResult.jobId,
              courseId: targetCourseId,
              type: 'clarify',
              onComplete: () => {
                setGeneratedForGoal(goalValue);
              },
            });
            setStep(2);
          },
        });
      };

      if (courseId) {
        updateCourseMutation.mutate(
          { id: courseId, data: { goal: goalValue, answers: {}, status: 'creating' } },
          { onSuccess: () => startClarify(courseId) },
        );
      } else {
        createCourseMutation.mutate(
          { goal: goalValue },
          {
            onSuccess: (data) => {
              setCourseId(data.courseId);
              startClarify(data.courseId);
            },
          },
        );
      }
    },
    [createCourseMutation, clarifyMutation, trackJob, courseId, updateCourseMutation, queryClient, setCourseId, setGoal, setGeneratedForGoal, setAnswers, setDepth, setStep],
  );

  const handleGoalSubmit = useCallback(
    (goalValue: string) => {
      if (goalValue === course?.goal && clarifyData) {
        setStep(2);
        return;
      }

      const hasDownstream = !!(clarifyData || depthPreviews || structureData);
      if (hasDownstream) {
        confirmOverwrite('Changing the goal will regenerate your questions and clear all later steps.', () =>
          executeGoalSubmit(goalValue),
        );
        return;
      }

      executeGoalSubmit(goalValue);
    },
    [course, clarifyData, depthPreviews, structureData, executeGoalSubmit, confirmOverwrite, setStep],
  );

  // ── Clarify ───────────────────────────────────────────

  const executeClarifySubmit = useCallback(
    (answersValue: Record<string, string | string[]>) => {
      if (!courseId) return;
      setAnswers(answersValue);
      setDepth(null);

      queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
        old ? { ...old, depthPreviews: undefined, structure: undefined } : old,
      );

      updateCourseMutation.mutate(
        { id: courseId, data: { answers: answersValue as Record<string, never> } },
        {
          onSuccess: () => {
            setStep(3);
            depthPreviewsMutation.mutate(courseId, {
              onSuccess: (data) => {
                trackJob({
                  jobId: data.jobId,
                  courseId,
                  type: 'generate_depth_previews',
                });
              },
            });
          },
        },
      );
    },
    [courseId, queryClient, updateCourseMutation, depthPreviewsMutation, trackJob, setAnswers, setDepth, setStep],
  );

  const handleClarifySubmit = useCallback(
    (answersValue: Record<string, string | string[]>) => {
      const answersUnchanged = course?.answers && JSON.stringify(answersValue) === JSON.stringify(course.answers);

      if (answersUnchanged && depthPreviews) {
        setStep(3);
        return;
      }

      const hasDownstream = !!(depthPreviews || structureData);
      if (hasDownstream) {
        confirmOverwrite('Changing your answers will regenerate depth options and clear the course structure.', () =>
          executeClarifySubmit(answersValue),
        );
        return;
      }
      executeClarifySubmit(answersValue);
    },
    [course, depthPreviews, structureData, executeClarifySubmit, confirmOverwrite, setStep],
  );

  // ── Depth & Structure ─────────────────────────────────

  const triggerStructureGeneration = useCallback(() => {
    if (!courseId) return;

    structureMutation.mutate(courseId, {
      onSuccess: (data) => {
        trackJob({
          jobId: data.jobId,
          courseId,
          type: 'generate_structure',
        });
        setStep(4);
      },
    });
  }, [courseId, structureMutation, trackJob, setStep]);

  const executeDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (!courseId) return;
      setDepth(depthValue);

      updateCourseMutation.mutate(
        { id: courseId, data: { depth: depthValue } },
        { onSuccess: () => triggerStructureGeneration() },
      );
    },
    [courseId, updateCourseMutation, triggerStructureGeneration, setDepth],
  );

  const handleDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (depthValue === course?.depth && structureData) {
        setStep(4);
        return;
      }

      if (structureData) {
        confirmOverwrite('Changing the depth will regenerate the course structure.', () =>
          executeDepthConfirm(depthValue),
        );
        return;
      }
      executeDepthConfirm(depthValue);
    },
    [course, structureData, executeDepthConfirm, confirmOverwrite, setStep],
  );

  const handleStructureModified = useCallback(() => {
    if (!courseId) return;
    queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
  }, [courseId, queryClient]);

  // ── Accept & Delete ───────────────────────────────────

  const handleAccept = useCallback(() => {
    if (!courseId) return;

    updateCourseMutation.mutate(
      { id: courseId, data: { status: 'ready' } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
          toast.success(TOASTS.COURSE_READY);
          router.push(`/course/${course?.slug ?? courseId}`);
        },
      },
    );
  }, [courseId, updateCourseMutation, queryClient, router, course]);

  // ── Navigation ────────────────────────────────────────

  const navigateToStep = useCallback(
    (targetStep: number) => {
      if (targetStep === 2 && course?.answers && Object.keys(answers).length === 0) {
        setAnswers(course.answers as Record<string, string | string[]>);
      }
      if (targetStep === 3 && course?.depth && !depth) {
        setDepth(course.depth as CourseDepth);
      }
      isStepDirtyRef.current = false;
      setStep(targetStep as Step);
    },
    [course, answers, depth, setAnswers, setDepth, setStep],
  );

  const handleStepClick = useCallback(
    (targetStep: number, navigableSteps: number[]) => {
      if (isJobRunning) return;
      if (!navigableSteps.includes(targetStep)) return;

      if (isStepDirtyRef.current) {
        confirmOverwrite(
          'You have unsaved changes that will be discarded.',
          () => navigateToStep(targetStep),
          'Discard changes?',
          'Discard',
        );
        return;
      }

      navigateToStep(targetStep);
    },
    [isJobRunning, navigateToStep, confirmOverwrite],
  );

  return {
    clarifyData,
    depthPreviews,
    structureData,
    isJobRunning,
    handleDirtyChange,
    handleGoalSubmit,
    handleClarifySubmit,
    handleDepthConfirm,
    handleStructureModified,
    handleAccept,
    handleStepClick,
    deleteMutation,
    depthPreviewsMutation,
    createCourseMutation,
    clarifyMutation,
    updateCourseMutation,
    structureMutation,
    trackJob,
  };
};

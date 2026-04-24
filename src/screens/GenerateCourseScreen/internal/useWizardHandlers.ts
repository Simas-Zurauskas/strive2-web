import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { TOASTS } from '@/constants/toasts';
import { useJobManager } from '@/hooks/useJobManager';
import { QKeys } from '@/types';
import type { useWizardMutations } from './useWizardMutations';
import type { useDepthOverrideDialog } from './useDepthOverrideDialog';
import type { Course, CourseDepth, ClientApiError, DepthPreviewsResponse } from '@/api/types';
import type { DepthOverridePayload } from '@/components/DepthOverrideDialog';

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
  confirmOverwrite: (args: { message: string; action: () => void; title?: string; confirmLabel?: string }) => void;
  depthOverrideDialog: ReturnType<typeof useDepthOverrideDialog>;
}

/**
 * Parse a ClientApiError body to decide whether it's the depth-override
 * 409 from the backend gate. Returns the typed payload or null. Accepts
 * both `code` and `errorCode` field shapes (see Registry.tsx comment).
 */
const parseDepthOverrideError = (err: unknown): DepthOverridePayload | null => {
  const apiError = err as ClientApiError & { code?: string; [k: string]: unknown };
  if (apiError?.status !== 409) return null;
  const codeField = apiError.code ?? apiError.errorCode;
  if (codeField !== 'DEPTH_OVERRIDE_REQUIRES_ACK') return null;
  return apiError as unknown as DepthOverridePayload;
};

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
  depthOverrideDialog,
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
        confirmOverwrite({
          message: 'Changing the goal will regenerate your questions and clear all later steps.',
          action: () => executeGoalSubmit(goalValue),
        });
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
        confirmOverwrite({
          message: 'Changing your answers will regenerate depth options and clear the course structure.',
          action: () => executeClarifySubmit(answersValue),
        });
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
    (depthValue: CourseDepth, options?: { acknowledged?: boolean }) => {
      if (!courseId) return;
      const acknowledged = options?.acknowledged ?? false;
      const previousDepth = (course?.depth as CourseDepth | null) ?? null;

      setDepth(depthValue);

      // `depthOverrideAcknowledged` is a transport-only flag not yet surfaced
      // in the OpenAPI codegen types (lands with the API deploy of Fix #1
      // backend, then `yarn codegen`). Local cast until the generator picks
      // it up. The backend strips the flag before persisting.
      const data = {
        depth: depthValue,
        ...(acknowledged ? { depthOverrideAcknowledged: true } : {}),
      } as { depth: CourseDepth; depthOverrideAcknowledged?: boolean };

      updateCourseMutation.mutate(
        { id: courseId, data },
        {
          onSuccess: () => triggerStructureGeneration(),
          onError: (err) => {
            const gatePayload = parseDepthOverrideError(err);
            if (!gatePayload) return; // non-gate errors fall through to global toast

            // Revert the depth-selector UI so the user can see their old
            // selection while the dialog is open. The retry will re-set it.
            setDepth(previousDepth);
            depthOverrideDialog.showDialog(gatePayload, () => {
              executeDepthConfirm(depthValue, { acknowledged: true });
            });
          },
        },
      );
    },
    [courseId, course, updateCourseMutation, triggerStructureGeneration, setDepth, depthOverrideDialog],
  );

  const handleDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (depthValue === course?.depth && structureData) {
        setStep(4);
        return;
      }

      if (structureData) {
        confirmOverwrite({
          message: 'Changing the depth will regenerate the course structure.',
          action: () => executeDepthConfirm(depthValue),
        });
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
        confirmOverwrite({
          message: 'You have unsaved changes that will be discarded.',
          action: () => navigateToStep(targetStep),
          title: 'Discard changes?',
          confirmLabel: 'Discard',
        });
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

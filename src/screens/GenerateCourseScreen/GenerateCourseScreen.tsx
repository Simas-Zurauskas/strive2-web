'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  createCourse,
  clarifyCourse,
  generateStructure,
  generateDepthPreviews,
  updateCourse,
  deleteCourse,
} from '@/api/routes/course';
import { Course, CourseDepth, DepthPreviewsResponse } from '@/api/types';
import { Stepper, AlertDialog } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useCourse } from '@/hooks/useCourses';
import { useJobManager } from '@/hooks/useJobManager';
import { QKeys } from '@/types';
import * as S from './GenerateCourseScreen.styles';
import { GoalStep, ClarifyStep, DepthStep, StructureStep } from './internal';

type Step = 1 | 2 | 3 | 4;

const determineStepFromCourse = (course: Course | null): Step => {
  if (!course) return 1;
  if (course.structure) return 4;
  if (!course.clarifyData) return 1;
  if (course.depth || course.answers) return 3;
  return 2;
};

// Wrapper: handles loading the course for resume, then renders the wizard with initial values
export const GenerateCourseScreen = () => {
  const searchParams = useSearchParams();
  const resumeCourseId = searchParams.get('courseId');

  const { data: resumeCourse, isLoading } = useCourse(resumeCourseId);

  if (resumeCourseId && isLoading) {
    return (
      <S.Layout>
        <S.Container>
          <p style={{ textAlign: 'center', opacity: 0.6, padding: '4rem 0' }}>Loading course...</p>
        </S.Container>
      </S.Layout>
    );
  }

  return <GenerateCourseWizard key={resumeCourseId ?? 'new'} resumeCourse={resumeCourse ?? null} />;
};

// Inner wizard: receives initial values as props, no effects needed
const GenerateCourseWizard = ({ resumeCourse }: { resumeCourse: Course | null }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(() => determineStepFromCourse(resumeCourse));

  // Course identity
  const [courseId, setCourseId] = useState<string | null>(resumeCourse?._id ?? null);

  // Job manager (global — survives navigation)
  const { trackJob, isJobRunningForCourse } = useJobManager();

  // Step 1 state
  const [goal, setGoal] = useState(resumeCourse?.goal ?? '');
  const [generatedForGoal, setGeneratedForGoal] = useState(resumeCourse?.goal ?? '');

  // Step 2 state
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    (resumeCourse?.answers as Record<string, string | string[]>) ?? {},
  );

  // Step 3 state
  const [depth, setDepth] = useState<CourseDepth | null>((resumeCourse?.depth as CourseDepth) ?? null);
  // Step 4 — chat-based refinement (no local state needed)

  // Dirty tracking — detect unsaved changes when navigating via stepper
  const isStepDirtyRef = useRef(false);
  const handleDirtyChange = useCallback((isDirty: boolean) => {
    isStepDirtyRef.current = isDirty;
  }, []);

  // Overwrite confirmation — shown when a step action would regenerate downstream data
  const [overwriteDialog, setOverwriteDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const confirmOverwrite = (
    message: string,
    action: () => void,
    title = 'Regenerate later steps?',
    confirmLabel = 'Continue',
  ) => {
    setOverwriteDialog({ title, message, confirmLabel, onConfirm: action });
  };

  // ── Queries ────────────────────────────────────────────
  const courseQuery = useCourse(courseId);
  const course = courseQuery.data;

  // Derive AI results from course data
  const clarifyData = course?.clarifyData ?? null;
  const depthPreviews = (course?.depthPreviews as DepthPreviewsResponse) ?? null;
  const structureData = course?.structure?.modules ?? null;
  const courseName = course?.name || null;

  const isJobRunning = courseId ? isJobRunningForCourse(courseId) : false;

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // Update URL with courseId for resume-on-refresh
  useEffect(() => {
    if (courseId) {
      router.replace(`/generate-course?courseId=${courseId}`, { scroll: false });
    }
  }, [courseId, router]);

  // Auto-advance to step 4 when structure data arrives after generation
  // (handled via onComplete callback in triggerStructureGeneration)

  // ── Mutations ──────────────────────────────────────────
  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const createCourseMutation = useMutation({
    mutationFn: (params: { goal: string }) => createCourse(params),
    onError: () => toast.error(TOASTS.COURSE_CREATE_ERROR),
  });

  const clarifyMutation = useMutation({
    mutationFn: (id: string) => clarifyCourse(id),
    onError: () => toast.error(TOASTS.CLARIFY_ERROR),
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCourse>[1] }) => updateCourse(id, data),
    onError: () => toast.error(TOASTS.COURSE_SAVE_ERROR),
  });

  const structureMutation = useMutation({
    mutationFn: (id: string) => generateStructure(id),
    onError: () => toast.error(TOASTS.STRUCTURE_ERROR),
  });

  const depthPreviewsMutation = useMutation({
    mutationFn: (id: string) => generateDepthPreviews(id),
    onError: () => toast.error(TOASTS.DEPTH_PREVIEWS_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId!),
    onSuccess: () => {
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success(TOASTS.COURSE_DELETED);
      router.push('/');
    },
    onError: () => toast.error(TOASTS.COURSE_DELETE_ERROR),
  });

  // ── Computed ───────────────────────────────────────────
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    if (clarifyData && generatedForGoal) completed.push(1);

    const hasAnswers =
      Object.keys(answers).length > 0 ||
      (course?.answers && Object.keys(course.answers as Record<string, unknown>).length > 0);
    if (hasAnswers) completed.push(2);

    if (depth || course?.depth) completed.push(3);
    if (structureData) completed.push(4);
    return completed;
  }, [clarifyData, generatedForGoal, answers, course, depth, structureData]);

  // Steps the user can navigate to (prerequisite data exists)
  const navigableSteps = useMemo(() => {
    const navigable: number[] = [1];
    if (completedSteps.includes(1)) navigable.push(2);
    if (completedSteps.includes(2)) navigable.push(3);
    if (completedSteps.includes(3)) navigable.push(4);
    return navigable;
  }, [completedSteps]);

  // ── Handlers ───────────────────────────────────────────
  const executeGoalSubmit = useCallback(
    (goalValue: string) => {
      setAnswers({});
      setDepth(null);
      setGoal(goalValue);

      // Clear all downstream data from cache immediately
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
                setStep(2);
              },
            });
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
    [createCourseMutation, clarifyMutation, trackJob, courseId, updateCourseMutation, queryClient],
  );

  const handleGoalSubmit = useCallback(
    (goalValue: string) => {
      if (goalValue === generatedForGoal && clarifyData) {
        setStep(2);
        return;
      }

      // Check if downstream data already exists that will be overwritten
      const hasDownstream = !!(clarifyData || depthPreviews || structureData);
      if (hasDownstream) {
        confirmOverwrite('Changing the goal will regenerate your questions and clear all later steps.', () =>
          executeGoalSubmit(goalValue),
        );
        return;
      }

      executeGoalSubmit(goalValue);
    },
    [generatedForGoal, clarifyData, depthPreviews, structureData, executeGoalSubmit],
  );

  const executeClarifySubmit = useCallback(
    (answersValue: Record<string, string | string[]>) => {
      if (!courseId) return;
      setAnswers(answersValue);
      setDepth(null);

      // Clear downstream data so UI reflects the reset immediately
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
    [courseId, queryClient, updateCourseMutation, depthPreviewsMutation, trackJob],
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
    [course, depthPreviews, structureData, executeClarifySubmit],
  );

  const triggerStructureGeneration = useCallback(() => {
    if (!courseId) return;

    structureMutation.mutate(courseId, {
      onSuccess: (data) => {
        trackJob({
          jobId: data.jobId,
          courseId,
          type: 'generate_structure',
          onComplete: () => setStep(4),
        });
      },
    });
  }, [courseId, structureMutation, trackJob]);

  const executeDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (!courseId) return;
      setDepth(depthValue);

      updateCourseMutation.mutate(
        { id: courseId, data: { depth: depthValue } },
        { onSuccess: () => triggerStructureGeneration() },
      );
    },
    [courseId, updateCourseMutation, triggerStructureGeneration],
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
    [course, structureData, executeDepthConfirm],
  );

  const handleStructureModified = useCallback(() => {
    if (!courseId) return;
    queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
  }, [courseId, queryClient]);

  const handleAccept = useCallback(() => {
    if (!courseId) return;

    updateCourseMutation.mutate(
      { id: courseId, data: { status: 'ready' } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
          toast.success(TOASTS.COURSE_READY);
          router.push(`/course/${courseId}`);
        },
      },
    );
  }, [courseId, updateCourseMutation, queryClient, router]);

  const handleDelete = () => {
    if (!courseId) return;
    setShowDeleteDialog(true);
  };

  const navigateToStep = useCallback(
    (targetStep: number) => {
      // Re-sync local state from server when navigating back to a step
      if (targetStep === 2 && course?.answers && Object.keys(answers).length === 0) {
        setAnswers(course.answers as Record<string, string | string[]>);
      }
      if (targetStep === 3 && course?.depth && !depth) {
        setDepth(course.depth as CourseDepth);
      }
      isStepDirtyRef.current = false;
      setStep(targetStep as Step);
    },
    [course, answers, depth],
  );

  const handleStepClick = useCallback(
    (targetStep: number) => {
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
    [navigableSteps, isJobRunning, navigateToStep],
  );

  // ── Loading / error states ─────────────────────────────
  const isGoalLoading =
    createCourseMutation.isPending ||
    clarifyMutation.isPending ||
    updateCourseMutation.isPending ||
    (isJobRunning && step === 1);
  const goalError = createCourseMutation.error || clarifyMutation.error;

  return (
    <S.Layout>
      <S.Container $wide={step === 4} $semiWide={step === 1}>
        {step !== 1 && (
          <>
            <S.TopBar>
              {courseName && <S.CourseName>{courseName}</S.CourseName>}
              {courseId && (
                <S.DeleteLink type="button" onClick={handleDelete}>
                  Discard
                </S.DeleteLink>
              )}
            </S.TopBar>

            <S.StepperWrapper>
              <Stepper
                currentStep={step}
                totalSteps={4}
                labels={['Goal', 'Questions', 'Depth', 'Structure']}
                completedSteps={completedSteps}
                navigableSteps={navigableSteps}
                onStepClick={handleStepClick}
              />
            </S.StepperWrapper>
          </>
        )}

        <S.Content>
          {step === 1 && (
            <GoalStep
              initialGoal={goal}
              hasExistingData={!!clarifyData && goal === generatedForGoal}
              loading={isGoalLoading}
              error={goalError ? (goalError as Error).message : ''}
              onSubmit={handleGoalSubmit}
            />
          )}

          {step === 2 && !clarifyData && isJobRunning && <S.LoadingState>Preparing your questions...</S.LoadingState>}

          {step === 2 && clarifyData && (
            <ClarifyStep
              questions={clarifyData.questions}
              initialAnswers={answers}
              hasExistingData={!!depthPreviews}
              onSubmit={handleClarifySubmit}
              onBack={() => setStep(1)}
              onDirtyChange={handleDirtyChange}
            />
          )}

          {step === 3 && clarifyData && (
            <DepthStep
              depthPreviews={depthPreviews}
              previewsLoading={depthPreviewsMutation.isPending || (isJobRunning && !depthPreviews)}
              previewsError={!!depthPreviewsMutation.error}
              initialDepth={depth}
              hasExistingData={!!structureData}
              loading={structureMutation.isPending || isJobRunning}
              onConfirm={handleDepthConfirm}
              onRetryPreviews={() =>
                courseId &&
                depthPreviewsMutation.mutate(courseId, {
                  onSuccess: (data) => trackJob({ jobId: data.jobId, courseId, type: 'generate_depth_previews' }),
                })
              }
              onBack={() => setStep(2)}
              onDirtyChange={handleDirtyChange}
            />
          )}

          {step === 4 && !structureData && isJobRunning && (
            <S.LoadingState>Building your course structure...</S.LoadingState>
          )}

          {step === 4 && structureData && courseId && (
            <StructureStep
              courseId={courseId}
              modules={structureData}
              onStructureModified={handleStructureModified}
              onAccept={handleAccept}
              onBack={() => setStep(3)}
            />
          )}
        </S.Content>
      </S.Container>

      <AlertDialog
        open={showDeleteDialog}
        title="Discard this course?"
        description="This will permanently delete the course and all its data. This action cannot be undone."
        confirmLabel="Discard"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <AlertDialog
        open={!!overwriteDialog}
        title={overwriteDialog?.title ?? ''}
        description={overwriteDialog?.message ?? ''}
        confirmLabel={overwriteDialog?.confirmLabel ?? 'Continue'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          const action = overwriteDialog?.onConfirm;
          setOverwriteDialog(null);
          action?.();
        }}
        onCancel={() => setOverwriteDialog(null)}
      />
    </S.Layout>
  );
};

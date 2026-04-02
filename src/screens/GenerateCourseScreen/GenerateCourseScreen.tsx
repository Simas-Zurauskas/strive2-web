'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createCourse, clarifyCourse, generateStructure, generateDepthPreviews, updateCourse, deleteCourse } from '@/api/routes/course';
import { Course, CourseDepth, DepthPreviewsResponse } from '@/api/types';
import { Stepper } from '@/components';
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
  const awaitingStructureRef = useRef(false);

  // Step 4 — chat-based refinement (no local state needed)

  // ── Queries ────────────────────────────────────────────
  const courseQuery = useCourse(courseId);
  const course = courseQuery.data;

  // Derive AI results from course data
  const clarifyData = course?.clarifyData ?? null;
  const depthPreviews = (course?.depthPreviews as DepthPreviewsResponse) ?? null;
  const structureData = course?.structure?.modules ?? null;
  const courseName = course?.name || null;

  const isJobRunning = courseId ? isJobRunningForCourse(courseId) : false;

  // Auto-advance to step 4 when structure data arrives after generation
  useEffect(() => {
    if (step === 3 && structureData && awaitingStructureRef.current) {
      awaitingStructureRef.current = false;
      setStep(4);
    }
  }, [step, structureData]);

  // ── Mutations ──────────────────────────────────────────
  const createCourseMutation = useMutation({
    mutationFn: (params: { goal: string }) => createCourse(params),
    onError: () => toast.error('Failed to create course'),
  });

  const clarifyMutation = useMutation({
    mutationFn: (id: string) => clarifyCourse(id),
    onError: () => toast.error('Failed to start question generation'),
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateCourse>[1] }) => updateCourse(id, data),
    onError: () => toast.error('Failed to save course data'),
  });

  const structureMutation = useMutation({
    mutationFn: (id: string) => generateStructure(id),
    onError: () => toast.error('Failed to start structure generation'),
  });

  const depthPreviewsMutation = useMutation({
    mutationFn: (id: string) => generateDepthPreviews(id),
    onError: () => toast.error('Failed to generate depth previews'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success('Course deleted');
      router.push('/');
    },
    onError: () => toast.error('Failed to delete course'),
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
  }, [clarifyData, generatedForGoal, answers, depth, structureData, course?.answers, course?.depth]);


  // ── Handlers ───────────────────────────────────────────
  const handleGoalSubmit = useCallback(
    (goalValue: string) => {
      if (goalValue === generatedForGoal && clarifyData) {
        setStep(2);
        return;
      }

      setAnswers({});
      setDepth(null);
      setGoal(goalValue);

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
    [generatedForGoal, clarifyData, createCourseMutation, clarifyMutation, trackJob, courseId, updateCourseMutation],
  );

  const handleClarifySubmit = useCallback(
    (answersValue: Record<string, string | string[]>) => {
      if (!courseId) return;
      setAnswers(answersValue);

      // Clear stale depth previews so DepthStep shows skeletons while regenerating
      queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
        old ? { ...old, depthPreviews: undefined } : old,
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
    [courseId, updateCourseMutation, depthPreviewsMutation, trackJob],
  );

  const triggerStructureGeneration = useCallback(
    (depthValue: CourseDepth) => {
      if (!courseId) return;

      awaitingStructureRef.current = true;

      structureMutation.mutate(courseId, {
        onSuccess: (data) => {
          trackJob({
            jobId: data.jobId,
            courseId,
            type: 'generate_structure',
          });
        },
      });
    },
    [courseId, structureMutation, trackJob],
  );

  const handleDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (!courseId) return;
      setDepth(depthValue);

      updateCourseMutation.mutate(
        { id: courseId, data: { depth: depthValue } },
        { onSuccess: () => triggerStructureGeneration(depthValue) },
      );
    },
    [courseId, updateCourseMutation, triggerStructureGeneration],
  );

  const handleStructureModified = useCallback(() => {
    if (!courseId) return;
    queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
  }, [courseId, queryClient]);

  const handleStartFresh = useCallback(() => {
    if (depth) triggerStructureGeneration(depth);
  }, [depth, triggerStructureGeneration]);

  const handleAccept = useCallback(() => {
    if (!courseId) return;

    updateCourseMutation.mutate(
      { id: courseId, data: { status: 'ready' } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
          toast.success('Course is ready!');
          router.push(`/course/${courseId}`);
        },
      },
    );
  }, [courseId, updateCourseMutation, queryClient, router]);

  const handleDelete = () => {
    if (!courseId) return;
    if (window.confirm('Delete this course? This cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (isJobRunning) return;
      if (completedSteps.includes(targetStep)) {
        // Re-sync local state from server when navigating back to a step
        if (targetStep === 2 && course?.answers && Object.keys(answers).length === 0) {
          setAnswers(course.answers as Record<string, string | string[]>);
        }
        if (targetStep === 3 && course?.depth && !depth) {
          setDepth(course.depth as CourseDepth);
        }
        setStep(targetStep as Step);
      }
    },
    [completedSteps, isJobRunning, course, answers, depth],
  );

  // ── Loading / error states ─────────────────────────────
  const isGoalLoading =
    createCourseMutation.isPending || clarifyMutation.isPending || updateCourseMutation.isPending || (isJobRunning && step === 1);
  const goalError = createCourseMutation.error || clarifyMutation.error;
  return (
    <S.Layout $wide={step === 4}>
      <S.Container $wide={step === 4}>
        <S.Nav>
          <Link href="/">&larr; Back</Link>
          {courseName && <S.CourseName>{courseName}</S.CourseName>}
          {courseId && (
            <S.DeleteLink type="button" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete course'}
            </S.DeleteLink>
          )}
        </S.Nav>

        <S.StepperWrapper>
          <Stepper
            currentStep={step}
            totalSteps={4}
            labels={['Goal', 'Questions', 'Depth', 'Structure']}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </S.StepperWrapper>

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

          {step === 2 && clarifyData && (
            <ClarifyStep
              questions={clarifyData.questions}
              initialAnswers={answers}
              onSubmit={handleClarifySubmit}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && clarifyData && (
            <DepthStep
              depthPreviews={depthPreviews}
              previewsLoading={depthPreviewsMutation.isPending || (isJobRunning && !depthPreviews)}
              initialDepth={depth}
              loading={structureMutation.isPending || isJobRunning}
              onConfirm={handleDepthConfirm}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && structureData && courseId && (
            <StructureStep
              courseId={courseId}
              modules={structureData}
              onStructureModified={handleStructureModified}
              onAccept={handleAccept}
              onStartFresh={handleStartFresh}
              onBack={() => setStep(3)}
            />
          )}
        </S.Content>
      </S.Container>
    </S.Layout>
  );
};

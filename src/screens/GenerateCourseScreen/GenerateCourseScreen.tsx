'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Course, CourseDepth } from '@/api/types';
import { Stepper, AlertDialog } from '@/components';
import { useCourse } from '@/hooks/useCourses';
import * as S from './GenerateCourseScreen.styles';
import { GoalStep, ClarifyStep, DepthStep, StructureStep, useWizardMutations, useWizardHandlers } from './internal';

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

  const [stableKey] = useState(() => resumeCourseId ?? 'new');

  const { data: resumeCourse, isLoading } = useCourse(resumeCourseId);

  const isResumeFlow = stableKey !== 'new';
  if (isResumeFlow && resumeCourseId && isLoading) {
    return (
      <S.Layout>
        <S.Container>
          <p style={{ textAlign: 'center', opacity: 0.6, padding: '4rem 0' }}>Loading course...</p>
        </S.Container>
      </S.Layout>
    );
  }

  return <GenerateCourseWizard key={stableKey} resumeCourse={resumeCourse ?? null} />;
};

// Inner wizard: receives initial values as props, no effects needed
const GenerateCourseWizard = ({ resumeCourse }: { resumeCourse: Course | null }) => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(() => determineStepFromCourse(resumeCourse));
  const [courseId, setCourseId] = useState<string | null>(resumeCourse?._id ?? null);
  const [goal, setGoal] = useState(resumeCourse?.goal ?? '');
  const [generatedForGoal, setGeneratedForGoal] = useState(resumeCourse?.goal ?? '');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    (resumeCourse?.answers as Record<string, string | string[]>) ?? {},
  );
  const [depth, setDepth] = useState<CourseDepth | null>((resumeCourse?.depth as CourseDepth) ?? null);

  // Overwrite confirmation
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

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // ── Queries & Mutations ───────────────────────────────
  const courseQuery = useCourse(courseId);
  const course = courseQuery.data;
  const mutations = useWizardMutations(courseId);

  const handlers = useWizardHandlers({
    courseId,
    setCourseId: (id: string) => setCourseId(id),
    step,
    setStep,
    goal,
    setGoal,
    generatedForGoal,
    setGeneratedForGoal,
    answers,
    setAnswers,
    depth,
    setDepth,
    course,
    mutations,
    confirmOverwrite,
  });

  const courseName = course?.name || null;

  // Update URL with courseId for resume-on-refresh
  useEffect(() => {
    if (courseId) {
      router.replace(`/courses/new?courseId=${courseId}`, { scroll: false });
    }
  }, [courseId, router]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // ── Computed ───────────────────────────────────────────
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    if (handlers.clarifyData && generatedForGoal) completed.push(1);

    const hasAnswers =
      Object.keys(answers).length > 0 ||
      (course?.answers && Object.keys(course.answers as Record<string, unknown>).length > 0);
    if (hasAnswers) completed.push(2);

    if (depth || course?.depth) completed.push(3);
    if (handlers.structureData) completed.push(4);
    return completed;
  }, [handlers.clarifyData, generatedForGoal, answers, course, depth, handlers.structureData]);

  const navigableSteps = useMemo(() => {
    const navigable: number[] = [1];
    if (completedSteps.includes(1)) navigable.push(2);
    if (completedSteps.includes(2)) navigable.push(3);
    if (completedSteps.includes(3)) navigable.push(4);
    return navigable;
  }, [completedSteps]);

  // ── Loading / error states ─────────────────────────────
  const isGoalLoading =
    handlers.createCourseMutation.isPending ||
    handlers.clarifyMutation.isPending ||
    handlers.updateCourseMutation.isPending ||
    (handlers.isJobRunning && step === 1);
  const goalError = handlers.createCourseMutation.error || handlers.clarifyMutation.error;

  return (
    <S.Layout>
      <S.Container $wide={step === 4} $semiWide={step === 1}>
        {step !== 1 && (
          <>
            <S.TopBar>
              {courseName && <S.CourseName>{courseName}</S.CourseName>}
              {courseId && (
                <S.DeleteLink type="button" onClick={() => setShowDeleteDialog(true)}>
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
                onStepClick={(s) => handlers.handleStepClick(s, navigableSteps)}
              />
            </S.StepperWrapper>
          </>
        )}

        <S.Content>
          {step === 1 && (
            <GoalStep
              initialGoal={goal}
              hasExistingData={!!handlers.clarifyData && goal === generatedForGoal}
              loading={isGoalLoading}
              error={goalError ? (goalError as Error).message : ''}
              onSubmit={handlers.handleGoalSubmit}
            />
          )}

          {step === 2 && !handlers.clarifyData && handlers.isJobRunning && (
            <S.LoadingState>Preparing your questions...</S.LoadingState>
          )}

          {step === 2 && handlers.clarifyData && (
            <ClarifyStep
              questions={handlers.clarifyData.questions}
              initialAnswers={answers}
              hasExistingData={!!handlers.depthPreviews}
              onSubmit={handlers.handleClarifySubmit}
              onBack={() => setStep(1)}
              onDirtyChange={handlers.handleDirtyChange}
            />
          )}

          {step === 3 && handlers.clarifyData && (
            <DepthStep
              depthPreviews={handlers.depthPreviews}
              previewsLoading={handlers.depthPreviewsMutation.isPending || (handlers.isJobRunning && !handlers.depthPreviews)}
              previewsError={!!handlers.depthPreviewsMutation.error}
              initialDepth={depth}
              hasExistingData={!!handlers.structureData}
              loading={handlers.structureMutation.isPending || handlers.isJobRunning}
              onConfirm={handlers.handleDepthConfirm}
              onRetryPreviews={() =>
                courseId &&
                handlers.depthPreviewsMutation.mutate(courseId, {
                  onSuccess: (data) => handlers.trackJob({ jobId: data.jobId, courseId, type: 'generate_depth_previews' }),
                })
              }
              onBack={() => setStep(2)}
              onDirtyChange={handlers.handleDirtyChange}
            />
          )}

          {step === 4 && !handlers.structureData && handlers.isJobRunning && (
            <S.LoadingState>Building your course structure...</S.LoadingState>
          )}

          {step === 4 && handlers.structureData && courseId && (
            <StructureStep
              courseId={courseId}
              modules={handlers.structureData}
              onStructureModified={handlers.handleStructureModified}
              onAccept={handlers.handleAccept}
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
        loading={handlers.deleteMutation.isPending}
        onConfirm={() => {
          setShowDeleteDialog(false);
          handlers.deleteMutation.mutate();
        }}
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

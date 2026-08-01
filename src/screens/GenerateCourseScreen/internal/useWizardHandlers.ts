import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { listSourceDocuments } from '@/api/routes/course/documents';
import { ROUTES } from '@/constants/routes';
import { useJobManager } from '@/hooks/useJobManager';
import { analytics } from '@/lib/analytics';
import { clearPendingGoal } from '@/lib/pendingGoal';
import { QKeys } from '@/types';
import type { useDepthOverrideDialog } from './useDepthOverrideDialog';
import type { useWizardMutations } from './useWizardMutations';
import type {
  Course,
  CourseDepth,
  ClientApiError,
  DepthPreviewsResponse,
  GoalType,
  SourceDocument,
  SourceFidelity,
} from '@/api/types';
import type { DepthOverridePayload } from '@/components/DepthOverrideDialog';

type Step = 1 | 2 | 3 | 4 | 5;

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
 * Parse a ClientApiError body to decide whether it's a depth-gate 409 from
 * the backend. The bidirectional gate emits one of two codes:
 *   - DEPTH_OVERRIDE_REQUIRES_ACK    — overcommit (selected too big)
 *   - DEPTH_UNDERCOMMIT_REQUIRES_ACK — undercommit (selected too small)
 * Returns the typed discriminated payload or null. Accepts both `code` and
 * `errorCode` field shapes (see Registry.tsx comment).
 */
const DEPTH_GATE_CODES = [
  'DEPTH_OVERRIDE_REQUIRES_ACK',
  'DEPTH_UNDERCOMMIT_REQUIRES_ACK',
] as const;

const parseDepthOverrideError = (err: unknown): DepthOverridePayload | null => {
  const apiError = err as ClientApiError & { code?: string; [k: string]: unknown };
  if (apiError?.status !== 409) return null;
  const codeField = apiError.code ?? apiError.errorCode;
  if (typeof codeField !== 'string') return null;
  if (!(DEPTH_GATE_CODES as readonly string[]).includes(codeField)) return null;
  return apiError as unknown as DepthOverridePayload;
};

/**
 * Does the corpus still owe paid extraction work before structure can be
 * grounded in it? True when any document has scanned pages beyond the
 * vision-escalated set, or audio beyond the transcribed window — the
 * client-side mirror of the server's prepare-corpus predicate. Calling
 * prepare-corpus when nothing is outstanding is a safe fast no-op, so a
 * false positive here costs one quick job, never a wrong course.
 */
const needsCorpusPreparation = (docs: SourceDocument[]): boolean =>
  docs.some(
    (d) =>
      (d.scannedPageCount ?? 0) > (d.escalatedPages?.length ?? 0) ||
      (d.audioDurationSec != null && (d.transcribedSec ?? 0) < d.audioDurationSec),
  );

/** Failure info surfaced by a tracked ingest job, rendered inline by SourcesStep. */
export interface SourcesJobFailure {
  errorCode?: string;
  errorMeta?: Record<string, unknown>;
  error?: string | null;
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
    ingestDocumentsMutation,
    prepareCorpusMutation,
    queryClient,
  } = mutations;

  const clarifyData = course?.clarifyData ?? null;
  const depthPreviews = (course?.depthPreviews as DepthPreviewsResponse) ?? null;
  const structureData = course?.structure?.modules ?? null;
  const isJobRunning = courseId ? isJobRunningForCourse(courseId) : false;
  const isDocumentsCourse = course?.source === 'documents';

  // ── Documents-flow state ──────────────────────────────
  // `ingestFailure` — the last ingest job's failure info, rendered as an
  // inline error card by SourcesStep (paired with the analyze loader so
  // a failed job never leaves the step blank). `isPreparingSources` —
  // a prepare_corpus job is running before structure ("Preparing your
  // sources…" loader copy). `sourcesFlowFailed` — the pre-structure
  // chain (documents fetch / prepare job / structure submit) failed and
  // step 5 must show a retry card instead of nothing.
  const [ingestFailure, setIngestFailure] = useState<SourcesJobFailure | null>(null);
  const [isPreparingSources, setIsPreparingSources] = useState(false);
  const [sourcesFlowFailed, setSourcesFlowFailed] = useState(false);

  const handleDirtyChange = useCallback((isDirty: boolean) => {
    isStepDirtyRef.current = isDirty;
  }, []);

  // ── Goal ──────────────────────────────────────────────

  const executeGoalSubmit = useCallback(
    (goalValue: string) => {
      setAnswers({} as Record<string, string | string[]>);
      setDepth(null);
      setGoal(goalValue);

      analytics.track('wizard_step_1_goal_submitted', {
        goal_length_chars: goalValue.length,
      });

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
                // The backend cascades goalType / goalTypeConfidence /
                // goalTypeConfirmedAt to null when the goal text changes.
                // Mirror that here so the optimistic UI matches.
                goalType: null,
                goalTypeConfidence: null,
                goalTypeConfirmedAt: null,
              }
            : old,
        );
      }

      const startClarify = (targetCourseId: string) => {
        // The goal is persisted server-side at this point (create/update
        // mutation succeeded) — the landing-page stash has served its
        // purpose. Clearing here (not on submit attempt) means a failed
        // submission still re-prefills the next wizard visit.
        clearPendingGoal();
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
        // Goal is already persisted and clarified — the stash is redundant.
        // (New submissions clear the stash in startClarify, after the
        // create/update mutation succeeds.)
        clearPendingGoal();
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

  // ── Goal type ─────────────────────────────────────────
  //
  // Triggered when the user picks a non-AI-suggested chip on the Purpose
  // step. Cascade mirrors the goal-overwrite flow: PATCH /course/{id} with
  // the new goalType (the backend marks confidence='high' so the next
  // clarify job uses the user-picked value instead of re-classifying, and
  // clears `goalTypeConfirmedAt`), then re-submit a clarify job to
  // regenerate questions tilted to the new goalType. Downstream
  // (depthPreviews / structure / answers) is cleared by the clarify job
  // itself — same cascade as a goal-text change.
  //
  // `options.onClarifySettled` fires after the clarify regen finishes —
  // PurposeStep uses it to stamp `goalTypeConfirmedAt` and advance the
  // user to step 3 in one motion (no double-Next needed).

  const executeGoalTypeSwitch = useCallback(
    (
      newGoalType: GoalType,
      options?: { onClarifySettled?: () => void },
    ) => {
      if (!courseId) return;
      analytics.track('wizard_step_2_goal_type_switched', {
        from_goal_type: course?.goalType ?? null,
        to_goal_type: newGoalType,
      });
      setAnswers({} as Record<string, string | string[]>);
      setDepth(null);

      queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
        old
          ? {
              ...old,
              goalType: newGoalType,
              // Backend cascade nulls confirmedAt on goalType change; mirror
              // here so the resume gate doesn't read stale state during the
              // regen window.
              goalTypeConfirmedAt: null,
              clarifyData: undefined,
              depthPreviews: undefined,
              structure: undefined,
              depth: undefined,
              answers: undefined,
            }
          : old,
      );

      updateCourseMutation.mutate(
        { id: courseId, data: { goalType: newGoalType } },
        {
          onSuccess: () => {
            clarifyMutation.mutate(courseId, {
              onSuccess: (clarifyResult) => {
                trackJob({
                  jobId: clarifyResult.jobId,
                  courseId,
                  type: 'clarify',
                  onComplete: options?.onClarifySettled,
                });
              },
            });
          },
        },
      );
    },
    [
      courseId,
      queryClient,
      updateCourseMutation,
      clarifyMutation,
      trackJob,
      setAnswers,
      setDepth,
      course,
    ],
  );

  // ── Purpose ───────────────────────────────────────────
  //
  // The new dedicated Purpose step routes here. Two paths:
  //
  //   1. No override (selected matches `course.goalType`, which is the AI
  //      classification): just stamp `goalTypeConfirmedAt: 'now'`, fire
  //      the funnel event, and advance to step 3. No clarify regen — the
  //      questions already in `clarifyData` are tilted to the AI choice
  //      the user is confirming.
  //
  //   2. Override (selected differs from current): mirror the prior chip-
  //      row cascade — confirm dialog if there's downstream data the
  //      regen will clobber, then `executeGoalTypeSwitch`. After the
  //      clarify job settles we PATCH `goalTypeConfirmedAt: 'now'` and
  //      advance to step 3 from the `onClarifySettled` hook so the user
  //      doesn't have to click Next twice.
  //
  // The funnel event fires only on the FIRST confirmation transition
  // (`course.goalTypeConfirmedAt === null`). Re-visiting Purpose via
  // stepper back-nav and clicking Next without changes does NOT re-fire
  // the event — keeps the funnel honest.

  const advancePastPurpose = useCallback(
    (selectedType: GoalType, isOverride: boolean) => {
      if (!courseId) return;
      const wasFirstConfirmation = !course?.goalTypeConfirmedAt;

      // Cast: `goalTypeConfirmedAt` accepts a `'now'` literal at the
      // OpenAPI boundary, decoded server-side to a real Date. The
      // generated request type lists it as `'now' | null`.
      updateCourseMutation.mutate(
        {
          id: courseId,
          data: { goalTypeConfirmedAt: 'now' } as { goalTypeConfirmedAt: 'now' },
        },
        {
          onSuccess: () => {
            if (wasFirstConfirmation) {
              analytics.track('wizard_step_2_purpose_confirmed', {
                goal_type: selectedType,
                was_ai_suggestion: !isOverride,
                ai_suggestion: course?.goalType ?? null,
              });
            }
            setStep(3);
          },
        },
      );
    },
    [courseId, course, updateCourseMutation, setStep],
  );

  const handlePurposeConfirm = useCallback(
    (selectedType: GoalType, isOverride: boolean) => {
      if (!course) return;

      if (!isOverride) {
        advancePastPurpose(selectedType, false);
        return;
      }

      const hasDownstream = !!(depthPreviews || structureData || (course.answers && Object.keys(course.answers).length > 0));
      const proceed = () => {
        // Trigger the goalType cascade + clarify regen. The backend will
        // null `goalTypeConfirmedAt`; we re-stamp it from the
        // onClarifySettled hook once the regen lands so the user doesn't
        // bounce back to Purpose on resume.
        executeGoalTypeSwitch(selectedType, {
          onClarifySettled: () => advancePastPurpose(selectedType, true),
        });
      };

      if (hasDownstream) {
        confirmOverwrite({
          title: 'Switch course purpose?',
          message:
            'Switching will regenerate the clarifying questions and clear your current answers, depth options, and structure. Continue?',
          action: proceed,
        });
        return;
      }

      proceed();
    },
    [course, depthPreviews, structureData, executeGoalTypeSwitch, advancePastPurpose, confirmOverwrite],
  );

  // ── Clarify ───────────────────────────────────────────

  const executeClarifySubmit = useCallback(
    (answersValue: Record<string, string | string[]>) => {
      if (!courseId) return;
      analytics.track('wizard_step_3_questions_completed', {
        n_questions: Object.keys(answersValue).length,
      });
      setAnswers(answersValue);
      setDepth(null);

      queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
        old ? { ...old, depthPreviews: undefined, structure: undefined } : old,
      );

      updateCourseMutation.mutate(
        { id: courseId, data: { answers: answersValue as Record<string, never> } },
        {
          onSuccess: () => {
            setStep(4);
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
        setStep(4);
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

  const fireStructureGeneration = useCallback(() => {
    if (!courseId) return;

    structureMutation.mutate(courseId, {
      onSuccess: (data) => {
        trackJob({
          jobId: data.jobId,
          courseId,
          type: 'generate_structure',
        });
        setStep(5);
      },
      onError: () => {
        // Documents flow may already sit on step 5 (after prepare_corpus)
        // when this submit fails — flag it so the step renders a retry
        // card instead of a blank body. Goal courses keep the existing
        // behavior (global toast, user still on step 4).
        if (isDocumentsCourse) setSourcesFlowFailed(true);
      },
    });
  }, [courseId, structureMutation, trackJob, setStep, isDocumentsCourse]);

  /**
   * Pre-structure hook. Goal courses fire generate_structure directly.
   * Documents courses first check whether the corpus owes debited
   * extraction (unescalated scanned pages / untranscribed audio); if so,
   * a prepare_corpus job runs first — surfaced as the "Preparing your
   * sources…" state on step 5 — and structure fires from its onComplete.
   * A prepare-submit 402 rides the mutation's global policy (Out-of-
   * Credits modal) while the user stays on step 4 to retry.
   */
  const triggerStructureGeneration = useCallback(() => {
    if (!courseId) return;
    setSourcesFlowFailed(false);

    if (!isDocumentsCourse) {
      fireStructureGeneration();
      return;
    }

    listSourceDocuments(courseId)
      .then((docs) => {
        if (!needsCorpusPreparation(docs)) {
          fireStructureGeneration();
          return;
        }

        analytics.track('wizard_prepare_corpus_started', {
          document_count: docs.length,
        });
        prepareCorpusMutation.mutate(courseId, {
          onSuccess: (data) => {
            setIsPreparingSources(true);
            setStep(5);
            trackJob({
              jobId: data.jobId,
              courseId,
              type: 'prepare_corpus',
              onComplete: () => {
                analytics.track('wizard_prepare_corpus_completed', {});
                setIsPreparingSources(false);
                queryClient.invalidateQueries({ queryKey: [QKeys.SOURCE_DOCUMENTS, courseId] });
                fireStructureGeneration();
              },
              onFailed: () => {
                setIsPreparingSources(false);
                setSourcesFlowFailed(true);
                queryClient.invalidateQueries({ queryKey: [QKeys.SOURCE_DOCUMENTS, courseId] });
              },
            });
          },
        });
      })
      .catch(() => {
        // Couldn't even list the documents — show the retry card rather
        // than silently skipping the (required) preparation pass.
        setSourcesFlowFailed(true);
        setStep(5);
      });
  }, [courseId, isDocumentsCourse, fireStructureGeneration, prepareCorpusMutation, trackJob, setStep, queryClient]);

  // Self-recursive callback (the dialog's "confirm override" reuses the
  // same flow with `acknowledged: true`). We thread the recursion through
  // a ref so the closure can call the *current* version without capturing
  // its own identifier — that bare self-reference fails React Compiler's
  // "access before declared" check, since the closure captures the
  // binding before the `useCallback` finishes assigning to it.
  const executeDepthConfirmRef = useRef<
    ((depthValue: CourseDepth, options?: { acknowledged?: boolean }) => void) | null
  >(null);
  const executeDepthConfirm = useCallback(
    (depthValue: CourseDepth, options?: { acknowledged?: boolean }) => {
      if (!courseId) return;
      const acknowledged = options?.acknowledged ?? false;
      const previousDepth = (course?.depth as CourseDepth | null) ?? null;

      // Don't double-fire on the post-acknowledgement retry — the user
      // already saw the gate and the dialog itself fires
      // `wizard_depth_gate_resolved` with the outcome.
      if (!acknowledged) {
        analytics.track('wizard_step_4_depth_selected', {
          depth_tier: depthValue,
        });
      }

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

            const direction = gatePayload.code === 'DEPTH_UNDERCOMMIT_REQUIRES_ACK'
              ? 'undercommit'
              : 'override';
            analytics.track('wizard_depth_gate_shown', {
              direction,
              chosen_tier: depthValue,
              ...(gatePayload.recommended && { recommended_tier: gatePayload.recommended }),
            });

            // Revert the depth-selector UI so the user can see their old
            // selection while the dialog is open. The retry will re-set it.
            setDepth(previousDepth);
            depthOverrideDialog.showDialog(gatePayload, () => {
              analytics.track('wizard_depth_gate_resolved', {
                direction,
                outcome: 'accepted',
                chosen_tier: depthValue,
              });
              executeDepthConfirmRef.current?.(depthValue, { acknowledged: true });
            });
          },
        },
      );
    },
    [courseId, course, updateCourseMutation, triggerStructureGeneration, setDepth, depthOverrideDialog],
  );
  useEffect(() => {
    executeDepthConfirmRef.current = executeDepthConfirm;
  }, [executeDepthConfirm]);

  const handleDepthConfirm = useCallback(
    (depthValue: CourseDepth) => {
      if (depthValue === course?.depth && structureData) {
        setStep(5);
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

  // ── Documents flow (SourcesStep, step 1 in documents mode) ──

  /**
   * Lazily create the course shell on first upload interaction. The
   * documents flow needs a course row before any file can land (S3 keys
   * and Job rows are course-scoped), but we don't want an empty course
   * for users who only look at the screen.
   */
  const ensureDocumentsCourse = useCallback(async (): Promise<string> => {
    if (courseId) return courseId;
    const data = await createCourseMutation.mutateAsync({ source: 'documents' });
    setCourseId(data.courseId);
    return data.courseId;
  }, [courseId, createCourseMutation, setCourseId]);

  /** Kick off the free ingest-and-assess job and track it. */
  const handleIngestSources = useCallback(() => {
    if (!courseId) return;
    setIngestFailure(null);
    analytics.track('wizard_documents_ingest_started', {});
    ingestDocumentsMutation.mutate(courseId, {
      onSuccess: (data) => {
        trackJob({
          jobId: data.jobId,
          courseId,
          type: 'ingest_documents',
          onComplete: () => {
            analytics.track('wizard_documents_ingest_completed', {});
            queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
            queryClient.invalidateQueries({ queryKey: [QKeys.SOURCE_DOCUMENTS, courseId] });
          },
          onFailed: (info) => {
            analytics.track('wizard_documents_ingest_failed', {
              error_code: info.errorCode ?? null,
            });
            setIngestFailure(info);
            queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
            queryClient.invalidateQueries({ queryKey: [QKeys.SOURCE_DOCUMENTS, courseId] });
          },
        });
      },
    });
  }, [courseId, ingestDocumentsMutation, trackJob, queryClient]);

  /**
   * Analysis-panel confirm: persist the (edited) suggested goal + the
   * fidelity dial, then enter the classic pipeline — clarify job, then
   * step 2 (Purpose) — exactly where a goal course would be after its
   * goal submit. Re-confirming with nothing changed just advances;
   * changing goal/fidelity with downstream data asks first (same
   * overwrite contract as GoalStep).
   */
  const handleSourcesConfirm = useCallback(
    (goalValue: string, fidelity: SourceFidelity) => {
      if (!courseId) return;

      const unchanged =
        goalValue === course?.goal && (course?.sourceFidelity ?? 'guided') === fidelity;
      if (unchanged && clarifyData) {
        setStep(2);
        return;
      }

      const proceed = () => {
        setGoal(goalValue);
        analytics.track('wizard_documents_goal_confirmed', { fidelity });

        updateCourseMutation.mutate(
          { id: courseId, data: { goal: goalValue, sourceFidelity: fidelity } },
          {
            onSuccess: () => {
              clarifyMutation.mutate(courseId, {
                onSuccess: (clarifyResult) => {
                  trackJob({
                    jobId: clarifyResult.jobId,
                    courseId,
                    type: 'clarify',
                    onComplete: () => {
                      setGeneratedForGoal(goalValue);
                    },
                  });
                  setStep(2);
                },
              });
            },
          },
        );
      };

      const hasDownstream = !!(clarifyData || depthPreviews || structureData);
      if (hasDownstream) {
        confirmOverwrite({
          message: 'Changing the goal or fidelity will regenerate your questions and clear all later steps.',
          action: proceed,
        });
        return;
      }
      proceed();
    },
    [
      courseId,
      course,
      clarifyData,
      depthPreviews,
      structureData,
      confirmOverwrite,
      updateCourseMutation,
      clarifyMutation,
      trackJob,
      setGoal,
      setGeneratedForGoal,
      setStep,
    ],
  );

  // ── Accept & Delete ───────────────────────────────────

  const handleAccept = useCallback(() => {
    if (!courseId) return;

    updateCourseMutation.mutate(
      { id: courseId, data: { status: 'ready' } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
          queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
          // Mixpanel — accept is the wizard funnel's terminal success step.
          // Plan ideal: emit server-side from the status='ready' PATCH so the
          // event survives a tab close mid-redirect. The client emit here
          // covers the common path; deferred until the controller can attach
          // the analytics call.
          const moduleCount = course?.structure?.modules?.length ?? 0;
          const lessonCount = (course?.structure?.modules ?? []).reduce(
            (sum, m) => sum + ((m as { lessons?: unknown[] }).lessons?.length ?? 0),
            0,
          );
          analytics.track('wizard_course_accepted', {
            course_id: courseId,
            module_count: moduleCount,
            lesson_count: lessonCount,
            ...(course?.depth && { depth_tier: course.depth }),
            ...(course?.goalType && { goal_type: course.goalType }),
          });
          // Land the user directly on lesson 0/0's "Create lesson" view —
          // one tap from generation instead of two screens away (38% of
          // accepted courses never got a lesson opened from the overview
          // stop). No auto-generation: the explicit Generate button and its
          // per-lesson toggles stay the user's call. The overview remains
          // one tap away via the course breadcrumb. `from=accept` feeds the
          // lesson_generate_view_shown trigger property.
          router.push(`${ROUTES.lesson(course?.slug, courseId, 0, 0)}?from=accept`);
        },
      },
    );
  }, [courseId, updateCourseMutation, queryClient, router, course]);

  // ── Navigation ────────────────────────────────────────

  const navigateToStep = useCallback(
    (targetStep: number) => {
      // Step 3 (Questions, was step 2): rehydrate answers from server
      // when local state is empty (resume / stepper-jump).
      if (targetStep === 3 && course?.answers && Object.keys(answers).length === 0) {
        setAnswers(course.answers as Record<string, string | string[]>);
      }
      // Step 4 (Depth, was step 3): same for depth selection.
      if (targetStep === 4 && course?.depth && !depth) {
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
    isDocumentsCourse,
    handleDirtyChange,
    handleGoalSubmit,
    handlePurposeConfirm,
    handleClarifySubmit,
    handleDepthConfirm,
    handleStructureModified,
    handleAccept,
    handleStepClick,
    // Documents flow
    ensureDocumentsCourse,
    handleIngestSources,
    handleSourcesConfirm,
    ingestFailure,
    isPreparingSources,
    sourcesFlowFailed,
    retrySourcesFlow: triggerStructureGeneration,
    deleteMutation,
    depthPreviewsMutation,
    createCourseMutation,
    clarifyMutation,
    updateCourseMutation,
    structureMutation,
    ingestDocumentsMutation,
    prepareCorpusMutation,
    trackJob,
  };
};

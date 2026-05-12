'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getJobStatus } from '@/api/routes/course';
import { Course, JobStartedEvent, JobStatusEvent } from '@/api/types';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { fireInsufficientCredits } from '@/lib/creditModalBus';
import { QKeys } from '@/types';
import { useSocket } from './useSocket';

interface TrackJobParams {
  jobId: string;
  courseId: string;
  type: string;
  onComplete?: () => void;
}

export interface GeneratingLesson {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
}

interface JobManagerContextValue {
  trackJob: (job: TrackJobParams) => void;
  isJobRunningForCourse: (courseId: string) => boolean;
  generatingLesson: GeneratingLesson | null;
  setGeneratingLesson: (lesson: GeneratingLesson | null) => void;
}

const JobManagerContext = createContext<JobManagerContextValue | null>(null);

/**
 * Map a completed job-status WS event to the toast we should show.
 * Returns null for non-routable completions (wizard-only jobs whose UX
 * is handled by the screen that initiated them, or unknown types).
 *
 * Callers use the result two ways:
 *   - skip the toast entirely when `targetPath` matches the current
 *     pathname (the user is already where the content lands — the
 *     inline content swap is the notification)
 *   - otherwise render a toast carrying the `actionLabel` button that
 *     routes the user to `targetPath` on click.
 *
 * Keep this table in lockstep with JobType in `@lib/constants` — any
 * new background job that lands content on a specific page should add
 * a case here so the user gets a consistent away-from-page heads-up.
 */
interface CompletionToastSpec {
  message: string;
  targetPath: string;
  actionLabel: string;
}
const buildCompletionToast = ({
  event,
  findCourseSlug,
}: {
  event: JobStatusEvent;
  findCourseSlug: (courseId: string) => string | null;
}): CompletionToastSpec | null => {
  const slug = findCourseSlug(event.courseId);
  if (!slug) return null;

  const lessonPath =
    event.moduleIndex != null && event.lessonIndex != null
      ? `/course/${slug}/lesson/${event.moduleIndex}/${event.lessonIndex}`
      : null;
  const quizPath = event.moduleIndex != null ? `/course/${slug}/quiz/${event.moduleIndex}` : null;

  switch (event.type) {
    case 'generate_lesson':
      if (!lessonPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE,
        targetPath: lessonPath,
        actionLabel: 'Open lesson',
      };
    case 'regenerate_hero':
      if (!lessonPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE_HERO,
        targetPath: lessonPath,
        actionLabel: 'Open lesson',
      };
    case 'regenerate_links':
      if (!lessonPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE_LINKS,
        targetPath: lessonPath,
        actionLabel: 'Open lesson',
      };
    case 'regenerate_recall':
      if (!lessonPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE_RECALL,
        targetPath: lessonPath,
        actionLabel: 'Open lesson',
      };
    case 'lesson_narration':
      if (!lessonPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE_NARRATION,
        targetPath: lessonPath,
        actionLabel: 'Open lesson',
      };
    case 'generate_module_quiz':
      if (!quizPath) return null;
      return {
        message: TOASTS.GENERATION_COMPLETE_QUIZ,
        targetPath: quizPath,
        actionLabel: 'Open quiz',
      };
    // Wizard-only flows hit the `entry.callback()` branch in the caller;
    // anything that reaches here is non-routable and stays silent.
    case 'clarify':
    case 'generate_structure':
    case 'refine_structure':
    case 'generate_depth_previews':
      return null;
    default:
      return null;
  }
};

export const useJobManager = () => {
  const ctx = useContext(JobManagerContext);
  if (!ctx) throw new Error('useJobManager must be used within JobManagerProvider');
  return ctx;
};

export const JobManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  const { socket } = useSocket();
  const callbacksRef = useRef<Map<string, { callback: () => void; courseId: string }>>(new Map());
  // Local set for instant reactivity (before query cache updates with activeJobId)
  const [activeCourseIds, setActiveCourseIds] = useState<Set<string>>(new Set());
  // Which specific lesson is currently generating (set via WS or optimistically)
  const [generatingLesson, setGeneratingLesson] = useState<GeneratingLesson | null>(null);

  const findCourseSlug = useCallback(
    (courseId: string): string | null => {
      const courses = queryClient.getQueryData<Course[]>([QKeys.COURSES]);
      const fromList = courses?.find((c) => c._id === courseId)?.slug;
      if (fromList) return fromList;
      const entries = queryClient.getQueriesData<Course>({
        queryKey: [QKeys.COURSE],
        predicate: (q) => (q.state.data as Course | undefined)?._id === courseId,
      });
      return entries[0]?.[1]?.slug ?? null;
    },
    [queryClient],
  );

  // Clean up a tracked job entry
  const cleanupJob = useCallback((jobId: string) => {
    const entry = callbacksRef.current.get(jobId);
    if (entry) {
      callbacksRef.current.delete(jobId);
      setActiveCourseIds((prev) => {
        const next = new Set(prev);
        next.delete(entry.courseId);
        return next;
      });
    }
  }, []);

  // trackJob: used by wizard flows (clarify, generate_structure) that need onComplete callbacks.
  // Also provides instant local tracking before the query cache updates.
  const trackJob = useCallback((job: TrackJobParams) => {
    if (job.onComplete) {
      callbacksRef.current.set(job.jobId, { callback: job.onComplete, courseId: job.courseId });
    }
    setActiveCourseIds((prev) => new Set(prev).add(job.courseId));
  }, []);

  // Check if a job is running for a course. Uses two sources:
  // 1. Local activeCourseIds — instant, covers gap between job submit and query cache update
  // 2. React Query cache (course.activeJobId) — persistent, survives refresh/navigation
  const isJobRunningForCourse = useCallback(
    (courseId: string) => {
      if (activeCourseIds.has(courseId)) return true;
      const course = queryClient.getQueryData<Course>([QKeys.COURSE, courseId]);
      if (course?.activeJobId) return true;
      const courses = queryClient.getQueryData<Course[]>([QKeys.COURSES]);
      return courses?.some((c) => c._id === courseId && c.activeJobId) ?? false;
    },
    [activeCourseIds, queryClient],
  );

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Best-effort instant tracking for chat-initiated jobs
    const handleStarted = (event: JobStartedEvent) => {
      setActiveCourseIds((prev) => new Set(prev).add(event.courseId));
      if (event.type === 'generate_lesson' && event.moduleIndex != null && event.lessonIndex != null) {
        setGeneratingLesson({ courseId: event.courseId, moduleIndex: event.moduleIndex, lessonIndex: event.lessonIndex });

        // Optimistically stamp activeJobId + activeLesson into the course
        // cache so sidebar/overview indicators flip to 'generating'
        // instantly, without waiting for the next /course refetch.
        // Mirrors the server's generateLessonController write. Paired
        // with handleStatus below which clears both on completion.
        const lessonStamp = { moduleIndex: event.moduleIndex, lessonIndex: event.lessonIndex };
        queryClient.setQueriesData<Course>(
          { queryKey: [QKeys.COURSE], predicate: (q) => (q.state.data as Course | undefined)?._id === event.courseId },
          (old) => (old ? { ...old, activeJobId: event.jobId, activeLesson: lessonStamp } : old!),
        );
        queryClient.setQueryData<Course[]>([QKeys.COURSES], (old) =>
          old?.map((c) => (c._id === event.courseId ? { ...c, activeJobId: event.jobId, activeLesson: lessonStamp } : c)),
        );
      }
    };

    // Job completion/failure
    const handleStatus = (event: JobStatusEvent) => {

      // Fire onComplete callback only on success (wizard flows) and clean up timer
      const entry = callbacksRef.current.get(event.jobId);

      // Suppress generic success toast when a tracked callback exists (the caller handles its own UX)
      if (event.status === 'completed') {
        if (entry) {
          entry.callback();
        } else {
          // Centralized router: every WS-driven generation that lands
          // content on a specific user-visible page gets a toast with a
          // CTA that opens that page. When the user is ALREADY on that
          // page, suppress the toast entirely — the content stream/
          // refetch will surface the new state inline. Wizard-only jobs
          // (clarify, generate_structure, refine_structure,
          // generate_depth_previews) hit the `entry.callback()` branch
          // above because they're tracked by the screen that initiated
          // them; falling through here means a non-routable completion,
          // so we stay silent.
          const completion = buildCompletionToast({
            event,
            findCourseSlug,
          });
          if (completion && pathnameRef.current !== completion.targetPath) {
            toast(completion.message, {
              action: {
                label: completion.actionLabel,
                onClick: () => router.push(completion.targetPath),
              },
            });
          }
        }
      } else if (event.status === 'failed') {
        // Race-loss path: requireCredits passed at request time but the
        // in-runner re-check at submitJob lost — surface the same modal
        // the synchronous 402 path uses instead of a generic toast.
        // The errorCode/errorMeta fields land on the FE type only after
        // `yarn codegen`; until then we read them through a structural
        // cast so the runtime check still works.
        const failed = event as JobStatusEvent & {
          errorCode?: string;
          errorMeta?: { need?: number; have?: number } | Record<string, unknown>;
        };
        if (failed.errorCode === 'INSUFFICIENT_CREDITS') {
          const meta = failed.errorMeta as { need?: number; have?: number } | undefined;
          fireInsufficientCredits({
            need: typeof meta?.need === 'number' ? meta.need : 0,
            have: typeof meta?.have === 'number' ? meta.have : 0,
          });
        } else {
          toast.error(toastMessage({ dynamic: event.error, fallback: TOASTS.GENERATION_FAILED_RETRY }));
        }
      }
      if (entry) callbacksRef.current.delete(event.jobId);

      // Clear generating lesson tracking
      if (event.type === 'generate_lesson') {
        setGeneratingLesson(null);
      }

      // Always remove from active set — cleanupJob only handles jobs with onComplete entries
      setActiveCourseIds((prev) => {
        const next = new Set(prev);
        next.delete(event.courseId);
        return next;
      });

      // Optimistically clear activeJobId + activeLesson in cache, then
      // refetch. Mirrors what jobRunner.processJob's finally writes on
      // the server. Missing the activeLesson clear previously let the
      // LessonStream provider's rehydration effect re-seed an `active`
      // stream from the stale cache after it had just been cleared by
      // handleStatus, leaving the generating indicator stuck.
      // Course cache is keyed by slug (from URL), but WS events use ObjectId.
      // Use setQueriesData with predicate to match by _id inside the cached data.
      queryClient.setQueriesData<Course>(
        { queryKey: [QKeys.COURSE], predicate: (q) => (q.state.data as Course | undefined)?._id === event.courseId },
        (old) => (old ? { ...old, activeJobId: undefined, activeLesson: null } : old!),
      );
      queryClient.setQueryData<Course[]>([QKeys.COURSES], (old) =>
        old?.map((c) => (c._id === event.courseId ? { ...c, activeJobId: undefined, activeLesson: null } : c)),
      );
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSE] });
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });

      // Invalidate content caches when lesson generation completes or fails
      if (event.status === 'completed' || event.status === 'failed') {
        if (event.type === 'generate_lesson') {
          queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT] });
          queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS] });
          // Lesson generation may also have produced recall cards
          // (`includeRecallCards`); refresh the queue surfaces so the
          // RecallScreen / due-count badge pick up the new ones without
          // requiring a manual reload.
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_QUEUE] });
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_STATS] });
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_DUE_COUNT] });
        }
        if (event.type === 'regenerate_hero' || event.type === 'regenerate_links') {
          queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT] });
        }
        if (event.type === 'regenerate_recall') {
          // Lesson content holds `recallCardCount`, which drives the
          // RecallStatusPanel; the recall queue/stats/due-count are now
          // populated with the fresh cards.
          queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT] });
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_QUEUE] });
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_STATS] });
          queryClient.invalidateQueries({ queryKey: [QKeys.RECALL_DUE_COUNT] });
        }
        if (event.type === 'lesson_narration') {
          // Refetch the lesson so the freshly-set audioUrl flows in.
          queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT] });
        }
        if (event.type === 'generate_module_quiz') {
          queryClient.invalidateQueries({ queryKey: [QKeys.MODULE_QUIZ_CONTENT] });
        }
      }
    };

    socket.on('job:started', handleStarted);
    socket.on('job:status', handleStatus);
    return () => {
      socket.off('job:started', handleStarted);
      socket.off('job:status', handleStatus);
    };
  }, [socket, queryClient, cleanupJob, router, findCourseSlug]);

  // On socket reconnect, reconcile with server state unconditionally. The
  // old guard bailed when `activeCourseIdsRef` was empty, which meant a
  // freshly-reloaded tab never re-synced even though the server could have
  // had an `activeJobId` set from a stream that was just torn down by the
  // reload. Always invalidating lets the lesson indicator settle correctly.
  useEffect(() => {
    if (!socket) return;

    const handleConnect = async () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSE] });

      // Check if any tracked jobs completed while disconnected and fire their callbacks
      for (const [jobId, entry] of callbacksRef.current) {
        try {
          const job = await getJobStatus(jobId);
          if (job.status === 'completed' || job.status === 'failed') {
            if (job.status === 'completed') entry.callback();
            cleanupJob(jobId);
          }
        } catch {
          // Job not found or network error — leave the entry; the next
          // job:status socket event will resolve it.
        }
      }
    };

    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [socket, queryClient, cleanupJob]);

  // Stable identity. `trackJob` + `isJobRunningForCourse` are useCallback-wrapped
  // above; `setGeneratingLesson` is React's stable setter; `generatingLesson`
  // is the only changing dep, so consumers re-render only when it actually
  // flips. Without useMemo, the entire authed tree re-rendered on every
  // parent render of JobManagerProvider.
  const value = useMemo(
    () => ({ trackJob, isJobRunningForCourse, generatingLesson, setGeneratingLesson }),
    [trackJob, isJobRunningForCourse, generatingLesson],
  );

  return <JobManagerContext.Provider value={value}>{children}</JobManagerContext.Provider>;
};

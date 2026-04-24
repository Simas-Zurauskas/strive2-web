'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { generateLesson, PlaceholderBlock, LessonProgressEvent } from '@/api/routes/course';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { QKeys } from '@/types';
import { useJobManager } from './useJobManager';
import { useSocket } from './useSocket';
import type { Course, LessonBlock } from '@/api/types';

type StreamPhase = 'idle' | 'streaming' | 'finishing';

interface ActiveStream {
  jobId: string | null; // null while the POST is in flight
  courseId: string;
  courseObjectId: string;
  moduleIndex: number;
  lessonIndex: number;
  phase: Exclude<StreamPhase, 'idle'>;
  blocks: LessonBlock[];
  image: string | null;
  isStarting: boolean;
  placeholders: PlaceholderBlock[];
}

interface StartStreamParams {
  courseId: string;
  courseObjectId: string;
  moduleIndex: number;
  lessonIndex: number;
  includeImage: boolean;
  includeLinks: boolean;
}

interface LessonStreamContextValue {
  active: ActiveStream | null;
  start: (params: StartStreamParams) => Promise<void>;
  includeImage: boolean;
  includeLinks: boolean;
  setIncludeImage: (value: boolean) => void;
  setIncludeLinks: (value: boolean) => void;
}

interface JobProgressEvent {
  jobId: string;
  courseId: string;
  type: string;
  moduleIndex?: number;
  lessonIndex?: number;
  event: LessonProgressEvent;
}

interface JobStartedEvent {
  jobId: string;
  courseId: string;
  type: string;
  moduleIndex?: number;
  lessonIndex?: number;
}

interface JobStatusEvent {
  jobId: string;
  status: 'completed' | 'failed';
  courseId: string;
  type: string;
  moduleIndex?: number;
  lessonIndex?: number;
  error?: string | null;
}

const LessonStreamContext = createContext<LessonStreamContextValue | null>(null);

// Provider lives at the Registry level so the active-stream state survives
// in-app navigation (lesson→lesson, route changes). The old SSE
// implementation also had to stay alive across navigations for the same
// reason — but it was further load-bearing because a torn-down fetch
// aborted the agent. Under the job-runner path the agent is fully
// detached from this provider's lifecycle; the provider is just a
// per-tab mirror of the server-side job's live progress. A full page
// reload will tear down the provider, which is now fine: we rehydrate
// from `course.activeJobId` + the LessonContent document when the new
// provider mounts, and the live stream continues via `job:progress`.
export const LessonStreamProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { setGeneratingLesson } = useJobManager();
  const { socket } = useSocket();
  const [active, setActive] = useState<ActiveStream | null>(null);

  const [includeImage, setIncludeImageState] = useState(() =>
    typeof window === 'undefined' ? true : localStorage.getItem('gen_includeImage') !== 'false',
  );
  const [includeLinks, setIncludeLinksState] = useState(() =>
    typeof window === 'undefined' ? true : localStorage.getItem('gen_includeLinks') !== 'false',
  );

  const setIncludeImage = (value: boolean) => {
    setIncludeImageState(value);
    localStorage.setItem('gen_includeImage', String(value));
  };

  const setIncludeLinks = (value: boolean) => {
    setIncludeLinksState(value);
    localStorage.setItem('gen_includeLinks', String(value));
  };

  // Merge a single progress event into the active stream. Caller guarantees
  // the event belongs to the currently-tracked lesson.
  const applyProgressEvent = useCallback((event: LessonProgressEvent) => {
    setActive((prev) => {
      if (!prev) return prev;
      switch (event.type) {
        case 'block': {
          // De-dup by id — the debounced DB save may have seeded the same
          // block from LessonContent on reload just before the live event
          // arrived. Last-write-wins on content in that case.
          const existingIdx = prev.blocks.findIndex((b) => b.id === event.block.id);
          const nextBlocks =
            existingIdx >= 0
              ? prev.blocks.map((b, i) => (i === existingIdx ? event.block : b))
              : [...prev.blocks, event.block];
          const isInteractive = event.block.type === 'quiz' || event.block.type === 'exercise';
          const nextPlaceholders = isInteractive
            ? (() => {
                const idx = prev.placeholders.findIndex((p) => p.type === event.block.type);
                return idx >= 0 ? prev.placeholders.filter((_, i) => i !== idx) : prev.placeholders;
              })()
            : prev.placeholders;
          return { ...prev, isStarting: false, blocks: nextBlocks, placeholders: nextPlaceholders };
        }
        case 'hero_image':
          return { ...prev, image: event.url };
        case 'content_ready':
          return { ...prev, phase: 'finishing', placeholders: event.placeholders };
        case 'insight':
        case 'insights_saved':
          // No UI affordance yet — server-side persistence is the only
          // contract. Kept in the event union so future side-panels can
          // render incoming cards live without a protocol change.
          return prev;
        default:
          return prev;
      }
    });
  }, []);

  // Live progress: merge every `job:progress` event for a `generate_lesson`
  // job into `active`. Filters by type so quiz/clarify jobs never bleed
  // into the lesson viewer state.
  useEffect(() => {
    if (!socket) return;

    const handleProgress = (event: JobProgressEvent) => {
      if (event.type !== 'generate_lesson') return;
      const evModule = event.moduleIndex ?? 0;
      const evLesson = event.lessonIndex ?? 0;

      setActive((prev) => {
        // Hydrate-on-first-event: reloaded tab subscribed before the
        // provider's own rehydrate effect landed. Synthesize an active
        // slot from the event so subsequent blocks accumulate correctly.
        if (!prev) {
          return {
            jobId: event.jobId,
            courseId: event.courseId,
            courseObjectId: event.courseId,
            moduleIndex: evModule,
            lessonIndex: evLesson,
            phase: 'streaming',
            blocks: [],
            image: null,
            isStarting: false,
            placeholders: [],
          };
        }
        // Drop cross-lesson deliveries (stale pubsub, second-tab races).
        if (prev.moduleIndex !== evModule || prev.lessonIndex !== evLesson) return prev;
        return prev;
      });
      applyProgressEvent(event.event);
    };

    socket.on('job:progress', handleProgress);
    return () => {
      socket.off('job:progress', handleProgress);
    };
  }, [socket, applyProgressEvent]);

  // Live lifecycle: when a lesson-gen job completes/fails, clear the
  // active-stream state and invalidate caches. `useJobManager` already
  // handles toasts, cache invalidation for LessonContent, and the
  // generatingLesson flag — this hook only needs to clear *our* local
  // provider state.
  useEffect(() => {
    if (!socket) return;

    const handleStatus = (event: JobStatusEvent) => {
      if (event.type !== 'generate_lesson') return;
      // Clear local stream state. Toasts + LessonContent cache
      // invalidation are handled globally by useJobManager.
      setActive((prev) => {
        if (!prev) return prev;
        if (event.jobId !== prev.jobId && prev.jobId !== null) return prev;
        return null;
      });
    };

    const handleStarted = (event: JobStartedEvent) => {
      if (event.type !== 'generate_lesson') return;
      // If a different tab started a lesson-gen, mirror it into local
      // state so the UI reflects the in-flight generation even though
      // this tab didn't click Generate itself. The corresponding
      // `job:progress` events will fill blocks as the agent advances.
      setActive((prev) => {
        if (prev) return prev;
        return {
          jobId: event.jobId,
          courseId: event.courseId,
          courseObjectId: event.courseId,
          moduleIndex: event.moduleIndex ?? 0,
          lessonIndex: event.lessonIndex ?? 0,
          phase: 'streaming',
          blocks: [],
          image: null,
          isStarting: false,
          placeholders: [],
        };
      });
    };

    socket.on('job:status', handleStatus);
    socket.on('job:started', handleStarted);
    return () => {
      socket.off('job:status', handleStatus);
      socket.off('job:started', handleStarted);
    };
  }, [socket]);

  // Reload hydration: seed `active` from `course.activeLesson` the instant
  // a Course query lands in the cache. No async round-trip — activeLesson
  // is a durable server fact stamped by generateLessonController and
  // cleared by the job runner's finally, so it's correct the moment
  // /course returns.
  useEffect(() => {
    if (active) return;
    // Require BOTH activeJobId AND activeLesson to be truthy. useJobManager
    // optimistically clears activeJobId before the course refetch lands; if
    // we only checked activeLesson, a job-completion status event could
    // race: setActive(null) would trigger this effect, which would then
    // re-seed from a cache whose activeJobId was already cleared but whose
    // activeLesson still lingered from the previous state. Requiring both
    // makes the rehydration condition identical to "a lesson-gen is
    // genuinely in flight for this course right now".
    const findCourseWithActiveLesson = () => {
      const hasActive = (c: Course | undefined): c is Course =>
        !!c && !!c.activeJobId && !!c.activeLesson;
      const fromList = queryClient.getQueryData<Course[]>([QKeys.COURSES])?.find(hasActive);
      if (fromList) return fromList;
      return queryClient
        .getQueriesData<Course>({ queryKey: [QKeys.COURSE] })
        .map(([, data]) => data)
        .find(hasActive);
    };
    const seed = (course: Course) => {
      if (!course.activeLesson) return;
      setActive({
        jobId: course.activeJobId ?? null,
        courseId: course._id,
        courseObjectId: course._id,
        moduleIndex: course.activeLesson.moduleIndex,
        lessonIndex: course.activeLesson.lessonIndex,
        phase: 'streaming',
        blocks: [],
        image: null,
        isStarting: false,
        placeholders: [],
      });
      setGeneratingLesson({
        courseId: course._id,
        moduleIndex: course.activeLesson.moduleIndex,
        lessonIndex: course.activeLesson.lessonIndex,
      });
    };
    const found = findCourseWithActiveLesson();
    if (found) {
      seed(found);
      return;
    }
    // Course cache may populate after mount (first GET /course resolving
    // post-login, post-navigation). Subscribe to cache updates and seed
    // lazily when a matching course lands.
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      if (active) return;
      const c = findCourseWithActiveLesson();
      if (c) seed(c);
    });
    return unsubscribe;
  }, [active, queryClient, setGeneratingLesson]);

  const start = useCallback(
    async (params: StartStreamParams) => {
      setActive({
        jobId: null,
        courseId: params.courseId,
        courseObjectId: params.courseObjectId,
        moduleIndex: params.moduleIndex,
        lessonIndex: params.lessonIndex,
        phase: 'streaming',
        blocks: [],
        image: null,
        isStarting: true,
        placeholders: [],
      });
      setGeneratingLesson({
        courseId: params.courseObjectId,
        moduleIndex: params.moduleIndex,
        lessonIndex: params.lessonIndex,
      });

      try {
        const { jobId } = await generateLesson({
          courseId: params.courseId,
          moduleIndex: params.moduleIndex,
          lessonIndex: params.lessonIndex,
          includeImage: params.includeImage,
          includeLinks: params.includeLinks,
        });
        setActive((prev) => (prev ? { ...prev, jobId, isStarting: false } : prev));
      } catch (err: unknown) {
        setActive(null);
        setGeneratingLesson(null);
        const msg =
          err instanceof Error ? err.message : typeof err === 'string' ? err : TOASTS.GENERATION_FAILED;
        toast.error(toastMessage({ dynamic: msg, fallback: TOASTS.GENERATION_FAILED }));
      }
    },
    [setGeneratingLesson],
  );

  return (
    <LessonStreamContext.Provider
      value={{ active, start, includeImage, includeLinks, setIncludeImage, setIncludeLinks }}
    >
      {children}
    </LessonStreamContext.Provider>
  );
};

interface UseLessonStreamParams {
  courseId: string;
  courseObjectId: string | undefined;
  moduleIndex: number;
  lessonIndex: number;
  isGenerationRunning: boolean;
}

export const useLessonStream = (params: UseLessonStreamParams) => {
  const ctx = useContext(LessonStreamContext);
  if (!ctx) throw new Error('useLessonStream must be used within LessonStreamProvider');
  const { generatingLesson } = useJobManager();

  const { active, start, includeImage, includeLinks, setIncludeImage, setIncludeLinks } = ctx;

  const isActiveForThis =
    !!active &&
    (active.courseId === params.courseId || active.courseObjectId === params.courseObjectId) &&
    active.moduleIndex === params.moduleIndex &&
    active.lessonIndex === params.lessonIndex;

  const streamPhase: StreamPhase = isActiveForThis ? active!.phase : 'idle';
  const streamBlocks = isActiveForThis ? active!.blocks : [];
  const streamImage = isActiveForThis ? active!.image : null;
  const isStarting = isActiveForThis ? active!.isStarting : false;
  const placeholders = isActiveForThis ? active!.placeholders : [];

  const isStreaming = streamPhase !== 'idle';
  const isActivelyGenerating = streamPhase === 'streaming';

  // The parent (LessonScreen) reads `course.activeLesson` and passes down
  // `isThisLessonGenerating`, so this hook only needs to signal the
  // local-stream variant. The viewer OR-merges the two sources — one of
  // them is always accurate:
  //   • local `isStreaming` covers the "this tab owns the live stream"
  //     case (fresh Generate click, same-tab navigation back to the
  //     in-flight lesson).
  //   • parent prop covers the server-authoritative case (cross-tab,
  //     full-page reload, anywhere the provider hasn't yet caught up).
  // Dropping the old `isGenerationRunning && !lessonCompleted` reload
  // fallback also fixes a sibling-lesson bug: `isGenerationRunning` is
  // course-wide, so a sibling viewer used to render the generating
  // indicator whenever any lesson in the course was generating.
  const isThisLessonGenerating = isStreaming;
  const isAnyLessonGenerating = !!generatingLesson || params.isGenerationRunning || !!active;

  const handleGenerate = useCallback(async () => {
    if (isStreaming || isStarting) return;
    if (!params.courseObjectId) return;
    await start({
      courseId: params.courseId,
      courseObjectId: params.courseObjectId,
      moduleIndex: params.moduleIndex,
      lessonIndex: params.lessonIndex,
      includeImage,
      includeLinks,
    });
  }, [
    isStreaming,
    isStarting,
    start,
    params.courseId,
    params.courseObjectId,
    params.moduleIndex,
    params.lessonIndex,
    includeImage,
    includeLinks,
  ]);

  return {
    streamPhase,
    streamBlocks,
    streamImage,
    isStarting,
    placeholders,
    isStreaming,
    isActivelyGenerating,
    isThisLessonGenerating,
    isAnyLessonGenerating,
    includeImage,
    includeLinks,
    handleIncludeImage: setIncludeImage,
    handleIncludeLinks: setIncludeLinks,
    handleGenerate,
  };
};

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getJobStatus } from '@/api/routes/course';
import { Course } from '@/api/types';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { QKeys } from '@/types';
import { useSocket } from './useSocket';

interface TrackJobParams {
  jobId: string;
  courseId: string;
  type: string;
  onComplete?: () => void;
}

interface JobManagerContextValue {
  trackJob: (job: TrackJobParams) => void;
  isJobRunningForCourse: (courseId: string) => boolean;
}

interface JobStartedEvent {
  jobId: string;
  courseId: string;
  type: string;
}

interface JobStatusEvent {
  jobId: string;
  status: 'completed' | 'failed';
  error?: string | null;
  courseId: string;
  type: string;
}

const JobManagerContext = createContext<JobManagerContextValue | null>(null);

export const useJobManager = () => {
  const ctx = useContext(JobManagerContext);
  if (!ctx) throw new Error('useJobManager must be used within JobManagerProvider');
  return ctx;
};

const JOB_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const JobManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const callbacksRef = useRef<
    Map<string, { callback: () => void; courseId: string; timer: ReturnType<typeof setTimeout> }>
  >(new Map());
  // Local set for instant reactivity (before query cache updates with activeJobId)
  const [activeCourseIds, setActiveCourseIds] = useState<Set<string>>(new Set());

  // Clean up a tracked job entry
  const cleanupJob = useCallback((jobId: string) => {
    const entry = callbacksRef.current.get(jobId);
    if (entry) {
      clearTimeout(entry.timer);
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
  const trackJob = useCallback(
    (job: TrackJobParams) => {
      console.log('[JobManager] Tracking job:', job.jobId, 'type:', job.type, 'courseId:', job.courseId);

      // Clear any existing entry for this job
      const existing = callbacksRef.current.get(job.jobId);
      if (existing) clearTimeout(existing.timer);

      // Auto-cleanup after timeout to prevent stuck state
      const timer = setTimeout(() => {
        console.warn('[JobManager] Job timed out on client:', job.jobId);
        toast.error(TOASTS.JOB_TIMEOUT);
        callbacksRef.current.delete(job.jobId);
        setActiveCourseIds((prev) => {
          const next = new Set(prev);
          next.delete(job.courseId);
          return next;
        });
        queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, job.courseId] });
        queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      }, JOB_TIMEOUT_MS);

      if (job.onComplete) {
        callbacksRef.current.set(job.jobId, { callback: job.onComplete, courseId: job.courseId, timer });
      }
      setActiveCourseIds((prev) => new Set(prev).add(job.courseId));
    },
    [queryClient],
  );

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
      console.log('[JobManager] Job started (WS):', event.jobId, event.type);
      setActiveCourseIds((prev) => new Set(prev).add(event.courseId));
    };

    // Job completion/failure
    const handleStatus = (event: JobStatusEvent) => {
      console.log('[JobManager] Job status (WS):', event.jobId, event.status);

      // Fire onComplete callback only on success (wizard flows) and clean up timer
      const entry = callbacksRef.current.get(event.jobId);

      // Suppress generic success toast when a tracked callback exists (the caller handles its own UX)
      if (event.status === 'completed') {
        if (entry) {
          clearTimeout(entry.timer);
          entry.callback();
        } else {
          toast.success(TOASTS.GENERATION_COMPLETE);
        }
      } else if (event.status === 'failed') {
        if (entry) clearTimeout(entry.timer);
        toast.error(toastMessage(event.error, TOASTS.GENERATION_FAILED_RETRY));
      }
      if (entry) callbacksRef.current.delete(event.jobId);

      // Always remove from active set — cleanupJob only handles jobs with onComplete entries
      setActiveCourseIds((prev) => {
        const next = new Set(prev);
        next.delete(event.courseId);
        return next;
      });

      // Optimistically clear activeJobId in cache, then refetch
      queryClient.setQueryData<Course>([QKeys.COURSE, event.courseId], (old) =>
        old ? { ...old, activeJobId: undefined } : old,
      );
      queryClient.setQueryData<Course[]>([QKeys.COURSES], (old) =>
        old?.map((c) => (c._id === event.courseId ? { ...c, activeJobId: undefined } : c)),
      );
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, event.courseId] });
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });

      // Invalidate content caches when specific job types complete
      if (event.status === 'completed') {
        if (event.type === 'generate_lesson') {
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
  }, [socket, queryClient, cleanupJob]);

  // Stable ref for reconnect handler to avoid re-registering on every activeCourseIds change
  const activeCourseIdsRef = useRef(activeCourseIds);
  useEffect(() => {
    activeCourseIdsRef.current = activeCourseIds;
  }, [activeCourseIds]);

  // On socket reconnect, reconcile local tracking with server state
  useEffect(() => {
    if (!socket) return;

    const handleConnect = async () => {
      const tracked = activeCourseIdsRef.current;
      if (tracked.size === 0) return;

      console.log('[JobManager] Socket reconnected, reconciling active courses');

      // Refetch courses to get current activeJobId values
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      for (const courseId of tracked) {
        queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
      }

      // Check if any tracked jobs completed while disconnected and fire their callbacks
      for (const [jobId, entry] of callbacksRef.current) {
        try {
          const job = await getJobStatus(jobId);
          if (job.status === 'completed' || job.status === 'failed') {
            clearTimeout(entry.timer);
            if (job.status === 'completed') entry.callback();
            cleanupJob(jobId);
          }
        } catch {
          // Job not found or network error — cleanup will happen via timeout
        }
      }
    };

    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [socket, queryClient, cleanupJob]);

  return (
    <JobManagerContext.Provider value={{ trackJob, isJobRunningForCourse }}>{children}</JobManagerContext.Provider>
  );
};

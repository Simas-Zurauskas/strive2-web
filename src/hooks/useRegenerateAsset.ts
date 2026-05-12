'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { regenerateHero, regenerateLinks, regenerateRecall } from '@/api/routes/course';
import { useJobManager } from './useJobManager';

interface RegenerateParams {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
}

const useRegenerateAsset = ({
  mutationFn,
  jobType,
  errorMessage,
}: {
  mutationFn: (params: RegenerateParams) => Promise<{ jobId: string }>;
  jobType: 'regenerate_hero' | 'regenerate_links' | 'regenerate_recall';
  errorMessage: string;
}) => {
  const { trackJob, isJobRunningForCourse } = useJobManager();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [trackedCourseId, setTrackedCourseId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn,
    meta: { errorMessage },
  });

  const regenerate = useCallback(
    async (params: RegenerateParams) => {
      setIsRegenerating(true);
      setTrackedCourseId(params.courseId);
      try {
        const { jobId } = await mutation.mutateAsync(params);
        trackJob({
          jobId,
          courseId: params.courseId,
          type: jobType,
          onComplete: () => setIsRegenerating(false),
        });
      } catch {
        setIsRegenerating(false);
        setTrackedCourseId(null);
      }
    },
    [mutation, trackJob, jobType],
  );

  // Reset `isRegenerating` if the job manager reports the job has cleared
  // (covers the failed-job path — trackJob's onComplete only fires on success).
  const isJobRunning = trackedCourseId ? isJobRunningForCourse(trackedCourseId) : false;
  useEffect(() => {
    if (isRegenerating && !isJobRunning && !mutation.isPending) {
      setIsRegenerating(false); // eslint-disable-line react-hooks/set-state-in-effect
      setTrackedCourseId(null);
    }
  }, [isRegenerating, isJobRunning, mutation.isPending]);

  return { regenerate, isRegenerating };
};

export const useRegenerateHero = () =>
  useRegenerateAsset({
    mutationFn: regenerateHero,
    jobType: 'regenerate_hero',
    errorMessage: 'Failed to start hero image generation',
  });

export const useRegenerateLinks = () =>
  useRegenerateAsset({
    mutationFn: regenerateLinks,
    jobType: 'regenerate_links',
    errorMessage: 'Failed to start resources generation',
  });

export const useRegenerateRecall = () =>
  useRegenerateAsset({
    mutationFn: regenerateRecall,
    jobType: 'regenerate_recall',
    errorMessage: 'Failed to generate recall cards',
  });

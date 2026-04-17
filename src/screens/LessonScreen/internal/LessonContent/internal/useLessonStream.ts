import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { streamLesson, PlaceholderBlock } from '@/api/routes/course';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { useJobManager } from '@/hooks';
import { QKeys } from '@/types';
import type { Course, LessonBlock } from '@/api/types';

interface UseLessonStreamParams {
  courseId: string;
  courseObjectId: string | undefined;
  moduleIndex: number;
  lessonIndex: number;
  isGenerationRunning: boolean;
  hasContent: boolean;
  lessonCompleted: boolean;
}

export const useLessonStream = ({
  courseId,
  courseObjectId,
  moduleIndex,
  lessonIndex,
  isGenerationRunning,
  hasContent,
  lessonCompleted,
}: UseLessonStreamParams) => {
  const queryClient = useQueryClient();
  const { generatingLesson, setGeneratingLesson } = useJobManager();

  // Use both sources: WS-based generatingLesson (instant) + server activeJobId (survives reload)
  const isAnyLessonGenerating = !!generatingLesson || isGenerationRunning;

  // Streaming state — 'streaming' = content generating, 'finishing' = interactive + links pending
  const [streamPhase, setStreamPhase] = useState<'idle' | 'streaming' | 'finishing'>('idle');
  const [streamBlocks, setStreamBlocks] = useState<LessonBlock[]>([]);
  const [streamImage, setStreamImage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [placeholders, setPlaceholders] = useState<PlaceholderBlock[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  // Abort any in-flight stream when the component unmounts (lesson change or navigation)
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const isStreaming = streamPhase !== 'idle';
  const isActivelyGenerating = streamPhase === 'streaming';
  // True when THIS specific lesson is being generated
  const reloadFallback =
    !generatingLesson && isGenerationRunning && hasContent && !lessonCompleted;
  const isThisLessonGenerating = isStreaming || reloadFallback;

  // Generation options (persisted to localStorage)
  const [includeImage, setIncludeImage] = useState(() => localStorage.getItem('gen_includeImage') !== 'false');
  const [includeLinks, setIncludeLinks] = useState(() => localStorage.getItem('gen_includeLinks') !== 'false');

  const handleIncludeImage = (v: boolean) => {
    setIncludeImage(v);
    localStorage.setItem('gen_includeImage', String(v));
  };

  const handleIncludeLinks = (v: boolean) => {
    setIncludeLinks(v);
    localStorage.setItem('gen_includeLinks', String(v));
  };

  const handleGenerate = useCallback(async () => {
    if (isStreaming || isStarting) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Optimistically track which lesson is generating (before WS event arrives)
    if (courseObjectId) {
      setGeneratingLesson({ courseId: courseObjectId, moduleIndex, lessonIndex });
    }

    setIsStarting(true);
    setStreamBlocks([]);
    setStreamImage(null);
    setPlaceholders([]);

    try {
      setStreamPhase('streaming');
      setIsStarting(false);

      await streamLesson({
        courseId,
        moduleIndex,
        lessonIndex,
        includeImage,
        includeLinks,
        signal: controller.signal,
        onEvent: (event) => {
          // Drop events that arrive after unmount / lesson change to avoid
          // stale renders of the old lesson's stream content.
          if (controller.signal.aborted) return;
          switch (event.type) {
            case 'block':
              setStreamBlocks((prev) => [...prev, event.block]);
              if (event.block.type === 'quiz' || event.block.type === 'exercise') {
                setPlaceholders((prev) => {
                  const idx = prev.findIndex((p) => p.type === event.block.type);
                  return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev;
                });
              }
              break;
            case 'blocks':
              setStreamBlocks((prev) => [...prev, ...event.blocks]);
              break;
            case 'hero_image':
              setStreamImage(event.url);
              break;
            case 'content_ready':
              setStreamPhase('finishing');
              setPlaceholders(event.placeholders);
              break;
            case 'complete':
              setStreamPhase('idle');
              setPlaceholders([]);
              setGeneratingLesson(null);
              queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
                old ? { ...old, activeJobId: undefined } : old,
              );
              queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
              queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS, courseId] });
              queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
              break;
            case 'error':
              setStreamPhase('idle');
              setPlaceholders([]);
              setGeneratingLesson(null);
              queryClient.setQueryData<Course>([QKeys.COURSE, courseId], (old) =>
                old ? { ...old, activeJobId: undefined } : old,
              );
              queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, courseId] });
              queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex] });
              queryClient.invalidateQueries({ queryKey: [QKeys.GENERATED_LESSONS, courseId] });
              toast.error(toastMessage(event.message, TOASTS.GENERATION_FAILED));
              break;
          }
        },
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setStreamPhase('idle');
      setIsStarting(false);
      setPlaceholders([]);
      toast.error(TOASTS.GENERATION_FAILED);
    }
  }, [courseId, courseObjectId, moduleIndex, lessonIndex, isStreaming, isStarting, includeImage, includeLinks, queryClient, setGeneratingLesson]);

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
    handleIncludeImage,
    handleIncludeLinks,
    handleGenerate,
  };
};

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import type { JobProgressEvent, SourceDocumentStatus } from '@/api/types';

export interface LiveDocumentStatus {
  status: SourceDocumentStatus;
  warnings?: string[];
}

/**
 * Live per-document status map for the wizard's Sources step.
 *
 * Subscribes to the shared `job:progress` socket channel (the same one
 * `useLessonStream` consumes) but filtered to `ingest_documents` /
 * `prepare_corpus` jobs for this course, and to their `document_status`
 * event variant. Kept as its own lightweight hook rather than widening
 * `useLessonStream`'s generate_lesson filter — the two consumers share a
 * transport, not a state shape.
 *
 * Entries are keyed by documentId and overwrite on every event; `reset`
 * clears the map (call it when a fresh ingest run starts so stale chips
 * from the previous run don't linger).
 */
export const useDocumentStatuses = (courseId: string | null) => {
  const { socket } = useSocket();
  const [statuses, setStatuses] = useState<Record<string, LiveDocumentStatus>>({});

  useEffect(() => {
    if (!socket || !courseId) return;

    const handleProgress = (event: JobProgressEvent) => {
      if (event.courseId !== courseId) return;
      if (event.type !== 'ingest_documents' && event.type !== 'prepare_corpus') return;
      const inner = event.event;
      if (inner.type !== 'document_status') return;
      setStatuses((prev) => ({
        ...prev,
        [inner.documentId]: { status: inner.status, warnings: inner.warnings },
      }));
    };

    socket.on('job:progress', handleProgress);
    return () => {
      socket.off('job:progress', handleProgress);
    };
  }, [socket, courseId]);

  const reset = useCallback(() => setStatuses({}), []);

  return { statuses, reset };
};

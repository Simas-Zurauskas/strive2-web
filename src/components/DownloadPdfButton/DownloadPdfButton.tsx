'use client';

import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { getCoursePdf, getLessonPdf } from '@/api/routes/course';
import { analytics } from '@/lib/analytics';
import { exportFilename, saveBlob } from '@/lib/saveBlob';
import * as S from './DownloadPdfButton.styles';

type Target =
  | { kind: 'lesson'; courseId: string; moduleIndex: number; lessonIndex: number; lessonName: string; courseName: string }
  | { kind: 'course'; courseId: string; courseName: string };

interface DownloadPdfButtonProps {
  target: Target;
  label?: string;
}

/**
 * Downloads a lesson or a whole course as a PDF.
 *
 * The blob is saved through `saveBlob`, which sets `a.download` — a `blob:`
 * URL carries no `Content-Disposition`, so without that the file would land
 * under a UUID no matter what the server named it.
 */
export const DownloadPdfButton = ({ target, label }: DownloadPdfButtonProps) => {
  const mutation = useMutation({
    mutationFn: () =>
      target.kind === 'lesson'
        ? getLessonPdf({
            courseId: target.courseId,
            moduleIndex: target.moduleIndex,
            lessonIndex: target.lessonIndex,
          })
        : getCoursePdf({ courseId: target.courseId }),
    onSuccess: (blob) => {
      saveBlob({
        blob,
        filename: exportFilename({
          parts:
            target.kind === 'lesson'
              ? [target.courseName, target.lessonName]
              : [target.courseName],
          extension: 'pdf',
          fallback: target.kind === 'lesson' ? 'strive-lesson' : 'strive-course',
        }),
      });
      analytics.track('pdf_downloaded', {
        course_id: target.courseId,
        scope: target.kind,
        ...(target.kind === 'lesson' && {
          lesson_id: `${target.courseId}-${target.moduleIndex}-${target.lessonIndex}`,
        }),
      });
    },
    onError: (err: unknown) => {
      const status = (err as { status?: number })?.status;
      toast.error(
        status === 429
          ? 'You have downloaded a lot of PDFs recently — try again shortly.'
          : 'Could not build the PDF. Please try again.',
      );
    },
  });

  const defaultLabel = target.kind === 'lesson' ? 'Download PDF' : 'Download course PDF';

  return (
    <S.Button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-label={defaultLabel}
    >
      <Download />
      {mutation.isPending ? 'Preparing…' : (label ?? defaultLabel)}
    </S.Button>
  );
};

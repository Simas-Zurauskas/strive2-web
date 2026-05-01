import { client } from '@/api/client';
import type { paths } from '@/api/_generated';

/**
 * Mentor-attachment upload + persist.
 *
 * Multipart POST to `/course/:courseId/lesson/:moduleIndex/:lessonIndex/mentor/attachment`.
 * The server extracts text, dedupes against the chat session, enforces
 * the 5-files / 120K-tokens caps, persists on the LessonMentorChat doc,
 * and returns metadata only — never the extracted text. Subsequent chat
 * turns refer to the attachment by id; the model sees the content via a
 * cached system block built server-side.
 *
 * Setting `Content-Type: undefined` is required: axios's default
 * `application/json` would otherwise override the FormData boundary the
 * browser sets automatically, breaking multipart parsing on the server.
 */

type AttachAttachmentResponse =
  paths['/api/course/{courseId}/lesson/{moduleIndex}/{lessonIndex}/mentor/attachment']['post']['responses']['200']['content']['application/json'];

export const attachAttachment = ({
  courseId,
  moduleIndex,
  lessonIndex,
  file,
}: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  file: File;
}) => {
  const form = new FormData();
  form.append('file', file);

  return client<AttachAttachmentResponse>({
    url: `/course/${courseId}/lesson/${moduleIndex}/${lessonIndex}/mentor/attachment`,
    method: 'POST',
    data: form,
    headers: { 'Content-Type': undefined as unknown as string },
  }).then((res) => res.data.data);
};

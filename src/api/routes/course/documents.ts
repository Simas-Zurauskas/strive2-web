import { paths } from '@/api/_generated';
import { client } from '@/api/client';

/**
 * Course-from-documents route wrappers.
 *
 * Six endpoints backing the "start from your documents" wizard flow:
 * multipart upload, URL registration, list, delete, the free
 * ingest-and-assess job, and the debited prepare-corpus job. All are
 * owner-scoped under /course/:courseId and mirror the generated `paths`
 * shapes — this file (like the sibling route modules) is the only layer
 * allowed to import from `_generated` directly.
 */

// ── Upload (multipart) ─────────────────────────────────

type UploadDocumentResponse =
  paths['/api/course/{courseId}/documents']['post']['responses']['200']['content']['application/json'];

/**
 * Upload one source file. `Content-Type: undefined` is required so axios
 * doesn't clobber the browser-set multipart boundary (same trick as the
 * mentor-attachment upload). `onProgress` reports 0..1 upload progress
 * for the per-file progress bar.
 */
export const uploadSourceDocument = ({
  courseId,
  file,
  onProgress,
}: {
  courseId: string;
  file: File;
  onProgress?: (fraction: number) => void;
}) => {
  const form = new FormData();
  form.append('file', file);

  return client<UploadDocumentResponse>({
    url: `/course/${courseId}/documents`,
    method: 'POST',
    data: form,
    headers: { 'Content-Type': undefined as unknown as string },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(e.loaded / e.total);
    },
  }).then((res) => res.data.data);
};

// ── Add URL ────────────────────────────────────────────

type AddUrlDocumentBody =
  paths['/api/course/{courseId}/documents/url']['post']['requestBody']['content']['application/json'];
type AddUrlDocumentResponse =
  paths['/api/course/{courseId}/documents/url']['post']['responses']['200']['content']['application/json'];

export const addUrlDocument = (params: { courseId: string } & AddUrlDocumentBody) => {
  const { courseId, ...body } = params;
  return client<AddUrlDocumentResponse>({
    url: `/course/${courseId}/documents/url`,
    method: 'POST',
    data: body,
  }).then((res) => res.data.data);
};

// ── List ───────────────────────────────────────────────

type ListSourceDocumentsResponse =
  paths['/api/course/{courseId}/documents']['get']['responses']['200']['content']['application/json'];

export const listSourceDocuments = (courseId: string) => {
  return client<ListSourceDocumentsResponse>({
    url: `/course/${courseId}/documents`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Delete ─────────────────────────────────────────────

type DeleteSourceDocumentResponse =
  paths['/api/course/{courseId}/documents/{documentId}']['delete']['responses']['200']['content']['application/json'];

export const deleteSourceDocument = (params: { courseId: string; documentId: string }) => {
  return client<DeleteSourceDocumentResponse>({
    url: `/course/${params.courseId}/documents/${params.documentId}`,
    method: 'DELETE',
  }).then((res) => res.data.data);
};

// ── Ingest (free assess pass) ──────────────────────────

type IngestDocumentsResponse =
  paths['/api/course/{courseId}/documents/ingest']['post']['responses']['202']['content']['application/json'];

export const ingestDocuments = (courseId: string) => {
  return client<IngestDocumentsResponse>({
    url: `/course/${courseId}/documents/ingest`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Prepare corpus (debited pre-structure pass) ────────

type PrepareCorpusResponse =
  paths['/api/course/{courseId}/prepare-corpus']['post']['responses']['202']['content']['application/json'];

export const prepareCorpus = (courseId: string) => {
  return client<PrepareCorpusResponse>({
    url: `/course/${courseId}/prepare-corpus`,
    method: 'POST',
  }).then((res) => res.data.data);
};

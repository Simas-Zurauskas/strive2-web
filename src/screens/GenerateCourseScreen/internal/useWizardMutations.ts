import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createCourse,
  clarifyCourse,
  generateStructure,
  generateDepthPreviews,
  updateCourse,
  deleteCourse,
} from '@/api/routes/course';
import {
  addUrlDocument,
  deleteSourceDocument,
  ingestDocuments,
  prepareCorpus,
  uploadSourceDocument,
} from '@/api/routes/course/documents';
import { ROUTES } from '@/constants/routes';
import { TOASTS } from '@/constants/toasts';
import { QKeys } from '@/types';

export const useWizardMutations = (courseId: string | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    // Accepts the full create body: `{ goal }` for the classic flow,
    // `{ source: 'documents' }` for the documents flow (server persists a
    // placeholder goal until the analysis suggests one).
    mutationFn: (params: Parameters<typeof createCourse>[0]) => createCourse(params),
    meta: { errorMessage: TOASTS.COURSE_CREATE_ERROR },
  });

  const clarifyMutation = useMutation({
    mutationFn: (id: string) => clarifyCourse(id),
    meta: { errorMessage: TOASTS.CLARIFY_ERROR },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (params: Parameters<typeof updateCourse>[0]) => updateCourse(params),
    meta: { errorMessage: TOASTS.COURSE_SAVE_ERROR },
  });

  const structureMutation = useMutation({
    mutationFn: (id: string) => generateStructure(id),
    meta: { errorMessage: TOASTS.STRUCTURE_ERROR },
  });

  const depthPreviewsMutation = useMutation({
    mutationFn: (id: string) => generateDepthPreviews(id),
    meta: { errorMessage: TOASTS.DEPTH_PREVIEWS_ERROR },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      // No success toast — user explicitly confirmed deletion via dialog
      // and is then navigated to home where the course is no longer listed.
      // The dialog flow + visible state change is the confirmation.
      router.push(ROUTES.home());
    },
    meta: { errorMessage: TOASTS.COURSE_DELETE_ERROR },
  });

  // ── Course-from-documents mutations ─────────────────
  //
  // Upload / add-URL failures render inline on the specific file/URL row
  // (typed errorCode → friendly copy in SourcesStep), so the global
  // error toast is silenced for those two. Ingest / prepare-corpus keep
  // the global policy — their 402 must open the Out-of-Credits modal.

  const uploadDocumentMutation = useMutation({
    mutationFn: (params: Parameters<typeof uploadSourceDocument>[0]) => uploadSourceDocument(params),
    meta: { silent: true },
  });

  const addUrlDocumentMutation = useMutation({
    mutationFn: (params: Parameters<typeof addUrlDocument>[0]) => addUrlDocument(params),
    meta: { silent: true },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (params: Parameters<typeof deleteSourceDocument>[0]) => deleteSourceDocument(params),
    meta: { errorMessage: TOASTS.DOCUMENT_DELETE_ERROR },
  });

  const ingestDocumentsMutation = useMutation({
    mutationFn: (id: string) => ingestDocuments(id),
    meta: { errorMessage: TOASTS.INGEST_ERROR },
  });

  const prepareCorpusMutation = useMutation({
    mutationFn: (id: string) => prepareCorpus(id),
    meta: { errorMessage: TOASTS.PREPARE_SOURCES_ERROR },
  });

  return {
    createCourseMutation,
    clarifyMutation,
    updateCourseMutation,
    structureMutation,
    depthPreviewsMutation,
    deleteMutation,
    uploadDocumentMutation,
    addUrlDocumentMutation,
    deleteDocumentMutation,
    ingestDocumentsMutation,
    prepareCorpusMutation,
    queryClient,
  };
};

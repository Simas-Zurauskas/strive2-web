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
import { TOASTS } from '@/constants/toasts';
import { QKeys } from '@/types';

export const useWizardMutations = (courseId: string | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: (params: { goal: string }) => createCourse(params),
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
      router.push('/');
    },
    meta: { errorMessage: TOASTS.COURSE_DELETE_ERROR },
  });

  return {
    createCourseMutation,
    clarifyMutation,
    updateCourseMutation,
    structureMutation,
    depthPreviewsMutation,
    deleteMutation,
    queryClient,
  };
};

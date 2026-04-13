import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
    onError: () => toast.error(TOASTS.COURSE_CREATE_ERROR),
  });

  const clarifyMutation = useMutation({
    mutationFn: (id: string) => clarifyCourse(id),
    onError: () => toast.error(TOASTS.CLARIFY_ERROR),
  });

  const updateCourseMutation = useMutation({
    mutationFn: (params: Parameters<typeof updateCourse>[0]) => updateCourse(params),
    onError: () => toast.error(TOASTS.COURSE_SAVE_ERROR),
  });

  const structureMutation = useMutation({
    mutationFn: (id: string) => generateStructure(id),
    onError: () => toast.error(TOASTS.STRUCTURE_ERROR),
  });

  const depthPreviewsMutation = useMutation({
    mutationFn: (id: string) => generateDepthPreviews(id),
    onError: () => toast.error(TOASTS.DEPTH_PREVIEWS_ERROR),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(courseId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      toast.success(TOASTS.COURSE_DELETED);
      router.push('/');
    },
    onError: () => toast.error(TOASTS.COURSE_DELETE_ERROR),
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

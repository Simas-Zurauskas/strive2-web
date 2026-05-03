import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getFavoriteCourseIds, toggleFavoriteCourse } from '@/api/routes/course';
import { QKeys } from '@/types';

export const useFavoriteCourseIds = () => {
  const { status } = useSession();
  return useQuery({
    queryKey: [QKeys.FAVORITE_COURSES],
    queryFn: getFavoriteCourseIds,
    enabled: status === 'authenticated',
  });
};

export const useToggleFavoriteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => toggleFavoriteCourse(courseId),
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: [QKeys.FAVORITE_COURSES] });
      const previous = queryClient.getQueryData<string[]>([QKeys.FAVORITE_COURSES]);

      queryClient.setQueryData<string[]>([QKeys.FAVORITE_COURSES], (old) => {
        if (!old) return [courseId];
        return old.includes(courseId)
          ? old.filter((id) => id !== courseId)
          : [...old, courseId];
      });

      return { previous };
    },
    onError: (_err, _courseId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QKeys.FAVORITE_COURSES], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QKeys.FAVORITE_COURSES] });
    },
  });
};

import * as yup from 'yup';

export const generateCourseSchema = yup.object({
  topic: yup
    .string()
    .min(1, 'Topic is required')
    .max(200, 'Topic must be at most 200 characters')
    .required('Topic is required'),
});

export type GenerateCourseValues = yup.InferType<typeof generateCourseSchema>;

export const goalInputSchema = yup.object({
  goal: yup
    .string()
    .min(1, 'Please describe what you want to learn')
    .max(500, 'Goal must be at most 500 characters')
    .required('Please describe what you want to learn'),
});

export type GoalInputValues = yup.InferType<typeof goalInputSchema>;

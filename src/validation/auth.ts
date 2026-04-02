import * as yup from 'yup';

export const signInSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),
});

export type SignInValues = yup.InferType<typeof signInSchema>;
export type SignUpValues = yup.InferType<typeof signUpSchema>;

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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const passwordWithConfirm = {
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
};

export const resetPasswordSchema = yup.object(passwordWithConfirm);
export const setPasswordSchema = yup.object(passwordWithConfirm);
export const changePasswordSchema = yup.object(passwordWithConfirm);

export type SignInValues = yup.InferType<typeof signInSchema>;
export type SignUpValues = yup.InferType<typeof signUpSchema>;
export type ForgotPasswordValues = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordValues = yup.InferType<typeof resetPasswordSchema>;
export type SetPasswordValues = yup.InferType<typeof setPasswordSchema>;
export type ChangePasswordValues = yup.InferType<typeof changePasswordSchema>;

'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { resetPassword } from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import {
  AuthForm,
  AuthFormError,
  AuthFormFooter,
  AuthFormTitle,
  AuthSubmitBtn,
  Input,
} from '@/components';
import { TOASTS } from '@/constants/toasts';
import { resetPasswordSchema, ResetPasswordValues } from '@/validation';

const initialValues: ResetPasswordValues = { password: '', confirmPassword: '' };

export const ResetPasswordScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success(TOASTS.RESET_PASSWORD_SUCCESS);
      router.push('/login');
    },
    meta: { silent: true },
  });

  if (!token || !email) {
    return (
      <AuthForm as="div">
        <AuthFormTitle>Invalid reset link</AuthFormTitle>
        <AuthFormFooter>{TOASTS.RESET_LINK_INVALID}</AuthFormFooter>
        <Link href="/forgot-password">
          <AuthSubmitBtn as="span">Request a new link</AuthSubmitBtn>
        </Link>
      </AuthForm>
    );
  }

  const apiError = mutation.error as ClientApiError | null;
  const inlineError = (() => {
    if (!apiError) return null;
    if (apiError.errorCode === 'PASSWORD_RESET_EXPIRED') return TOASTS.RESET_LINK_EXPIRED;
    if (apiError.errorCode === 'PASSWORD_RESET_INVALID') return TOASTS.RESET_LINK_INVALID;
    return apiError.message || 'Could not reset password.';
  })();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={(values) => mutation.mutate({ email, token, newPassword: values.password })}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Reset password</AuthFormTitle>
          <AuthFormFooter>Choose a new password for your account.</AuthFormFooter>

          <Input
            name="password"
            type="password"
            placeholder="New password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          {inlineError && <AuthFormError>{inlineError}</AuthFormError>}

          <AuthSubmitBtn
            type="submit"
            $loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Resetting...' : 'Reset password'}
          </AuthSubmitBtn>

          {apiError?.errorCode === 'PASSWORD_RESET_EXPIRED' && (
            <AuthFormFooter>
              <Link href="/forgot-password">Request a new link</Link>
            </AuthFormFooter>
          )}

          <AuthFormFooter>
            <Link href="/login">Back to sign in</Link>
          </AuthFormFooter>
        </AuthForm>
      )}
    </Formik>
  );
};

'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { resetPassword } from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import {
  AuthForm,
  AuthFormError,
  AuthFormFooter,
  AuthFormTitle,
  AuthMoment,
  AuthPasswordRulesSlot,
  AuthSubmitBtn,
  Input,
  PasswordRequirements,
} from '@/components';
import { TOASTS } from '@/constants/toasts';
import { resetPasswordSchema, ResetPasswordValues } from '@/validation';

const initialValues: ResetPasswordValues = { password: '', confirmPassword: '' };

export const ResetPasswordScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  // Focus-driven password rules — same UX as the auth modal's signup form.
  const [pwFocused, setPwFocused] = useState(false);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success(TOASTS.RESET_PASSWORD_SUCCESS);
      router.push('/');
    },
    meta: { silent: true },
  });

  if (!token || !email) {
    return (
      <AuthMoment.Centered>
        <AuthForm as="div">
          <AuthFormTitle>Invalid reset link</AuthFormTitle>
          <AuthFormFooter>{TOASTS.RESET_LINK_INVALID}</AuthFormFooter>
          <Link href="/forgot-password">
            <AuthSubmitBtn as="span">Request a new link</AuthSubmitBtn>
          </Link>
        </AuthForm>
      </AuthMoment.Centered>
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
    <AuthMoment.Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={(values) => mutation.mutate({ email, token, newPassword: values.password })}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        submitCount,
      }) => {
        // Same error-gating rule as the auth modal: never on first render,
        // all errors after submit, format errors on blur with content.
        const showError = (field: 'password' | 'confirmPassword') => {
          if (submitCount > 0) return errors[field];
          if (touched[field] && values[field] && errors[field]) return errors[field];
          return undefined;
        };
        const rulesOpen =
          pwFocused || (values.password.length > 0 && !!errors.password);
        return (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Reset password</AuthFormTitle>
          <AuthFormFooter>Choose a new password for your account.</AuthFormFooter>

          <Input
            name="password"
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onFocus={() => setPwFocused(true)}
            onBlur={(e) => {
              handleBlur(e);
              setPwFocused(false);
            }}
            error={showError('password')}
          />
          <AuthPasswordRulesSlot $open={rulesOpen} aria-hidden={!rulesOpen}>
            <div>
              <PasswordRequirements value={values.password} />
            </div>
          </AuthPasswordRulesSlot>

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('confirmPassword')}
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
            <Link href="/">Back to sign in</Link>
          </AuthFormFooter>
        </AuthForm>
        );
      }}
    </Formik>
    </AuthMoment.Centered>
  );
};

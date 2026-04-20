'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { forgotPassword } from '@/api/routes/auth';
import {
  AuthForm,
  AuthFormFooter,
  AuthFormTitle,
  AuthSubmitBtn,
  Input,
} from '@/components';
import { TOASTS } from '@/constants/toasts';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/validation';

const initialValues: ForgotPasswordValues = { email: '' };

export const ForgotPasswordScreen = () => {
  const mutation = useMutation({
    mutationFn: forgotPassword,
    meta: { errorMessage: TOASTS.FORGOT_PASSWORD_ERROR },
  });

  // Render the same neutral confirmation on success AND error so the UI never
  // reveals whether an account exists for the submitted email.
  if (mutation.isSuccess || mutation.isError) {
    return (
      <AuthForm as="div">
        <AuthFormTitle>Check your inbox</AuthFormTitle>
        <AuthFormFooter>{TOASTS.RESET_LINK_SENT}</AuthFormFooter>
        <Link href="/login">
          <AuthSubmitBtn as="span">Back to sign in</AuthSubmitBtn>
        </Link>
      </AuthForm>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Forgot password?</AuthFormTitle>
          <AuthFormFooter>
            Enter your email and we&apos;ll send you a link to reset your password.
          </AuthFormFooter>

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
          />

          <AuthSubmitBtn
            type="submit"
            $loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sending...' : 'Send reset link'}
          </AuthSubmitBtn>

          <AuthFormFooter>
            Remembered it? <Link href="/login">Sign in</Link>
          </AuthFormFooter>
        </AuthForm>
      )}
    </Formik>
  );
};

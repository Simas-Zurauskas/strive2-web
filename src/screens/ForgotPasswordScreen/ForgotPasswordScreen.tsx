'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { forgotPassword } from '@/api/routes/auth';
import {
  AuthForm,
  AuthFormFooter,
  AuthFormTitle,
  AuthMoment,
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
  const submittedEmail = mutation.variables?.email ?? '';

  // Render the same neutral confirmation on success AND error so the UI never
  // reveals whether an account exists for the submitted email.
  if (mutation.isSuccess || mutation.isError) {
    return (
      <AuthMoment.Centered>
      <AuthMoment.Wrap>
        <AuthMoment.Rule aria-hidden />
        <AuthMoment.Eyebrow>Check your inbox</AuthMoment.Eyebrow>
        <AuthMoment.Title>Reset link on the way.</AuthMoment.Title>
        <AuthMoment.Lead>
          If an account exists for
          {submittedEmail ? (
            <>
              {' '}
              <AuthMoment.InlineMark>{submittedEmail}</AuthMoment.InlineMark>
            </>
          ) : (
            ' that email'
          )}
          , a reset link is on its way. Click it to choose a new password.
        </AuthMoment.Lead>

        <AuthMoment.Hint>
          Didn&rsquo;t get it? Check your spam folder. Links expire after 1 hour.
        </AuthMoment.Hint>

        <Link href="/" passHref legacyBehavior>
          <AuthMoment.PrimaryButton as="a">Back to sign in</AuthMoment.PrimaryButton>
        </Link>
      </AuthMoment.Wrap>
      </AuthMoment.Centered>
    );
  }

  return (
    <AuthMoment.Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={(values) => mutation.mutate(values)}
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
        // Same error-gating rule as the auth modal forms: never on first
        // render, all errors after submit, format errors on blur with
        // content.
        const showEmailError =
          submitCount > 0
            ? errors.email
            : touched.email && values.email && errors.email
            ? errors.email
            : undefined;
        return (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Forgot password?</AuthFormTitle>
          <AuthFormFooter>
            Enter your email and we&apos;ll send you a link to reset your password.
          </AuthFormFooter>

          <Input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showEmailError}
          />

          <AuthSubmitBtn
            type="submit"
            $loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sending...' : 'Send reset link'}
          </AuthSubmitBtn>

          <AuthFormFooter>
            Remembered it? <Link href="/">Sign in</Link>
          </AuthFormFooter>
        </AuthForm>
        );
      }}
    </Formik>
    </AuthMoment.Centered>
  );
};

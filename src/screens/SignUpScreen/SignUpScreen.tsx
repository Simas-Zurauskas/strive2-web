'use client';

import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import {
  AuthDivider,
  AuthForm,
  AuthFormError,
  AuthFormFooter,
  AuthFormTitle,
  AuthSubmitBtn,
  GoogleBtn,
  Input,
} from '@/components';
import { safeRedirect } from '@/lib/safeRedirect';
import { signUpSchema, SignUpValues } from '@/validation';

const initialValues: SignUpValues = { email: '', password: '', confirmPassword: '' };

const REDIRECT_STORAGE_KEY = 'pendingPostAuthRedirect';

export const SignUpScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState('');

  // The `?redirect=` query is set by upstream callers (e.g. PricingScreen)
  // that want the user to land back on a specific page after onboarding.
  // Credentials sign-up sends the user to /signup/check-email first; we stash
  // the target so the verify-email flow can pick it up after activation.
  // For Google OAuth we hand it directly to next-auth via callbackUrl, which
  // next-auth itself sanitizes against same-origin.
  const redirect = safeRedirect(searchParams.get('redirect'));

  const handleSubmit = async (values: SignUpValues) => {
    setApiError('');

    const res = await signIn('credentials', {
      ...values,
      type: 'signup',
      redirect: false,
    });

    if (res?.error) {
      setApiError(res.error);
      return;
    }

    sessionStorage.setItem('pendingVerificationEmail', values.email);
    if (redirect && redirect !== '/') {
      sessionStorage.setItem(REDIRECT_STORAGE_KEY, redirect);
    } else {
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
    router.push('/signup/check-email');
  };

  const handleGoogle = () => signIn('google', { callbackUrl: redirect });

  const loginHref = redirect && redirect !== '/'
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : '/login';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signUpSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Create account</AuthFormTitle>

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          {apiError && <AuthFormError>{apiError}</AuthFormError>}

          <AuthSubmitBtn type="submit" $loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </AuthSubmitBtn>

          <AuthDivider>or</AuthDivider>

          <GoogleBtn type="button" onClick={handleGoogle}>
            Continue with Google
          </GoogleBtn>

          <AuthFormFooter>
            Already have an account? <Link href={loginHref}>Sign in</Link>
          </AuthFormFooter>
        </AuthForm>
      )}
    </Formik>
  );
};

'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerification } from '@/api/routes/auth';
import {
  AuthDivider,
  AuthForm,
  AuthFormError,
  AuthFormFooter,
  AuthFormHelperRow,
  AuthSubmitBtn,
  GoogleBtn,
  GoogleIcon,
  Input,
} from '@/components';
import { TOASTS } from '@/constants/toasts';
import { safeRedirect } from '@/lib/safeRedirect';
import { signInSchema, SignInValues } from '@/validation';

interface SignInFormProps {
  redirect: string;
  onSwitchMode: (next: 'signin' | 'signup') => void;
}

const initialValues: SignInValues = { email: '', password: '' };

export const SignInForm = ({ redirect, onSwitchMode }: SignInFormProps) => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [lastCredentials, setLastCredentials] = useState<SignInValues | null>(null);

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast(TOASTS.VERIFICATION_SENT),
    meta: { errorMessage: TOASTS.RESEND_ERROR },
  });
  const resending = resendMutation.isPending;

  const handleSignIn = async (values: SignInValues) => {
    setApiError('');
    setShowResend(false);

    const res = await signIn('credentials', {
      ...values,
      type: 'signin',
      redirect: false,
    });

    if (res?.error) {
      if (res.error.startsWith('EMAIL_NOT_VERIFIED::')) {
        setApiError(res.error.split('::')[1]);
        setShowResend(true);
        setLastCredentials(values);
        return;
      }
      setApiError(res.error);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleResend = () => {
    if (!lastCredentials) return;
    resendMutation.mutate({ email: lastCredentials.email, password: lastCredentials.password });
  };

  // Re-validate the callbackUrl as defense-in-depth: NextAuth treats absolute
  // URLs as same-host or rejects them, but a future caller could thread an
  // unvalidated redirect into this prop. safeRedirect guarantees a same-origin
  // path even if the upstream gate is bypassed.
  const handleGoogle = () =>
    signIn('google', { callbackUrl: safeRedirect(redirect, '/home') });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signInSchema}
      onSubmit={handleSignIn}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
      }) => {
        // Error gating: never on first render (avoids the autofill-and-
        // hidden-slot phantom "required" messages); after submit, show
        // everything; on blur with content, show format errors so the
        // user sees "Enter a valid email" before pressing the button.
        // Empty-and-blurred ≠ error — that's just the user clicking past
        // a field they haven't filled yet.
        const showError = (field: 'email' | 'password') => {
          if (submitCount > 0) return errors[field];
          if (touched[field] && values[field] && errors[field]) return errors[field];
          return undefined;
        };
        return (
        <AuthForm onSubmit={handleSubmit}>
          <GoogleBtn type="button" onClick={handleGoogle} data-analytics-id="landing.modal.google">
            <GoogleIcon />
            Continue with Google
          </GoogleBtn>

          <AuthDivider>or</AuthDivider>

          <Input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('email')}
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('password')}
          />

          <AuthFormHelperRow>
            <Link href="/forgot-password">Forgot password?</Link>
          </AuthFormHelperRow>

          {apiError && <AuthFormError role="alert">{apiError}</AuthFormError>}

          {showResend && (
            <GoogleBtn type="button" disabled={resending} onClick={handleResend}>
              {resending ? 'Sending...' : 'Resend verification email'}
            </GoogleBtn>
          )}

          <AuthSubmitBtn
            type="submit"
            $loading={isSubmitting}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            data-analytics-id="landing.modal.submit.signin"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </AuthSubmitBtn>

          <AuthFormFooter>
            Don&apos;t have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchMode('signup');
              }}
            >
              Sign up
            </a>
          </AuthFormFooter>
        </AuthForm>
        );
      }}
    </Formik>
  );
};

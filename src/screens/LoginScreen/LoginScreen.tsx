'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  AuthFormTitle,
  AuthSubmitBtn,
  GoogleBtn,
  Input,
} from '@/components';
import { TOASTS } from '@/constants/toasts';
import { safeRedirect } from '@/lib/safeRedirect';
import { signInSchema, SignInValues } from '@/validation';

const initialValues: SignInValues = { email: '', password: '' };

export const LoginScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [lastCredentials, setLastCredentials] = useState<SignInValues | null>(null);

  // Same `?redirect=` semantics as SignUpScreen — see its inline note.
  const redirect = safeRedirect(searchParams.get('redirect'));

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast(TOASTS.VERIFICATION_SENT),
    meta: { errorMessage: TOASTS.RESEND_ERROR },
  });
  const resending = resendMutation.isPending;

  const handleSubmit = async (values: SignInValues) => {
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

  const handleGoogle = () => signIn('google', { callbackUrl: redirect });

  const signupHref = redirect && redirect !== '/'
    ? `/signup?redirect=${encodeURIComponent(redirect)}`
    : '/signup';

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signInSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
        <AuthForm onSubmit={handleSubmit}>
          <AuthFormTitle>Sign in</AuthFormTitle>

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

          <AuthFormHelperRow>
            <Link href="/forgot-password">Forgot password?</Link>
          </AuthFormHelperRow>

          {apiError && <AuthFormError>{apiError}</AuthFormError>}

          {showResend && (
            <GoogleBtn type="button" disabled={resending} onClick={handleResend}>
              {resending ? 'Sending...' : 'Resend verification email'}
            </GoogleBtn>
          )}

          <AuthSubmitBtn type="submit" $loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </AuthSubmitBtn>

          <AuthDivider>or</AuthDivider>

          <GoogleBtn type="button" onClick={handleGoogle}>
            Continue with Google
          </GoogleBtn>

          <AuthFormFooter>
            Don&apos;t have an account? <Link href={signupHref}>Sign up</Link>
          </AuthFormFooter>
        </AuthForm>
      )}
    </Formik>
  );
};

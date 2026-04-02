'use client';

import { Formik } from 'formik';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerification } from '@/api/routes/auth';
import { signInSchema, SignInValues } from '@/validation';
import * as S from './LoginScreen.styles';

const initialValues: SignInValues = { email: '', password: '' };

export const LoginScreen = () => {
  const [apiError, setApiError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [lastCredentials, setLastCredentials] = useState<SignInValues | null>(null);

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

    window.location.href = '/';
  };

  const handleResend = async () => {
    if (!lastCredentials) return;

    setResending(true);

    try {
      await resendVerification({ email: lastCredentials.email, password: lastCredentials.password });
      toast.success('Verification email sent. Check your inbox.');
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/' });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signInSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
        <S.Form onSubmit={handleSubmit}>
          <h1 className="form__title">Sign in</h1>

          <input
            className="form__input"
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="form__field-error">{errors.email}</p>
          )}

          <input
            className="form__input"
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <p className="form__field-error">{errors.password}</p>
          )}

          {apiError && <p className="form__error">{apiError}</p>}

          {showResend && (
            <S.GoogleBtn type="button" disabled={resending} onClick={handleResend}>
              {resending ? 'Sending...' : 'Resend verification email'}
            </S.GoogleBtn>
          )}

          <S.SubmitBtn type="submit" $loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </S.SubmitBtn>

          <S.Divider>or</S.Divider>

          <S.GoogleBtn type="button" onClick={handleGoogle}>
            Continue with Google
          </S.GoogleBtn>

          <p className="form__footer">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </S.Form>
      )}
    </Formik>
  );
};


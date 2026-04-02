'use client';

import { Formik } from 'formik';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { signUpSchema, SignUpValues } from '@/validation';
import * as S from '../LoginScreen/LoginScreen.styles';

const initialValues: SignUpValues = { email: '', password: '' };

export const SignUpScreen = () => {
  const [apiError, setApiError] = useState('');

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
    window.location.href = '/check-email';
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/' });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signUpSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
        <S.Form onSubmit={handleSubmit}>
          <h1 className="form__title">Create account</h1>

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

          <S.SubmitBtn type="submit" $loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </S.SubmitBtn>

          <S.Divider>or</S.Divider>

          <S.GoogleBtn type="button" onClick={handleGoogle}>
            Continue with Google
          </S.GoogleBtn>

          <p className="form__footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </S.Form>
      )}
    </Formik>
  );
};


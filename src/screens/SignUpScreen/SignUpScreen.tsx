'use client';

import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { signUpSchema, SignUpValues } from '@/validation';

const initialValues: SignUpValues = { email: '', password: '', confirmPassword: '' };

export const SignUpScreen = () => {
  const router = useRouter();
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
    router.push('/signup/check-email');
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/' });

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
            Already have an account? <Link href="/login">Sign in</Link>
          </AuthFormFooter>
        </AuthForm>
      )}
    </Formik>
  );
};

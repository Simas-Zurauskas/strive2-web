'use client';

import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AuthDivider,
  AuthForm,
  AuthFormError,
  AuthFormFooter,
  AuthPasswordRulesSlot,
  AuthSubmitBtn,
  Checkbox,
  GoogleBtn,
  GoogleIcon,
  Input,
  PasswordRequirements,
} from '@/components';
import { safeRedirect } from '@/lib/safeRedirect';
import { signUpSchema, SignUpValues } from '@/validation';

interface SignUpFormProps {
  redirect: string;
  onSwitchMode: (next: 'signin' | 'signup') => void;
}

const REDIRECT_STORAGE_KEY = 'pendingPostAuthRedirect';
const initialValues: SignUpValues = {
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export const SignUpForm = ({ redirect, onSwitchMode }: SignUpFormProps) => {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  // Keep PasswordRequirements collapsed until the user focuses the
  // password input. Once they've started typing, leave it visible until
  // the field clears + blurs — avoids the rules suddenly disappearing
  // mid-typing if focus shifts between renders.
  const [pwFocused, setPwFocused] = useState(false);

  const handleSignUp = async (values: SignUpValues) => {
    setApiError('');

    // `acceptTerms` is a frontend-only consent gate — the backend's signup
    // payload doesn't accept it. Strip before forwarding to next-auth.
    const { acceptTerms: _acceptTerms, ...payload } = values;

    const res = await signIn('credentials', {
      ...payload,
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
    toast.success('Account created. Check your email to verify.');
    router.push('/signup/check-email');
    router.refresh();
  };

  // Defense-in-depth: re-validate before handing the value to NextAuth, even
  // though the upstream entry point already gates this through safeRedirect.
  const handleGoogle = () =>
    signIn('google', { callbackUrl: safeRedirect(redirect, '/') });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={signUpSchema}
      onSubmit={handleSignUp}
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
        // Same gating rule as SignInForm: never on first render, all
        // errors after submit, and format errors on blur if the field has
        // content. Lets users catch typos early without exposing
        // "required" errors before they've tried to submit.
        const showError = (field: 'email' | 'password' | 'confirmPassword') => {
          if (submitCount > 0) return errors[field];
          if (touched[field] && values[field] && errors[field]) return errors[field];
          return undefined;
        };
        // Show rules while the password input is focused OR the user has
        // typed something but not yet completed a valid password.
        const rulesOpen =
          pwFocused || (values.password.length > 0 && !!errors.password);
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
            placeholder="Confirm password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError('confirmPassword')}
          />

          {/* Plain-text label — the actual Terms / Privacy links live in the
              fine-print below the submit button, so duplicating them here
              would be redundant AND create a "is this a link or a click
              target?" UX problem (the whole label toggles the checkbox). */}
          <Checkbox
            name="acceptTerms"
            checked={values.acceptTerms}
            onChange={handleChange}
            onBlur={handleBlur}
            label="I agree to the Terms of Service and Privacy Policy."
          />
          {submitCount > 0 && errors.acceptTerms && (
            <AuthFormError role="alert">{errors.acceptTerms}</AuthFormError>
          )}

          {apiError && <AuthFormError role="alert">{apiError}</AuthFormError>}

          <AuthSubmitBtn
            type="submit"
            $loading={isSubmitting}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            data-analytics-id="landing.modal.submit.signup"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </AuthSubmitBtn>

          <AuthFormFooter>
            Already have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchMode('signin');
              }}
            >
              Sign in
            </a>
          </AuthFormFooter>
        </AuthForm>
        );
      }}
    </Formik>
  );
};

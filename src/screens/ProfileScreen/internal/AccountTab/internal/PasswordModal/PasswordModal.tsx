'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import {
  changePassword,
  requestSecurityActionCode,
  setPassword,
} from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import { Button, Input, PasswordRequirements } from '@/components';
import { TOASTS } from '@/constants/toasts';
import {
  changePasswordSchema,
  ChangePasswordValues,
  securityActionCodeSchema,
  SecurityActionCodeValues,
  setPasswordSchema,
  SetPasswordValues,
} from '@/validation';
import * as S from './PasswordModal.styles';

interface PasswordModalProps {
  open: boolean;
  mode: 'set' | 'change';
  onClose: () => void;
}

const passwordInitial = { password: '', confirmPassword: '' } satisfies SetPasswordValues & ChangePasswordValues;
const codeInitial = { code: '' } satisfies SecurityActionCodeValues;

// API spaces consecutive code requests by 60 seconds (see
// `securityActionService.MIN_INTERVAL_MS`). Mirroring it client-side avoids a
// guaranteed 429 if the user mashes "Resend".
const RESEND_COOLDOWN_SECONDS = 60;

export const PasswordModal = ({ open, mode, onClose }: PasswordModalProps) => {
  const { update: updateSession } = useSession();
  const isSet = mode === 'set';
  const action = isSet ? 'set_password' : 'change_password';

  const [step, setStep] = useState<'password' | 'code'>('password');
  const [pendingPassword, setPendingPassword] = useState('');
  const [resendUntil, setResendUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const requestCodeMutation = useMutation({
    mutationFn: () => requestSecurityActionCode({ action }),
    onSuccess: () => {
      toast.success(TOASTS.CODE_SENT);
      setResendUntil(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      setStep('code');
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: { newPassword: string; code: string }) => {
      if (isSet) return setPassword(values);
      return changePassword(values);
    },
    onSuccess: async ({ token }) => {
      // tokenVersion was bumped server-side, killing every OTHER session,
      // but the API also minted a fresh JWT for the caller (bound to the
      // new tokenVersion). Push it through NextAuth's session.update() —
      // the jwt() callback handles the `update` trigger and swaps the
      // stored token in place — so this session stays alive.
      await updateSession({ token });
      toast.success(isSet ? TOASTS.PASSWORD_SET : TOASTS.PASSWORD_CHANGED);
      onClose();
    },
    meta: { errorMessage: TOASTS.PASSWORD_CHANGE_ERROR },
  });

  // Tick once per second while a resend cooldown is active so the countdown
  // re-renders. No-op when no cooldown is pending.
  useEffect(() => {
    if (resendUntil <= now) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [resendUntil, now]);

  useEffect(() => {
    if (!open) return;
    setStep('password');
    setPendingPassword('');
    setResendUntil(0);
    requestCodeMutation.reset();
    submitMutation.reset();
    // Effect deps intentionally omit the mutations — we only want this reset
    // when the modal is (re-)opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitMutation.isPending && !requestCodeMutation.isPending) {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, submitMutation.isPending, requestCodeMutation.isPending, onClose]);

  if (!open) return null;

  const requestError = requestCodeMutation.error as ClientApiError | null;
  const submitError = submitMutation.error as ClientApiError | null;
  const apiError = step === 'password' ? requestError : submitError ?? requestError;

  const inlineError = (() => {
    if (!apiError) return null;
    if (apiError.errorCode === 'PASSWORD_ALREADY_SET') {
      return 'A password is already set for this account. Use change password instead.';
    }
    if (apiError.errorCode === 'PASSWORD_NOT_SET') {
      return 'No password is set for this account. Use set password instead.';
    }
    return apiError.message;
  })();

  const cooldownRemaining = Math.max(0, Math.ceil((resendUntil - now) / 1000));
  const canResend = cooldownRemaining === 0 && !requestCodeMutation.isPending;

  const handleResend = () => {
    if (!canResend) return;
    requestCodeMutation.mutate();
  };

  return createPortal(
    <>
      <S.Backdrop onClick={submitMutation.isPending ? undefined : onClose} />
      <S.Dialog role="dialog" aria-labelledby="password-modal-title">
        <S.Title id="password-modal-title">{isSet ? 'Set a password' : 'Change password'}</S.Title>
        <S.Description>
          {step === 'password'
            ? isSet
              ? "Choose a password. We'll email you a 6-digit code to confirm before it's saved."
              : "Enter a new password. We'll email you a 6-digit code to confirm before it's saved."
            : "We've sent a 6-digit code to your email. Enter it to confirm."}
        </S.Description>

        {/* `key={step}` is load-bearing — without it React reuses the same
            <input> DOM nodes across steps (Formik → S.Form → Input → S.Field
            all reconcile to the same component types). The browser's
            password manager keeps its memory keyed to that DOM node and
            re-fills it after the type swap, leaking the just-typed password
            into the OTP field. Forcing a remount severs that link. */}
        {step === 'password' ? (
          <Formik
            key="password-step"
            initialValues={passwordInitial}
            validationSchema={isSet ? setPasswordSchema : changePasswordSchema}
            onSubmit={(values) => {
              setPendingPassword(values.password);
              requestCodeMutation.mutate();
            }}
          >
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
              <S.Form onSubmit={handleSubmit}>
                <Input
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={values.password}
                  autoComplete="new-password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // Live checklist communicates which rule is failing — suppress
                  // the redundant yup error so the field only shows the
                  // "required" case after blur.
                  error={touched.password && !values.password ? errors.password : undefined}
                />
                <PasswordRequirements value={values.password} />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={values.confirmPassword}
                  autoComplete="new-password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                />

                {inlineError && <S.ErrorText>{inlineError}</S.ErrorText>}

                <S.Actions>
                  <Button variant="secondary" onClick={onClose} disabled={requestCodeMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={requestCodeMutation.isPending}>
                    Send code
                  </Button>
                </S.Actions>
              </S.Form>
            )}
          </Formik>
        ) : (
          <Formik
            key="code-step"
            initialValues={codeInitial}
            validationSchema={securityActionCodeSchema}
            onSubmit={(values) =>
              submitMutation.mutate({ newPassword: pendingPassword, code: values.code })
            }
          >
            {({ handleSubmit, setFieldValue, handleBlur, values, errors, touched }) => (
              <S.Form onSubmit={handleSubmit} autoComplete="off">
                {/* Inline styled input — bypasses the shared <Input/> wrapper
                    so we can hard-disable autofill/managers on this field
                    specifically. onChange strips non-digits and clamps to 6
                    so a stray paste of the just-typed password can't even
                    survive into Formik state. */}
                <S.CodeField
                  // Random-suffixed name keeps Chrome's heuristic from
                  // matching the field against any "password" memory it has
                  // for this origin.
                  name="otp-code"
                  type="text"
                  placeholder="6-digit code"
                  value={values.code}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  data-1p-ignore
                  data-lpignore="true"
                  data-bwignore
                  data-form-type="other"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                    void setFieldValue('code', digits);
                  }}
                  onBlur={handleBlur}
                />
                {touched.code && errors.code && <S.ErrorText>{errors.code}</S.ErrorText>}

                <S.ResendRow>
                  <S.ResendButton type="button" onClick={handleResend} disabled={!canResend}>
                    {requestCodeMutation.isPending
                      ? 'Sending...'
                      : cooldownRemaining > 0
                        ? `Resend in ${cooldownRemaining}s`
                        : 'Resend code'}
                  </S.ResendButton>
                </S.ResendRow>

                {inlineError && <S.ErrorText>{inlineError}</S.ErrorText>}

                <S.Actions>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={submitMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitMutation.isPending}>
                    {isSet ? 'Set password' : 'Change password'}
                  </Button>
                </S.Actions>
              </S.Form>
            )}
          </Formik>
        )}
      </S.Dialog>
    </>,
    document.body,
  );
};

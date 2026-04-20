'use client';

import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { changePassword, setPassword } from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import { Button, Input } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth } from '@/hooks';
import { changePasswordSchema, ChangePasswordValues, setPasswordSchema, SetPasswordValues } from '@/validation';
import * as S from './PasswordModal.styles';

interface PasswordModalProps {
  open: boolean;
  mode: 'set' | 'change';
  onClose: () => void;
}

const initialValues = { password: '', confirmPassword: '' } satisfies SetPasswordValues & ChangePasswordValues;

export const PasswordModal = ({ open, mode, onClose }: PasswordModalProps) => {
  const { signOut } = useAuth();

  const isSet = mode === 'set';

  const mutation = useMutation({
    mutationFn: async (values: { password: string }) => {
      if (isSet) return setPassword({ newPassword: values.password });
      return changePassword({ newPassword: values.password });
    },
    onSuccess: async () => {
      // tokenVersion was bumped server-side; the current bearer is dead.
      // Sign out and route the user back to /login. In-place token rotation
      // would be smoother but requires a NextAuth session-callback swap —
      // tracked as a follow-up.
      toast.success(isSet ? TOASTS.PASSWORD_SET : TOASTS.PASSWORD_CHANGED);
      onClose();
      await signOut({ callbackUrl: '/login' });
    },
    meta: { errorMessage: TOASTS.PASSWORD_CHANGE_ERROR },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !mutation.isPending) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, mutation.isPending, onClose]);

  if (!open) return null;

  const apiError = mutation.error as ClientApiError | null;
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

  return createPortal(
    <>
      <S.Backdrop onClick={mutation.isPending ? undefined : onClose} />
      <S.Dialog role="dialog" aria-labelledby="password-modal-title">
        <S.Title id="password-modal-title">{isSet ? 'Set a password' : 'Change password'}</S.Title>
        <S.Description>
          {isSet
            ? 'Choose a password so you can also sign in with email and password.'
            : 'Enter a new password. You will be signed out of all sessions.'}
        </S.Description>

        <Formik
          initialValues={initialValues}
          validationSchema={isSet ? setPasswordSchema : changePasswordSchema}
          onSubmit={(values) => mutation.mutate({ password: values.password })}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
            <S.Form onSubmit={handleSubmit}>
              <Input
                name="password"
                type="password"
                placeholder="New password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />

              {inlineError && <S.ErrorText>{inlineError}</S.ErrorText>}

              <S.Actions>
                <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" loading={mutation.isPending}>
                  {isSet ? 'Set password' : 'Change password'}
                </Button>
              </S.Actions>
            </S.Form>
          )}
        </Formik>
      </S.Dialog>
    </>,
    document.body,
  );
};

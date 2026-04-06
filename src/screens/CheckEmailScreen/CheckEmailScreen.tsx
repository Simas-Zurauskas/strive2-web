'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated } from '@/api/routes/auth';
import { TOASTS, toastMessage } from '@/constants/toasts';
import * as S from '../LoginScreen/LoginScreen.styles';

export const CheckEmailScreen = () => {
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);

    try {
      await resendVerificationAuthenticated();
      toast.success(TOASTS.VERIFICATION_SENT_SHORT);
    } catch (err) {
      const error = err as { message?: string; status?: number };
      if (error?.status === 401 || error?.message === 'Unauthorized') {
        toast.error(TOASTS.SESSION_EXPIRED);
      } else {
        toast.error(toastMessage(error?.message, TOASTS.RESEND_ERROR));
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <S.Form as="div">
      <h1 className="form__title">Check your email</h1>

      <p className="form__footer" style={{ opacity: 1 }}>
        We&apos;ve sent a verification link to your email address. Click the link to verify your
        account.
      </p>

      <S.SubmitBtn
        type="button"
        $loading={resending}
        disabled={resending}
        onClick={handleResend}
      >
        {resending ? 'Sending...' : 'Resend verification email'}
      </S.SubmitBtn>

      <p className="form__footer">
        <Link href="/login">Back to sign in</Link>
      </p>
    </S.Form>
  );
};

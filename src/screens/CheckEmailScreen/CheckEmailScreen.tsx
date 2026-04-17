'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { resendVerificationAuthenticated } from '@/api/routes/auth';
import { ClientApiError } from '@/api/types';
import { AuthForm, AuthFormFooter, AuthFormTitle, AuthSubmitBtn } from '@/components';
import { TOASTS } from '@/constants/toasts';

export const CheckEmailScreen = () => {
  const resendMutation = useMutation({
    mutationFn: resendVerificationAuthenticated,
    onSuccess: () => toast(TOASTS.VERIFICATION_SENT_SHORT),
    // Surface session expiry specifically; global handler covers anything else.
    onError: (err) => {
      const apiError = err as ClientApiError;
      if (apiError.status === 401 || apiError.message === 'Unauthorized') {
        toast.error(TOASTS.SESSION_EXPIRED);
      }
    },
    meta: { errorMessage: TOASTS.RESEND_ERROR },
  });
  const resending = resendMutation.isPending;

  return (
    <AuthForm as="div">
      <AuthFormTitle>Check your email</AuthFormTitle>

      <AuthFormFooter style={{ opacity: 1 }}>
        We&apos;ve sent a verification link to your email address. Click the link to verify your account.
      </AuthFormFooter>

      <AuthSubmitBtn
        type="button"
        $loading={resending}
        disabled={resending}
        onClick={() => resendMutation.mutate()}
      >
        {resending ? 'Sending...' : 'Resend verification email'}
      </AuthSubmitBtn>

      <AuthFormFooter>
        <Link href="/login">Back to sign in</Link>
      </AuthFormFooter>
    </AuthForm>
  );
};

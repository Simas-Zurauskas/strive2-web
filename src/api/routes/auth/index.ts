import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Get authenticated user ──────────────────────────────────

type GetMeResponse = paths['/api/auth/me']['get']['responses']['200']['content']['application/json'];

export const getMe = () => {
  return client<GetMeResponse>({
    url: '/auth/me',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Email verification ──────────────────────────────────────

export const verifyEmail = (params: { token: string; email: string }) => {
  return client<{ data: { message: string } }>({
    url: '/auth/verify-email',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

export const resendVerification = (params: { email: string; password: string }) => {
  return client<{ data: { message: string } }>({
    url: '/auth/resend-verification',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};
// ── Resend verification (authenticated) ─────────────────────

export const resendVerificationAuthenticated = () => {
  return client<{ data: { message: string } }>({
    url: '/auth/resend-verification-authenticated',
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Delete account ──────────────────────────────────────────

export const deleteAccount = (params: { password: string }) => {
  return client<{ data: { deleted: boolean } }>({
    url: '/auth/delete-account',
    method: 'DELETE',
    data: params,
  }).then((res) => res.data.data);
};
// -----------------------------------------------------------------------

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

type VerifyEmailBody = paths['/api/auth/verify-email']['post']['requestBody']['content']['application/json'];
type VerifyEmailResponse = paths['/api/auth/verify-email']['post']['responses']['200']['content']['application/json'];

export const verifyEmail = (params: VerifyEmailBody) => {
  return client<VerifyEmailResponse>({
    url: '/auth/verify-email',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type ResendVerificationBody = paths['/api/auth/resend-verification']['post']['requestBody']['content']['application/json'];
type ResendVerificationResponse = paths['/api/auth/resend-verification']['post']['responses']['200']['content']['application/json'];

export const resendVerification = (params: ResendVerificationBody) => {
  return client<ResendVerificationResponse>({
    url: '/auth/resend-verification',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Resend verification (authenticated) ─────────────────────

type ResendVerificationAuthResponse = paths['/api/auth/resend-verification-authenticated']['post']['responses']['200']['content']['application/json'];

export const resendVerificationAuthenticated = () => {
  return client<ResendVerificationAuthResponse>({
    url: '/auth/resend-verification-authenticated',
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Delete account ──────────────────────────────────────────

type DeleteAccountBody = paths['/api/auth/delete-account']['delete']['requestBody']['content']['application/json'];
type DeleteAccountResponse = paths['/api/auth/delete-account']['delete']['responses']['200']['content']['application/json'];

export const deleteAccount = (params: DeleteAccountBody) => {
  return client<DeleteAccountResponse>({
    url: '/auth/delete-account',
    method: 'DELETE',
    data: params,
  }).then((res) => res.data.data);
};

// ── Logout (revoke bearer server-side) ──────────────────────

// Inline type pending `yarn codegen` — the server endpoint was added after
// the last OpenAPI regeneration. Swap to `paths['/api/auth/logout']['post']...`
// once the generated file is refreshed.
type LogoutResponse = { data: { message: string } };

export const logout = () => {
  return client<LogoutResponse>({
    url: '/auth/logout',
    method: 'POST',
  }).then((res) => res.data.data);
};

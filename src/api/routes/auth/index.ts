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

// ── Update preferences ──────────────────────────────────────

type UpdatePreferencesBody =
  paths['/api/auth/me/preferences']['patch']['requestBody']['content']['application/json'];
type UpdatePreferencesResponse =
  paths['/api/auth/me/preferences']['patch']['responses']['200']['content']['application/json'];

export const updatePreferences = (params: UpdatePreferencesBody) => {
  return client<UpdatePreferencesResponse>({
    url: '/auth/me/preferences',
    method: 'PATCH',
    data: params,
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

// Body shape is hand-typed (`{ code }`) instead of pulled from `paths` because
// `_generated.ts` may lag behind the API; the actual runtime contract is
// `{ code: string }` (6-digit OTP from the email-OTP flow). Run `yarn codegen`
// to refresh the generated paths if you want compile-time enforcement here.
type DeleteAccountBody = { code: string };
type DeleteAccountResponse = paths['/api/auth/delete-account']['delete']['responses']['200']['content']['application/json'];

export const deleteAccount = (params: DeleteAccountBody) => {
  return client<DeleteAccountResponse>({
    url: '/auth/delete-account',
    method: 'DELETE',
    data: params,
  }).then((res) => res.data.data);
};

// ── Logout (revoke bearer server-side) ──────────────────────

type LogoutResponse = paths['/api/auth/logout']['post']['responses']['200']['content']['application/json'];

export const logout = () => {
  return client<LogoutResponse>({
    url: '/auth/logout',
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Password recovery (public) ──────────────────────────────

type ForgotPasswordBody = paths['/api/auth/forgot-password']['post']['requestBody']['content']['application/json'];
type ForgotPasswordResponse = paths['/api/auth/forgot-password']['post']['responses']['200']['content']['application/json'];

export const forgotPassword = (params: ForgotPasswordBody) => {
  return client<ForgotPasswordResponse>({
    url: '/auth/forgot-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type ResetPasswordBody = paths['/api/auth/reset-password']['post']['requestBody']['content']['application/json'];
type ResetPasswordResponse = paths['/api/auth/reset-password']['post']['responses']['200']['content']['application/json'];

export const resetPassword = (params: ResetPasswordBody) => {
  return client<ResetPasswordResponse>({
    url: '/auth/reset-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Password management (authenticated) ─────────────────────

// `{ newPassword, code }` is hand-typed for the same reason as `deleteAccount`
// above — `_generated.ts` lags behind the API until `yarn codegen` runs.
// Response shape is also hand-typed because the API now returns a fresh
// `token` (bound to the bumped tokenVersion) so the caller can keep its
// session alive via NextAuth `session.update()`.
type SetPasswordBody = { newPassword: string; code: string };
type PasswordMutationResponse = { data: { message?: string; token: string } };

export const setPassword = (params: SetPasswordBody) => {
  return client<PasswordMutationResponse>({
    url: '/auth/set-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type ChangePasswordBody = { newPassword: string; code: string };

export const changePassword = (params: ChangePasswordBody) => {
  return client<PasswordMutationResponse>({
    url: '/auth/change-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Security-action OTP request ─────────────────────────────

// Sends a 6-digit code to the user's verified email. The client surfaces the
// code-entry form once this resolves; the API enforces 60s spacing + 5/hr cap.
type SecurityAction = 'set_password' | 'change_password' | 'delete_account';

export const requestSecurityActionCode = (params: { action: SecurityAction }) => {
  return client<{ data: { sent: boolean } }>({
    url: '/auth/security-action/request-code',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

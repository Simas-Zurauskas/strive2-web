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

type SetPasswordBody = paths['/api/auth/set-password']['post']['requestBody']['content']['application/json'];
type SetPasswordResponse = paths['/api/auth/set-password']['post']['responses']['200']['content']['application/json'];

export const setPassword = (params: SetPasswordBody) => {
  return client<SetPasswordResponse>({
    url: '/auth/set-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type ChangePasswordBody = paths['/api/auth/change-password']['post']['requestBody']['content']['application/json'];
type ChangePasswordResponse = paths['/api/auth/change-password']['post']['responses']['200']['content']['application/json'];

export const changePassword = (params: ChangePasswordBody) => {
  return client<ChangePasswordResponse>({
    url: '/auth/change-password',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Security-action OTP request ─────────────────────────────

// Sends a 6-digit code to the user's verified email. The client surfaces the
// code-entry form once this resolves; the API enforces 60s spacing + 5/hr cap.
type RequestSecurityActionCodeBody =
  paths['/api/auth/security-action/request-code']['post']['requestBody']['content']['application/json'];
type RequestSecurityActionCodeResponse =
  paths['/api/auth/security-action/request-code']['post']['responses']['200']['content']['application/json'];

export const requestSecurityActionCode = (params: RequestSecurityActionCodeBody) => {
  return client<RequestSecurityActionCodeResponse>({
    url: '/auth/security-action/request-code',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Marketing email preference ──────────────────────────────

// Reads/writes through to Mailjet's "promotional" contact list. The
// email-link unsubscribe path (Mailjet's hosted page) writes to the same
// record, so the checkbox reflects whichever path most recently changed
// state — no local sync needed.
type GetMarketingPreferenceResponse =
  paths['/api/auth/me/marketing-preference']['get']['responses']['200']['content']['application/json'];

export const getMarketingPreference = () => {
  return client<GetMarketingPreferenceResponse>({
    url: '/auth/me/marketing-preference',
    method: 'GET',
  }).then((res) => res.data.data);
};

type UpdateMarketingPreferenceBody =
  paths['/api/auth/me/marketing-preference']['patch']['requestBody']['content']['application/json'];
type UpdateMarketingPreferenceResponse =
  paths['/api/auth/me/marketing-preference']['patch']['responses']['200']['content']['application/json'];

export const updateMarketingPreference = (params: UpdateMarketingPreferenceBody) => {
  return client<UpdateMarketingPreferenceResponse>({
    url: '/auth/me/marketing-preference',
    method: 'PATCH',
    data: params,
  }).then((res) => res.data.data);
};

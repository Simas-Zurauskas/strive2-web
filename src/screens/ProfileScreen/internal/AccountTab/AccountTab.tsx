import { ArrowUpRight } from 'lucide-react';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteAccount, requestSecurityActionCode } from '@/api/routes/auth';
import { Button } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth } from '@/hooks';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { formatDate } from '@/lib/formatDate';
import * as S from './AccountTab.styles';
import { NarrationPreferences } from './internal/NarrationPreferences';
import { PasswordModal } from './internal/PasswordModal';

const formatProvider = (provider: string) => {
  if (provider === 'GOOGLE') return 'Google';
  if (provider === 'CREDENTIALS') return 'Email & Password';
  return provider;
};

// Mirrors the API's `securityActionService.MIN_INTERVAL_MS` so the resend
// button stays disabled long enough to avoid a guaranteed 429.
const RESEND_COOLDOWN_SECONDS = 60;

export const AccountTab: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: billing } = useBillingSummary();
  const { data: catalog } = useBillingPlans();

  // Forfeit warning surfaces bonus balance as its USD-equivalent (what the
  // user originally paid at the published top-up rate). Missing rate =
  // fall back to a generic line without a dollar figure.
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;
  const bonusUsdLabel = topupRate > 0 && billing?.credits.bonus
    ? `$${(billing.credits.bonus / topupRate).toFixed(2)}`
    : null;

  const [deleteStep, setDeleteStep] = useState<'closed' | 'confirm' | 'code'>('closed');
  const [code, setCode] = useState('');
  const [requestingCode, setRequestingCode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resendUntil, setResendUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const hasCredentials = user?.authProviders?.some((p) => p.provider === 'CREDENTIALS');

  // Tick once per second while a resend cooldown is active so the countdown
  // re-renders. No-op when no cooldown is pending.
  useEffect(() => {
    if (resendUntil <= now) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [resendUntil, now]);

  const resetDeleteFlow = () => {
    setDeleteStep('closed');
    setCode('');
    setRequestingCode(false);
    setDeleting(false);
    setResendUntil(0);
  };

  const sendDeleteCode = async () => {
    setRequestingCode(true);
    try {
      await requestSecurityActionCode({ action: 'delete_account' });
      toast.success(TOASTS.CODE_SENT);
      setResendUntil(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      setDeleteStep('code');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : TOASTS.CODE_SEND_ERROR;
      toast.error(message);
    } finally {
      setRequestingCode(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast.error('Enter the 6-digit code from your email.');
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount({ code });
      // User row is gone, so our signOut() wrapper's /logout call would 401.
      // Use raw nextAuthSignOut to just clear the NextAuth session.
      await nextAuthSignOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      toast.error(message);
      setDeleting(false);
    }
  };

  const cooldownRemaining = Math.max(0, Math.ceil((resendUntil - now) / 1000));
  const canResend = cooldownRemaining === 0 && !requestingCode;

  if (!user) return null;

  return (
    <>
      <S.Section>
        <S.SectionTitle>Account</S.SectionTitle>
        <S.InfoRow>
          <S.Label>Sign-in methods</S.Label>
          <S.Value>
            {user.authProviders?.map((p) => (
              <S.ProviderTag key={p.provider}>{formatProvider(p.provider)}</S.ProviderTag>
            ))}
          </S.Value>
        </S.InfoRow>
        <S.InfoRow>
          <S.Label>
            {hasCredentials ? 'Password' : 'Set a password to also sign in with email'}
          </S.Label>
          <Button variant="secondary" size="small" onClick={() => setPasswordModalOpen(true)}>
            {hasCredentials ? 'Change password' : 'Set password'}
          </Button>
        </S.InfoRow>
        <S.InfoRow>
          <S.Label>Sign out of your account</S.Label>
          <Button variant="secondary" size="small" onClick={() => signOut()}>
            Logout
          </Button>
        </S.InfoRow>
      </S.Section>

      <PasswordModal
        open={passwordModalOpen}
        mode={hasCredentials ? 'change' : 'set'}
        onClose={() => setPasswordModalOpen(false)}
      />

      <NarrationPreferences />

      <S.Section>
        <S.SectionTitle>Legal</S.SectionTitle>
        <S.LegalLink href="/terms" target="_blank" rel="noopener noreferrer">
          <span>Terms of Service</span>
          <ArrowUpRight size={14} strokeWidth={2} />
        </S.LegalLink>
        <S.LegalLink href="/privacy" target="_blank" rel="noopener noreferrer">
          <span>Privacy Policy</span>
          <ArrowUpRight size={14} strokeWidth={2} />
        </S.LegalLink>
      </S.Section>

      <S.DangerZone>
        <S.DangerTitle>Danger Zone</S.DangerTitle>
        <S.DangerText>
          Permanently delete your account and all associated data. This action cannot be undone.
        </S.DangerText>

        {deleteStep === 'closed' ? (
          <S.DangerButton onClick={() => setDeleteStep('confirm')}>Delete Account</S.DangerButton>
        ) : (
          <>
            {/* Surface every irreversible loss before they confirm. Industry
                standard for subscription products is to forfeit everything
                on deletion — the warning makes that explicit so no one
                accidentally trashes paid value. */}
            {billing && (
              <S.ForfeitWarning>
                <S.ForfeitTitle>This permanently destroys</S.ForfeitTitle>
                <S.ForfeitList>
                  {billing.plan !== 'free' && (
                    <li>
                      Your <strong>{billing.displayName}</strong> subscription will be cancelled
                      {billing.credits.periodEnd && (
                        <> (currently renews {formatDate({ input: billing.credits.periodEnd, format: 'long' })})</>
                      )}. No refund.
                    </li>
                  )}
                  {billing.credits.allowance > 0 && (
                    <li>All remaining plan allowance this period.</li>
                  )}
                  {billing.credits.bonus > 0 && (
                    <li>
                      All purchased top-up allowance
                      {bonusUsdLabel && <> (<strong>{bonusUsdLabel}</strong> remaining)</>}.
                    </li>
                  )}
                  <li>All your courses, lessons, quizzes, and progress.</li>
                </S.ForfeitList>
              </S.ForfeitWarning>
            )}

            {deleteStep === 'code' && (
              <>
                <S.CodeHint>
                  We&apos;ve sent a 6-digit code to your email. Enter it below to confirm deletion.
                </S.CodeHint>
                <S.ConfirmInput
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={deleting}
                />
                <S.ResendButton
                  type="button"
                  onClick={sendDeleteCode}
                  disabled={!canResend || deleting}
                >
                  {requestingCode
                    ? 'Sending...'
                    : cooldownRemaining > 0
                      ? `Resend in ${cooldownRemaining}s`
                      : 'Resend code'}
                </S.ResendButton>
              </>
            )}

            <S.ButtonRow>
              <S.DangerButton
                $loading={deleting || requestingCode}
                disabled={
                  deleting || requestingCode || (deleteStep === 'code' && code.length !== 6)
                }
                onClick={deleteStep === 'confirm' ? sendDeleteCode : handleConfirmDelete}
              >
                {deleting
                  ? 'Deleting...'
                  : deleteStep === 'confirm'
                    ? 'Yes, send confirmation code'
                    : 'Confirm and delete my account'}
              </S.DangerButton>
              <Button
                variant="secondary"
                size="small"
                onClick={resetDeleteFlow}
                disabled={deleting}
              >
                Cancel
              </Button>
            </S.ButtonRow>
          </>
        )}
      </S.DangerZone>
    </>
  );
};

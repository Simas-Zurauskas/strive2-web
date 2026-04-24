import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteAccount } from '@/api/routes/auth';
import { Button, InlineLink } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth } from '@/hooks';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { formatDate } from '@/lib/formatDate';
import * as S from './AccountTab.styles';
import { PasswordModal } from './internal/PasswordModal';

const formatProvider = (provider: string) => {
  if (provider === 'GOOGLE') return 'Google';
  if (provider === 'CREDENTIALS') return 'Email & Password';
  return provider;
};

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

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const hasCredentials = user?.authProviders?.some((p) => p.provider === 'CREDENTIALS');

  const handleDeleteAccount = async () => {
    if (hasCredentials && !deletePassword) {
      toast.error(TOASTS.PASSWORD_REQUIRED);
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount({ password: deletePassword });
      // User row is gone, so our signOut() wrapper's /logout call would 401.
      // Use raw nextAuthSignOut to just clear the NextAuth session.
      await nextAuthSignOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      toast.error(message);
      setDeleting(false);
    }
  };

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

      <S.Section>
        <S.SectionTitle>Legal</S.SectionTitle>
        <S.InfoRow>
          <S.Label>Terms of Service</S.Label>
          <InlineLink href="/terms" newTab>View</InlineLink>
        </S.InfoRow>
        <S.InfoRow>
          <S.Label>Privacy Policy</S.Label>
          <InlineLink href="/privacy" newTab>View</InlineLink>
        </S.InfoRow>
      </S.Section>

      <S.DangerZone>
        <S.DangerTitle>Danger Zone</S.DangerTitle>
        <S.DangerText>
          Permanently delete your account and all associated data. This action cannot be undone.
        </S.DangerText>

        {!showDeleteConfirm ? (
          <S.DangerButton onClick={() => setShowDeleteConfirm(true)}>Delete Account</S.DangerButton>
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
            {hasCredentials && (
              <S.PasswordInput
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deleting}
              />
            )}
            <S.ButtonRow>
              <S.DangerButton
                $loading={deleting}
                disabled={deleting || (hasCredentials && !deletePassword)}
                onClick={handleDeleteAccount}
              >
                {deleting ? 'Deleting...' : 'Yes, delete my account'}
              </S.DangerButton>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
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

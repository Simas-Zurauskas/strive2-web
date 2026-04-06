'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated, deleteAccount } from '@/api/routes/auth';
import { TOASTS } from '@/constants/toasts';
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import * as S from './ProfileScreen.styles';

const formatProvider = (provider: string) => {
  if (provider === 'GOOGLE') return 'Google';
  if (provider === 'CREDENTIALS') return 'Email & Password';
  return provider;
};

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, signOut, refetchAuthUser } = useAuth();

  const [resending, setResending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const hasCredentials = user?.authProviders?.some((p) => p.provider === 'CREDENTIALS');

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerificationAuthenticated();
      toast.success(TOASTS.VERIFICATION_SENT);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send verification email';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (hasCredentials && !deletePassword) {
      toast.error(TOASTS.PASSWORD_REQUIRED);
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount({ password: deletePassword });
      await signOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      toast.error(message);
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <S.Layout>
        <S.LoadingText>Loading...</S.LoadingText>
      </S.Layout>
    );
  }

  return (
    <S.Layout>
      <S.Header>
        <S.BackLink onClick={() => router.push('/')}>&larr;</S.BackLink>
        <S.Title>Profile</S.Title>
      </S.Header>

      <S.Section>
        <S.SectionTitle>Account Details</S.SectionTitle>

        <S.InfoRow>
          <S.Label>Name</S.Label>
          <S.Value>{user.name || 'Not set'}</S.Value>
        </S.InfoRow>

        <S.InfoRow>
          <S.Label>Email</S.Label>
          <S.Value>
            {user.email}
            {user.emailVerified ? (
              <S.VerifiedBadge title="Email verified">&#10003;</S.VerifiedBadge>
            ) : (
              <S.UnverifiedBadge title="Email not verified">&#10007;</S.UnverifiedBadge>
            )}
          </S.Value>
        </S.InfoRow>

        <S.InfoRow>
          <S.Label>Sign-in methods</S.Label>
          <S.Value>
            {user.authProviders?.map((p) => (
              <S.ProviderTag key={p.provider}>{formatProvider(p.provider)}</S.ProviderTag>
            ))}
          </S.Value>
        </S.InfoRow>

        <S.InfoRow>
          <S.Label>Member since</S.Label>
          <S.Value>
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </S.Value>
        </S.InfoRow>
      </S.Section>

      <S.Section>
        <Button variant="secondary" onClick={() => signOut()}>
          Logout
        </Button>
      </S.Section>

      {!user.emailVerified && (
        <S.Section>
          <S.SectionTitle>Email Verification</S.SectionTitle>
          <S.DangerText>Your email is not verified. Click below to receive a verification link.</S.DangerText>
          <Button variant="primary" loading={resending} onClick={handleResendVerification}>
            Resend verification email
          </Button>
        </S.Section>
      )}

      <S.DangerZone>
        <S.DangerTitle>Danger Zone</S.DangerTitle>
        <S.DangerText>
          Permanently delete your account and all associated data. This action cannot be undone.
        </S.DangerText>

        {!showDeleteConfirm ? (
          <S.DangerButton onClick={() => setShowDeleteConfirm(true)}>Delete Account</S.DangerButton>
        ) : (
          <>
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
    </S.Layout>
  );
};

'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated, deleteAccount } from '@/api/routes/auth';
import { Button, InlineLink } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth, useCourses, useProgressSummary } from '@/hooks';
import * as S from './ProfileScreen.styles';

const formatProvider = (provider: string) => {
  if (provider === 'GOOGLE') return 'Google';
  if (provider === 'CREDENTIALS') return 'Email & Password';
  return provider;
};

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { data: courses } = useCourses();
  const { data: progressSummary } = useProgressSummary();

  const [resending, setResending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const hasCredentials = user?.authProviders?.some((p) => p.provider === 'CREDENTIALS');

  const stats = useMemo(() => {
    if (!courses || !progressSummary) return null;
    const totalCourses = courses.filter((c) => c.status === 'ready').length;
    const totalLessons = progressSummary.reduce((sum, p) => sum + p.total, 0);
    const completedLessons = progressSummary.reduce((sum, p) => sum + p.completed, 0);
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { totalCourses, completedLessons, overallProgress };
  }, [courses, progressSummary]);

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

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
      {/* ── Profile header ──────────────────────────── */}
      <S.ProfileHeader>
        <S.Avatar $hasImage={!!user.image}>
          {user.image ? <img src={user.image} alt={user.name || 'Avatar'} /> : getInitial()}
        </S.Avatar>
        <S.ProfileInfo>
          <S.ProfileName>{user.name || user.email.split('@')[0]}</S.ProfileName>
          <S.ProfileEmail>
            {user.email}
            {user.emailVerified ? (
              <S.VerifiedBadge title="Email verified">&#10003;</S.VerifiedBadge>
            ) : (
              <S.UnverifiedBadge title="Email not verified">&#10007;</S.UnverifiedBadge>
            )}
          </S.ProfileEmail>
          <S.ProfileMeta>
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </S.ProfileMeta>
        </S.ProfileInfo>
      </S.ProfileHeader>

      {/* ── Email verification banner ───────────────── */}
      {!user.emailVerified && (
        <S.VerificationBanner>
          <S.VerificationText>Your email is not verified. Please verify to secure your account.</S.VerificationText>
          <Button variant="primary" size="small" loading={resending} onClick={handleResendVerification}>
            Resend link
          </Button>
        </S.VerificationBanner>
      )}

      {/* ── Learning stats ──────────────────────────── */}
      {stats && stats.totalCourses > 0 && (
        <S.StatsGrid>
          <S.StatCard>
            <S.StatValue>{stats.totalCourses}</S.StatValue>
            <S.StatLabel>{stats.totalCourses === 1 ? 'Course' : 'Courses'}</S.StatLabel>
          </S.StatCard>
          <S.StatCard>
            <S.StatValue>{stats.completedLessons}</S.StatValue>
            <S.StatLabel>Lessons Done</S.StatLabel>
          </S.StatCard>
          <S.StatCard>
            <S.StatValue>{stats.overallProgress}%</S.StatValue>
            <S.StatLabel>Progress</S.StatLabel>
          </S.StatCard>
        </S.StatsGrid>
      )}

      {/* ── Account details ─────────────────────────── */}
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
      </S.Section>

      {/* ── Legal ───────────────────────────────────── */}
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

      {/* ── Logout ──────────────────────────────────── */}
      <S.Section>
        <S.InfoRow>
          <S.Label>Sign out of your account</S.Label>
          <Button variant="secondary" size="small" onClick={() => signOut()}>
            Logout
          </Button>
        </S.InfoRow>
      </S.Section>

      {/* ── Danger zone ─────────────────────────────── */}
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
    </S.Layout>
  );
};

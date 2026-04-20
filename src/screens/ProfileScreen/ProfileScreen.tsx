'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated } from '@/api/routes/auth';
import { Button, TextLoader, PageLayout, TopTabs, TopTab } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth } from '@/hooks';
import { formatDate } from '@/lib/formatDate';
import { AccountTab } from './internal/AccountTab/AccountTab';
import { LearningTab } from './internal/LearningTab/LearningTab';
import * as S from './ProfileScreen.styles';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'learning' | 'account'>('learning');
  const [imgError, setImgError] = useState(false);

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return '??';
  };

  const resendVerification = useMutation({
    mutationFn: resendVerificationAuthenticated,
    onSuccess: () => toast(TOASTS.VERIFICATION_SENT),
    meta: { errorMessage: 'Failed to send verification email' },
  });
  const resending = resendVerification.isPending;
  const handleResendVerification = () => resendVerification.mutate();

  if (!user) {
    return (
      <PageLayout>
        <TextLoader />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* ── Profile header ──────────────────────────── */}
      <S.ProfileHeader>
        <S.Avatar>
          {getInitials()}
          {user.image && !imgError && (
            <img
              src={user.image}
              alt={user.name || 'Avatar'}
              onError={() => setImgError(true)}
            />
          )}
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
            Member since {formatDate({ input: new Date(user.createdAt), format: 'long' })}
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

      {/* ── Tabs ────────────────────────────────────── */}
      <TopTabs>
        <TopTab $active={activeTab === 'learning'} onClick={() => setActiveTab('learning')}>
          Learning
        </TopTab>
        <TopTab $active={activeTab === 'account'} onClick={() => setActiveTab('account')}>
          Account
        </TopTab>
      </TopTabs>

      {activeTab === 'learning' && <LearningTab />}
      {activeTab === 'account' && <AccountTab />}
    </PageLayout>
  );
};

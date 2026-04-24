'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { resendVerificationAuthenticated } from '@/api/routes/auth';
import { Button, TextLoader, PageLayout, TopTabs, TopTab } from '@/components';
import { TOASTS } from '@/constants/toasts';
import { useAuth } from '@/hooks';
import { formatDate } from '@/lib/formatDate';
import { AccountTab } from './internal/AccountTab/AccountTab';
import { BillingTab } from './internal/BillingTab/BillingTab';
import { LearningTab } from './internal/LearningTab/LearningTab';
import * as S from './ProfileScreen.styles';

type ProfileTab = 'learning' | 'billing' | 'account';
const VALID_TABS: ProfileTab[] = ['learning', 'billing', 'account'];

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL is the source of truth for which tab is active so:
  //   1. Direct deep links (/profile?tab=billing) work from anywhere (pill,
  //      LowCreditBanner, OutOfCreditsModal, etc.)
  //   2. Browser back/forward syncs the UI without extra state machinery.
  //   3. Shareable URLs Just Work.
  // Invalid/unknown tab values fall back to 'learning' rather than error.
  const tabParam = searchParams.get('tab');
  const activeTab: ProfileTab = (VALID_TABS as string[]).includes(tabParam ?? '')
    ? (tabParam as ProfileTab)
    : 'learning';

  const setActiveTab = (tab: ProfileTab) => {
    // `learning` is the default — drop the param for a clean URL.
    // `scroll: false` keeps the user where they are on the page rather
    // than jumping to top on every tab click.
    const target = tab === 'learning' ? '/profile' : `/profile?tab=${tab}`;
    router.replace(target, { scroll: false });
  };

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
        <TopTab $active={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>
          Billing
        </TopTab>
        <TopTab $active={activeTab === 'account'} onClick={() => setActiveTab('account')}>
          Account
        </TopTab>
      </TopTabs>

      {activeTab === 'learning' && <LearningTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'account' && <AccountTab />}
    </PageLayout>
  );
};

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import { TopupControl } from '@/components/TopupControl';
import { ROUTES } from '@/constants/routes';
import { useBillingSummary } from '@/hooks/useBilling';
import { registerCreditModalListener } from '@/lib/creditModalBus';
import { TopupBar } from './TopupBar';
import * as S from './OutOfCreditsModal.styles';
import type { PlanKey } from '@/api/types';

const daysUntil = (date: string | Date | null | undefined): number | null => {
  if (!date) return null;
  const ms = new Date(date).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
};

const nextPlanLabel = (plan: PlanKey): string => {
  if (plan === 'free') return 'See plans';
  if (plan === 'starter') return 'Upgrade to Pro';
  if (plan === 'pro') return 'Upgrade to Studio';
  return ''; // Studio has no upgrade path
};

type TabKey = 'upgrade' | 'topup';

/**
 * Out-of-Credits modal. Subscribes to `creditModalBus` at mount time so the
 * global `MutationCache.onError` in Registry can fire it without needing
 * React-context access.
 *
 * UX shape: the user has a binary decision — subscribe (or upgrade) for a
 * bigger monthly pool, or buy a one-off top-up. We surface that as a pill
 * tab toggle so each path gets its own focused panel with a single primary
 * CTA. Studio users (no upgrade path) skip the tabs and see top-up alone.
 */
export const OutOfCreditsModal = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('upgrade');
  const { data: summary } = useBillingSummary();
  const router = useRouter();

  useEffect(() => {
    // Bus payload (need/have) is intentionally discarded — the dialog no
    // longer surfaces raw credit numbers to the user. Presence of a 402 is
    // enough to open the modal; the user decides to upgrade or top up.
    return registerCreditModalListener(() => {
      setOpen(true);
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Esc + body scroll lock mirror the AlertDialog behavior in this repo.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const plan: PlanKey = summary?.plan ?? 'free';
  const upgradeLabel = nextPlanLabel(plan);
  const canUpgrade = upgradeLabel.length > 0;

  // Whenever the modal opens, default to the most-likely path. Studio
  // users skip straight to top-up because they have nothing higher to
  // upgrade into.
  useEffect(() => {
    if (!open) return;
    setTab(canUpgrade ? 'upgrade' : 'topup');
  }, [open, canUpgrade]);

  if (!open) return null;

  const resetDays = daysUntil(summary?.credits.periodEnd);
  const activeTab: TabKey = canUpgrade ? tab : 'topup';

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      <S.Dialog role="alertdialog" aria-labelledby="out-of-credits-title" aria-modal="true">
        <S.CloseBtn onClick={close} aria-label="Close">×</S.CloseBtn>

        <S.Header>
          <TopupBar />
          <S.Title id="out-of-credits-title">You&rsquo;re out of allowance</S.Title>
          <S.Lede>
            {canUpgrade
              ? 'Pick up where you left off — upgrade for a bigger monthly pool, or buy a one-off top-up.'
              : 'Top up to keep going. Your monthly Studio allowance still refreshes at the period end.'}
          </S.Lede>
        </S.Header>

        {canUpgrade && (
          <S.Tabs role="tablist" aria-label="Continue with…">
            <S.Tab
              type="button"
              role="tab"
              aria-selected={activeTab === 'upgrade'}
              $active={activeTab === 'upgrade'}
              onClick={() => setTab('upgrade')}
            >
              Upgrade plan
            </S.Tab>
            <S.Tab
              type="button"
              role="tab"
              aria-selected={activeTab === 'topup'}
              $active={activeTab === 'topup'}
              onClick={() => setTab('topup')}
            >
              Top up once
            </S.Tab>
          </S.Tabs>
        )}

        <S.TabPanel key={activeTab}>
          {activeTab === 'upgrade' ? (
            <S.UpgradeContent>
              <S.UpgradeBlurb>
                A bigger monthly pool, no expiring credits while subscribed, all generation features.
              </S.UpgradeBlurb>
              <Button
                variant="primary"
                onClick={() => {
                  close();
                  router.push(ROUTES.pricing());
                }}
              >
                {upgradeLabel} →
              </Button>
            </S.UpgradeContent>
          ) : (
            <TopupControl stacked compact onRedirect={close} />
          )}
        </S.TabPanel>

        {resetDays !== null && resetDays > 0 && (
          <S.ResetNote>
            Allowance refreshes {resetDays === 1 ? 'tomorrow' : `in ${resetDays} days`}.
          </S.ResetNote>
        )}
      </S.Dialog>
    </>,
    document.body,
  );
};

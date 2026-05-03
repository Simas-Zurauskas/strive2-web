'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import { TopupControl } from '@/components/TopupControl';
import { ROUTES } from '@/constants/routes';
import { useBillingSummary } from '@/hooks/useBilling';
import { registerCreditModalListener } from '@/lib/creditModalBus';
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

/**
 * Out-of-Credits modal. Subscribes to `creditModalBus` at mount time so the
 * global `MutationCache.onError` in Registry can fire it without needing
 * React-context access.
 *
 * Designed to be bulletproof in the "user is mid-flow" sense:
 *   - Dismissible via Esc / backdrop click / explicit X.
 *   - Reentrant: a second 402 while the modal is open simply replaces the
 *     payload (newer need/have numbers win) rather than stacking modals.
 *   - Plan-aware CTAs: Studio users see top-ups + reset only; Free users
 *     see "See plans"; paid users see "Upgrade to <next>".
 *   - Top-up mutations `meta.silent = true` so if they themselves fail we
 *     toast the error outside this modal's context — no recursive 402 loops.
 */
export const OutOfCreditsModal = () => {
  const [open, setOpen] = useState(false);
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

  if (!open) return null;

  const plan: PlanKey = summary?.plan ?? 'free';
  const resetDays = daysUntil(summary?.credits.periodEnd);
  const upgradeLabel = nextPlanLabel(plan);
  const canUpgrade = upgradeLabel.length > 0;

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      <S.Dialog role="alertdialog" aria-labelledby="out-of-credits-title" aria-modal="true">
        <S.CloseBtn onClick={close} aria-label="Close">×</S.CloseBtn>

        <div>
          <S.Title id="out-of-credits-title">You're out of allowance</S.Title>
          <S.Lede>
            You don't have enough allowance left for this action.
            {canUpgrade
              ? ' Upgrade your plan for a bigger monthly pool, or top up below.'
              : ' Top up below to keep going — your existing Studio allowance still refreshes at the period end.'}
          </S.Lede>
        </div>

        <S.CtaGroup>
          {canUpgrade && (
            <Button variant="primary" onClick={() => { close(); router.push(ROUTES.pricing()); }}>
              {upgradeLabel}
            </Button>
          )}

          <S.SectionLabel>Or top up any amount</S.SectionLabel>
          <TopupControl stacked onRedirect={close} />
        </S.CtaGroup>

        {resetDays !== null && resetDays > 0 && (
          <S.ResetNote>
            Monthly allowance refreshes {resetDays === 1 ? 'tomorrow' : `in ${resetDays} days`}.
          </S.ResetNote>
        )}
      </S.Dialog>
    </>,
    document.body,
  );
};

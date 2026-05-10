'use client';

import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import { useDialog } from '@/hooks';
import { useBillingPlans, useBillingSummary } from '@/hooks/useBilling';
import { formatDate } from '@/lib/formatDate';
import * as S from './PurchaseSuccessModal.styles';

export type PurchaseKind = 'topup' | 'subscription';

interface Props {
  /** Null hides the modal. Setting to a kind opens it. */
  kind: PurchaseKind | null;
  onClose: () => void;
}

/**
 * Shown after Stripe Checkout redirects the user back to /profile?tab=billing
 * with `?checkout=topup|subscription`. Reads the freshly-invalidated billing
 * summary so the value the user sees ("Balance · $X.XX" / "<plan> is active")
 * matches the post-webhook state.
 *
 * Visual language: warm gold halo + medallion + drawn-in checkmark with
 * staggered tertiary sparkles — matches the editorial italic-serif vocabulary
 * used elsewhere (climb scene in OutOfCreditsModal, allowance hero in
 * BillingPanel). All animations honor `prefers-reduced-motion`.
 */
export const PurchaseSuccessModal: React.FC<Props> = ({ kind, onClose }) => {
  const { data: summary } = useBillingSummary();
  const { data: catalog } = useBillingPlans();
  const dialogRef = useDialog<HTMLDivElement>({ open: kind !== null, onClose });

  if (kind === null) return null;

  const isTopup = kind === 'topup';

  // Top-up: show the new bonus balance in dollars. Catalog is normally already
  // cached by the parent BillingPanel; the null fallback covers the rare race
  // where the modal opens before the rate has loaded.
  const topupRate = catalog?.topupRate?.creditsPerUsd ?? 0;
  const bonusUsdLabel =
    summary && topupRate > 0 ? `$${(summary.credits.bonus / topupRate).toFixed(2)}` : null;

  // Subscription: show the plan name + period-end date.
  const planName = summary?.displayName ?? 'Your plan';
  const periodEndDate = summary?.credits.periodEnd
    ? formatDate({ input: summary.credits.periodEnd, format: 'long' })
    : null;

  return createPortal(
    <>
      <S.Backdrop onClick={onClose} />
      <S.Dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="purchase-success-title"
        aria-modal="true"
      >
        <S.CloseBtn onClick={onClose} aria-label="Close">×</S.CloseBtn>

        <S.Header>
          <S.MedalWrap aria-hidden>
            <S.Halo />
            <S.Sparkle $i={0} />
            <S.Sparkle $i={1} />
            <S.Sparkle $i={2} />
            <S.Medal>
              <S.CheckSvg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5 L10.5 18 L19 7" pathLength={100} />
              </S.CheckSvg>
            </S.Medal>
          </S.MedalWrap>

          <S.Eyebrow>{isTopup ? 'Top-up complete' : 'Welcome aboard'}</S.Eyebrow>
          <S.Title id="purchase-success-title">
            {isTopup ? 'Your balance is ready.' : `${planName} is active.`}
          </S.Title>

          {isTopup ? (
            <>
              {bonusUsdLabel && (
                <S.Stat>
                  Balance <strong>{bonusUsdLabel}</strong>
                </S.Stat>
              )}
              <S.Lede>
                Top-up balance never expires and is used first when generating courses or lessons.
              </S.Lede>
            </>
          ) : (
            <S.Lede>
              Your monthly allowance is ready
              {periodEndDate ? (
                <>
                  {' '}— it refreshes on <strong>{periodEndDate}</strong>
                </>
              ) : null}
              . Manage your plan any time from the billing portal.
            </S.Lede>
          )}
        </S.Header>

        <S.Actions>
          <Button onClick={onClose}>Got it</Button>
        </S.Actions>
      </S.Dialog>
    </>,
    document.body,
  );
};

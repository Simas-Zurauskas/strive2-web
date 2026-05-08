'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { startTopup } from '@/api/routes/billing';
import { Button } from '@/components/Button';
import { useBillingPlans } from '@/hooks/useBilling';
import * as S from './TopupControl.styles';

const QUICK_PICKS = [5, 10, 25, 50, 100] as const;

// Only digits are accepted — no cents, no decimals. Prevents rounding
// weirdness on the credit grant (which is amountUsd × creditsPerUsd and
// must be an integer). Keystroke filter runs on every change so paste of
// "$25.00" lands as "25".
const sanitizeInput = (raw: string): string => raw.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');

interface TopupControlProps {
  /** Called after Stripe Checkout redirect is initiated (useful for closing a dialog). */
  onRedirect?: () => void;
  /** Initial amount in USD. Defaults to the middle quick-pick. */
  defaultAmount?: number;
  /** When true, render the Buy button at full width under the quick-picks (modal layout). */
  stacked?: boolean;
  /**
   * Modal-friendly layout: chips become the primary picker (5-col grid)
   * and the custom-amount input collapses behind a toggle so the same
   * value is not editable in two places at once. Implies `stacked`.
   */
  compact?: boolean;
}

/**
 * Variable-amount top-up widget. Single source of truth for purchasing extra
 * allowance across BillingPanel, OutOfCreditsModal, and PricingScreen —
 * ensures consistent validation, preview copy, and mutation handling.
 *
 * Flow: user types (or picks) a whole-dollar USD amount within [minUsd,
 * maxUsd] (range comes from `/api/billing/plans → topupRate`). On Buy, we
 * redirect to Stripe Checkout. Credits are granted on the
 * `checkout.session.completed` webhook and land in `bonusBalance` (never
 * expire). Server re-validates the amount — this component is UX only.
 */
export const TopupControl = ({
  onRedirect,
  defaultAmount = 25,
  stacked = false,
  compact = false,
}: TopupControlProps) => {
  const { data: catalog } = useBillingPlans();
  const rate = catalog?.topupRate;
  const minUsd = rate?.minUsd ?? 1;
  const maxUsd = rate?.maxUsd ?? 1;

  const [amountStr, setAmountStr] = useState<string>(String(defaultAmount));
  const [customOpen, setCustomOpen] = useState<boolean>(false);

  const parsedAmount = useMemo(() => {
    const n = Number(amountStr);
    return Number.isInteger(n) && n > 0 ? n : null;
  }, [amountStr]);

  // Validity is evaluated eagerly (before user clicks Buy) so the button
  // can disable and the hint can appear without requiring onBlur.
  const validity: 'ok' | 'empty' | 'below' | 'above' = useMemo(() => {
    if (parsedAmount === null) return 'empty';
    if (parsedAmount < minUsd) return 'below';
    if (parsedAmount > maxUsd) return 'above';
    return 'ok';
  }, [parsedAmount, minUsd, maxUsd]);

  const topupMutation = useMutation({
    mutationFn: startTopup,
    meta: { errorMessage: 'Could not start top-up — please try again.' },
    onSuccess: ({ url }) => {
      onRedirect?.();
      window.location.href = url;
    },
  });

  const isBusy = topupMutation.isPending || !rate;
  const canBuy = validity === 'ok' && !isBusy;

  const handleBuy = () => {
    if (!canBuy || parsedAmount === null) return;
    topupMutation.mutate({ amountUsd: parsedAmount });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(sanitizeInput(e.target.value));
  };

  // On blur: if the user typed something above max, clamp. Below min we
  // leave as-is so the hint can show — clamping up silently would feel
  // unexpected (they typed "1" on purpose).
  const handleBlur = () => {
    if (parsedAmount !== null && parsedAmount > maxUsd) {
      setAmountStr(String(maxUsd));
    }
  };

  const inputState = validity === 'ok' || validity === 'empty' ? 'neutral' : 'error';

  const renderInput = () => (
    <S.InputWrap $state={inputState}>
      <S.DollarPrefix aria-hidden="true">$</S.DollarPrefix>
      <S.AmountInput
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={`Top-up amount in whole US dollars, minimum $${minUsd}, maximum $${maxUsd}`}
        value={amountStr}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isBusy}
      />
    </S.InputWrap>
  );

  const renderQuickPicks = ({ grid }: { grid: boolean }) => (
    <S.QuickPicks $grid={grid}>
      {QUICK_PICKS.map((v) => {
        const withinRange = v >= minUsd && v <= maxUsd;
        if (!withinRange) return null;
        const selected = parsedAmount === v;
        return (
          <S.QuickPick
            key={v}
            type="button"
            $selected={selected}
            onClick={() => setAmountStr(String(v))}
            disabled={isBusy}
            aria-pressed={selected}
          >
            ${v}
          </S.QuickPick>
        );
      })}
    </S.QuickPicks>
  );

  const renderFootnote = () => (
    <S.Footnote>
      {validity === 'below' && <S.HintError>Minimum is ${minUsd}.</S.HintError>}
      {validity === 'above' && <S.HintError>Maximum is ${maxUsd}.</S.HintError>}
      {/* Range hint surfaces only when the input is visible. Both layouts now
          gate the input behind the custom-amount toggle, so showing the hint
          when the input is hidden would dangle without context. */}
      {validity === 'empty' && customOpen && (
        <S.HintMuted>
          Enter an amount between ${minUsd} and ${maxUsd}.
        </S.HintMuted>
      )}
    </S.Footnote>
  );

  const buyLabel = `Buy${parsedAmount !== null && validity === 'ok' ? ` $${parsedAmount}` : ''}`;

  // Compact (modal) layout — chips up top, optional custom amount, single Buy CTA.
  if (compact) {
    return (
      <S.Wrap $stacked $compact>
        {renderQuickPicks({ grid: true })}

        {customOpen ? (
          <S.CustomAmountRow>
            {renderInput()}
            <S.CancelButton
              type="button"
              onClick={() => setCustomOpen(false)}
              aria-expanded="true"
              aria-label="Cancel custom amount"
            >
              Cancel
            </S.CancelButton>
          </S.CustomAmountRow>
        ) : (
          <S.CustomAmountToggle
            type="button"
            onClick={() => setCustomOpen(true)}
            aria-expanded="false"
          >
            Or enter a custom amount
          </S.CustomAmountToggle>
        )}

        {renderFootnote()}

        <Button
          variant="primary"
          onClick={handleBuy}
          disabled={!canBuy}
          loading={topupMutation.isPending}
        >
          {buyLabel}
        </Button>
      </S.Wrap>
    );
  }

  // Default (BillingPanel) layout: chips are the primary picker, Buy CTA
  // sits next to them on the same row, and the custom-amount input is
  // demoted behind a toggle. Earlier this row mounted the input + chips +
  // Buy together — the input duplicated the active chip's value, gave the
  // row three competing surfaces, and pushed the CTA off-balance.
  return (
    <S.Wrap $stacked={stacked}>
      <S.Row>
        {renderQuickPicks({ grid: false })}

        {!stacked && (
          <Button
            variant="primary"
            onClick={handleBuy}
            disabled={!canBuy}
            loading={topupMutation.isPending}
          >
            {buyLabel}
          </Button>
        )}
      </S.Row>

      {customOpen ? (
        <S.CustomAmountRow>
          {renderInput()}
          <S.CancelButton
            type="button"
            onClick={() => setCustomOpen(false)}
            aria-expanded="true"
            aria-label="Cancel custom amount"
          >
            Cancel
          </S.CancelButton>
        </S.CustomAmountRow>
      ) : (
        <S.CustomAmountToggle
          type="button"
          onClick={() => setCustomOpen(true)}
          aria-expanded="false"
        >
          Or enter a custom amount
        </S.CustomAmountToggle>
      )}

      {renderFootnote()}

      {stacked && (
        <Button variant="primary" onClick={handleBuy} disabled={!canBuy} loading={topupMutation.isPending}>
          {buyLabel}
        </Button>
      )}
    </S.Wrap>
  );
};

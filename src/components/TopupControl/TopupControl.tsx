'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { startTopup } from '@/api/routes/billing';
import { Button } from '@/components/Button';
import { useBillingPlans } from '@/hooks/useBilling';
import { formatTopupLessons, formatTopupYardstick } from '@/lib/pricingFormat';
import * as S from './TopupControl.styles';

// Digits only — credit grant must be integer (amountUsd × creditsPerUsd).
const sanitizeInput = (raw: string): string => raw.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');

interface TopupControlProps {
  onRedirect?: () => void;
  defaultAmount?: number;
  stacked?: boolean;
  // Modal layout: chips as primary picker; custom-amount input collapses
  // behind a toggle so the same value isn't editable in two places. Implies stacked.
  compact?: boolean;
}

// Single source of truth across BillingPanel, OutOfCreditsModal, PricingScreen.
// Server re-validates on checkout.session.completed; this component is UX only.
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

  // Quick-pick chip amounts now come from the catalog (server-side
  // config). Falling back to the legacy ladder during catalog load so
  // the SSR shell has something to render.
  const quickPicks = catalog?.topupRate?.quickPicks ?? [5, 10, 25, 50, 100];

  const renderQuickPicks = ({ grid }: { grid: boolean }) => (
    <S.QuickPicks $grid={grid}>
      {quickPicks.map((v) => {
        const withinRange = v >= minUsd && v <= maxUsd;
        if (!withinRange) return null;
        const selected = parsedAmount === v;
        // Lesson-count approximation derived from the catalog's
        // referenceCosts.lessonCredits range. No hardcoded divisors —
        // when the backend retunes the ranges, this re-renders.
        const lessonsLabel = catalog ? formatTopupLessons(v, catalog) : '';
        return (
          <S.QuickPick
            key={v}
            type="button"
            $selected={selected}
            onClick={() => setAmountStr(String(v))}
            disabled={isBusy}
            aria-pressed={selected}
            aria-label={`Top up $${v}${lessonsLabel ? `, ${lessonsLabel}` : ''}`}
          >
            <S.QuickPickPrice>${v}</S.QuickPickPrice>
            {lessonsLabel && <S.QuickPickCredits>{lessonsLabel}</S.QuickPickCredits>}
          </S.QuickPick>
        );
      })}
    </S.QuickPicks>
  );

  /**
   * Yardstick caption — derived from catalog so a change to the
   * topup rate or reference lesson-cost range cascades automatically.
   */
  const renderYardstick = () => {
    if (!catalog) return null;
    const text = formatTopupYardstick(catalog);
    if (!text) return null;
    return <S.Yardstick>{text}</S.Yardstick>;
  };

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
        {renderYardstick()}

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

      {renderYardstick()}

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

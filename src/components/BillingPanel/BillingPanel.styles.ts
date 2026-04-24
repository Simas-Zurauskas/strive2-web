import styled, { css } from 'styled-components';

// Container only — no padding/max-width. The outer screen or tab is
// responsible for page-level layout; BillingPanel just stacks sections.
export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const PlanCard = styled.div<{ $emphasis?: boolean }>`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${(p) =>
    p.$emphasis &&
    css`
      border-color: ${p.theme.colors.accent};
    `}
`;

export const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

export const PlanTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PlanName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const PlanStatus = styled.span<{ $status: 'active' | 'warning' | 'canceled' }>`
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${(p) => {
    if (p.$status === 'active') {
      return css`
        background: ${p.theme.colorsLib.green}15;
        color: ${p.theme.colors.success};
      `;
    }
    if (p.$status === 'warning') {
      return css`
        background: ${p.theme.colorsLib.amber}15;
        color: ${p.theme.colors.warning};
      `;
    }
    return css`
      background: ${p.theme.colorsLib.red}15;
      color: ${p.theme.colors.error};
    `;
  }}
`;

export const CreditBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const CreditBarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const BarTrack = styled.div`
  height: 8px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.background};
  overflow: hidden;
`;

export const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$pct))}%;
  background: ${(p) => p.theme.colors.accent};
  border-radius: 9999px;
  transition: width 200ms ease;
`;

export const CreditSub = styled.div`
  display: flex;
  gap: 1.25rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  flex-wrap: wrap;

  span strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const PeriodNote = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

// "What happens next" block — must be unmissable. Color tone signals
// whether the next event is benign (auto-renew), neutral (free-tier
// refresh), or warning (cancel / payment issue).
export type RenewalTone = 'neutral' | 'positive' | 'warning' | 'info';

export const RenewalCard = styled.div<{ $tone: RenewalTone }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  padding: 1rem 1.125rem;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.background};

  ${(p) => {
    if (p.$tone === 'positive') {
      return css`
        border-color: ${p.theme.colorsLib.green}40;
        background: ${p.theme.colorsLib.green}10;
      `;
    }
    if (p.$tone === 'warning') {
      return css`
        border-color: ${p.theme.colorsLib.amber}40;
        background: ${p.theme.colorsLib.amber}12;
      `;
    }
    if (p.$tone === 'info') {
      return css`
        border-color: ${p.theme.colors.accent}40;
        background: ${p.theme.colors.accent}10;
      `;
    }
    return ''; // neutral — defaults
  }}
`;

export const RenewalIcon = styled.span<{ $tone: RenewalTone }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) =>
    p.$tone === 'positive' ? p.theme.colors.success
      : p.$tone === 'warning' ? p.theme.colors.warning
      : p.$tone === 'info' ? p.theme.colors.accent
      : p.theme.colors.muted};
  border: 1px solid currentColor;
`;

export const RenewalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

export const RenewalHeadline = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.35;
`;

export const RenewalDetail = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.45;

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const TopupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 1rem;
  margin-top: 0.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const TopupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TopupBadge = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.accentMuted};
  color: ${(p) => p.theme.colors.accent};
`;

export const TopupLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: 0.01em;
`;

export const TopupHint = styled.span`
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.muted};
  margin-left: 0.3rem;
`;

export const LedgerSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionHeader = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
`;

export const LedgerTable = styled.div`
  display: grid;
  gap: 0;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  overflow: hidden;
`;

export const LedgerRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  padding: 0.75rem 1rem;
  align-items: center;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};

  &:last-child {
    border-bottom: none;
  }
`;

export const LedgerMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 500;
  }
  span {
    font-size: 0.75rem;
    color: ${(p) => p.theme.colors.muted};
  }
`;

export const LedgerDate = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const LedgerDelta = styled.span<{ $positive: boolean }>`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$positive ? p.theme.colors.success : p.theme.colors.foreground)};
`;

export const EmptyLedger = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9rem;
`;

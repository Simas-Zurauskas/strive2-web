import styled from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0;

  & + & {
    border-top: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
`;

export const Value = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ProviderTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

// ── Danger zone ───────────────────────────────────────

export const DangerZone = styled.section`
  border: 1px solid ${(p) => p.theme.colors.error};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const DangerTitle = styled.h2`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.error};
  margin: 0 0 0.5rem 0;
`;

export const DangerText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 1rem 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const DangerButton = styled.button<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: ${(p) => (p.$loading || p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading || p.disabled ? 0.6 : 1)};
  transition:
    opacity 0.15s,
    background 0.15s;
  background: ${(p) => p.theme.colors.error};
  color: #fff;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.error};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

// ── Forfeit warning shown before delete confirmation ────

export const ForfeitWarning = styled.div`
  background: ${(p) => p.theme.colorsLib.amber}12;
  border: 1px solid ${(p) => p.theme.colorsLib.amber}50;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
`;

export const ForfeitTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.warning};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ForfeitList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.55;

  li {
    margin: 0.15rem 0;
  }

  strong {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

import styled from 'styled-components';

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
`;

// ── Mock button (top) ─────────────────────────────────────
export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const MockButton = styled.div<{ $pressed: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid
    ${(p) =>
      p.$pressed
        ? `color-mix(in oklab, ${p.theme.colors.accent} 60%, transparent)`
        : p.theme.colors.accent};
  background: ${(p) =>
    p.$pressed
      ? `color-mix(in oklab, ${p.theme.colors.accent} 20%, ${p.theme.colors.surface})`
      : p.theme.colors.accent};
  color: ${(p) => (p.$pressed ? p.theme.colors.accent : p.theme.colors.surface)};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
`;

export const MockButtonIcon = styled.span<{ $shown: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.$shown ? '16px' : '0')};
  height: 16px;
  margin-right: ${(p) => (p.$shown ? '8px' : '0')};
  flex-shrink: 0;
  overflow: hidden;
  opacity: ${(p) => (p.$shown ? 1 : 0)};
  transform: scale(${(p) => (p.$shown ? 1 : 0.6)});
  transition:
    width 0.25s ease,
    margin-right 0.25s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
`;

// ── Chip row (bottom) ─────────────────────────────────────
export const ChipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  max-width: 460px;
`;

export const Chip = styled.div<{ $lit: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 7px;
  border-radius: 999px;
  background: ${(p) =>
    p.$lit
      ? `color-mix(in oklab, ${p.theme.colors.tertiary} 16%, ${p.theme.colors.surface})`
      : p.theme.colors.surface};
  border: 1px solid
    ${(p) =>
      p.$lit
        ? `color-mix(in oklab, ${p.theme.colors.tertiary} 60%, transparent)`
        : p.theme.colors.surfaceBorder};
  color: ${(p) => (p.$lit ? p.theme.colors.foreground : p.theme.colors.muted)};
  font-size: 0.6875rem;
  font-weight: 500;
  white-space: nowrap;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
`;

export const ChipIcon = styled.span<{ $lit: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: ${(p) => (p.$lit ? p.theme.colors.tertiary : p.theme.colors.muted)};
  transition: color 0.3s ease;
`;

export const ChipLabel = styled.span`
  letter-spacing: 0.005em;
`;

import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

// ── Section shell ───────────────────────────────────

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  margin: 0 0 0.5rem;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Description = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
`;

export const SubsectionLabel = styled.h4`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin: 1.25rem 0 0.625rem;
`;

// ── Voice list ──────────────────────────────────────

export const VoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const VoiceCard = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border: 1px solid
    ${(p) => (p.$selected ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) =>
    p.$selected ? p.theme.colors.accentMuted : p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      p.$selected ? p.theme.colors.accent : p.theme.colors.tertiary};
    background: ${(p) =>
      p.$selected ? p.theme.colors.accentMuted : p.theme.colors.tertiaryMuted};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const VoiceMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const VoiceLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.2;
`;

export const VoiceDescription = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

export const SelectionIndicator = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid
    ${(p) => (p.$selected ? p.theme.colors.accent : p.theme.colors.border)};
  background: ${(p) => (p.$selected ? p.theme.colors.accent : 'transparent')};
  color: ${(p) => p.theme.colors.surface};
  transition: border-color 0.15s, background 0.15s;
`;

export const PendingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  animation: ${pulse} 1s ease-in-out infinite;
`;

// ── Rate row ────────────────────────────────────────

export const RateRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

export const RateButton = styled.button<{ $active: boolean }>`
  min-width: 54px;
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) =>
    p.$active ? p.theme.colors.accentMuted : p.theme.colors.surface};
  color: ${(p) =>
    p.$active ? p.theme.colors.foreground : p.theme.colors.muted};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      p.$active ? p.theme.colors.accent : p.theme.colors.tertiary};
    background: ${(p) =>
      p.$active ? p.theme.colors.accentMuted : p.theme.colors.tertiaryMuted};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

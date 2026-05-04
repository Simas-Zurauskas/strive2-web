import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1;   }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

// ── Trigger ────────────────────────────────────────

export const Trigger = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid
    ${(p) => (p.$open ? p.theme.colors.accent : p.theme.colors.surfaceBorder)};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      p.$open
        ? p.theme.colors.accent
        : `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.surfaceBorder})`};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const TriggerText = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const TriggerLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TriggerSub = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Chevron = styled.span<{ $open: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.muted};
  transition: transform 0.15s ease, color 0.15s;
  transform: rotate(${(p) => (p.$open ? '180deg' : '0deg')});

  ${Trigger}:hover & {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

// ── Panel ──────────────────────────────────────────

export const Panel = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  max-height: 22rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 8px 28px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.14s ease-out;
`;

export const OptionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem;
  overflow-y: auto;
  outline: none;
  scrollbar-width: thin;
`;

// ── Option row ─────────────────────────────────────

export const Option = styled.li<{ $active: boolean; $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.12s ease;

  /* Active = keyboard / hover focus. Selected = currently chosen. The two
     states stack visually: a selected row that's also active gets a slightly
     deeper accent tint so the user can tell their cursor is on the active
     selection. */
  background: ${(p) => {
    if (p.$selected && p.$active)
      return `color-mix(in oklab, ${p.theme.colors.accent} 14%, transparent)`;
    if (p.$selected) return p.theme.colors.accentMuted;
    if (p.$active) return p.theme.colors.background;
    return 'transparent';
  }};
`;

export const OptionMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const OptionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.25;
`;

export const OptionDescription = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

export const OptionMeta = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.0625rem;
`;

export const Tick = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => p.theme.colors.surface};
  margin-top: 1px;
`;

export const PendingDot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  margin-top: 6px;
  animation: ${pulse} 1s ease-in-out infinite;
`;

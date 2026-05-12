import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
`;

const panelEnter = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const apexPulse = keyframes`
  0%   { transform: translate(-50%, -36px) scale(1); }
  50%  { transform: translate(-50%, -36px) scale(1.18); }
  100% { transform: translate(-50%, -36px) scale(1); }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: var(--scrim-light);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 92%;
  max-width: 460px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  box-shadow: var(--shadow-modal-lg);
  animation: ${slideUp} 0.22s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 0 1.75rem;
`;

/* ──── Level-up climb scene ──────────────────────────────────────────
 * Four horizontal tier pills stacked vertically. A taller "marker"
 * pill ascends through them — landing on each tier in turn, lighting
 * it as it arrives, before continuing upward off the stack. Pure
 * abstract motion: no numbers, no labels mid-cycle. The italic-serif
 * "level up" tag appears only at the apex.
 *
 *   climbing-0…3 (380ms each): marker lands on tier i, lighting tier i
 *                              and chaining the ones below
 *   apex          (450ms):     marker pulses on the top tier
 *   release       (450ms):     marker rises past the top tier and out
 *   rest          (550ms):     all tiers dim back, marker hidden
 *
 * Total cycle ≈ 3.0s. Stack ~32px wide / 40px tall (fits the modal
 * header without dominating it).
 */
export const ClimbWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 0.125rem;
`;

/* Position-anchor for the marker. Stack is 40px tall; padding above
   gives the marker room to ascend past the top tier on `release`. */
export const ClimbStage = styled.div`
  position: relative;
  width: 32px;
  height: 64px;
  display: flex;
  flex-direction: column-reverse; /* tier index 0 = bottom of stack */
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-bottom: 4px;
`;

/* Single tier — flat fill, switches between dim (tertiaryMuted) and
   lit (tertiary). Same vocabulary as the recall day-dot lit/unlit
   states in XpStreaks. */
export const Tier = styled.span<{ $lit: boolean }>`
  width: 32px;
  height: 4px;
  border-radius: 999px;
  background: ${(p) =>
    p.$lit ? p.theme.colors.tertiary : p.theme.colors.tertiaryMuted};
  transition: background 280ms cubic-bezier(0.16, 1, 0.3, 1);
`;

/* The climbing marker — a slightly taller tertiary pill positioned
   absolutely so we can transform it across tier slots. translateY
   moves it up by (tier × 12px) since each slot is 4px tier + 8px gap.
   Apex phase plays a short scale pulse on top of the translate. */
export const ClimbMarker = styled.span<{
  $tier: number;
  $visible: boolean;
  $apex: boolean;
}>`
  position: absolute;
  left: 50%;
  bottom: 4px; /* baseline = tier 0 vertical centre */
  width: 32px;
  height: 6px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.tertiary};
  box-shadow: var(--shadow-btn);
  opacity: ${(p) => (p.$visible ? 1 : 0)};

  ${(p) =>
    p.$apex
      ? css`
          /* Apex: hold the translate, but pulse scale via keyframes */
          animation: ${apexPulse} 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          /* Static fallback so the marker stays at the top tier when
             the keyframe completes its single iteration. */
          transform: translate(-50%, -36px) scale(1);
        `
      : css`
          transform: translate(-50%, ${-p.$tier * 12}px);
          transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 220ms ease;
        `}
`;

export const LevelUpTag = styled.span<{ $on: boolean }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.tertiary};
  opacity: ${(p) => (p.$on ? 1 : 0)};
  transform: translateY(${(p) => (p.$on ? '0' : '6px')});
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  height: 18px;
  line-height: 18px;
`;

export const Title = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.015em;
  margin: 0;
`;

export const Lede = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin: 0;
`;

export const Tabs = styled.div`
  display: inline-flex;
  align-self: center;
  padding: 4px;
  gap: 2px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 999px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease,
    box-shadow 160ms ease;

  ${(p) =>
    p.$active
      ? css`
          background: ${p.theme.colors.surface};
          color: ${p.theme.colors.foreground};
          border-color: ${p.theme.colors.surfaceBorder};
          box-shadow: var(--shadow-card);
        `
      : css`
          background: transparent;
          color: ${p.theme.colors.muted};

          &:hover {
            color: ${p.theme.colors.foreground};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const TabPanel = styled.div`
  animation: ${panelEnter} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const UpgradeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const UpgradeBlurb = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.55;
  margin: 0;
`;

export const ResetNote = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  margin: 0;
  padding-top: 0.625rem;
  border-top: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.muted};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
    }
  }
`;

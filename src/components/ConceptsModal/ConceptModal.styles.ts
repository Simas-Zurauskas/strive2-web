import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
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
  max-width: 640px;
  max-height: calc(100vh - 3rem);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-modal);
  animation: ${slideUp} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.muted};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.background};
  }
`;

export const AnimationSlot = styled.div`
  position: relative;
  width: 100%;
  height: 340px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 1.5rem 1.75rem;

  @media (max-width: 520px) {
    height: 280px;
    padding: 1rem 1.125rem;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.75rem 1.25rem;
  overflow-y: auto;

  @media (max-width: 520px) {
    padding: 1.25rem 1.25rem 1rem;
  }
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
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

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Paragraph = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem 1.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-wrap: wrap;
  flex-shrink: 0;

  @media (max-width: 520px) {
    padding: 0.875rem 1.25rem 1.125rem;
  }
`;

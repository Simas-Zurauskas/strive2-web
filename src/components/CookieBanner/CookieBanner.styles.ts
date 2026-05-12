import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  /* Lift above the iOS home indicator (~34px on non-notch devices, 0 on
     everything else). The max() keeps the 1rem floor for desktops where
     safe-area-inset-bottom resolves to 0. */
  bottom: max(1rem, var(--safe-area-bottom));
  left: max(1rem, var(--safe-area-left));
  right: max(1rem, var(--safe-area-right));
  z-index: 100;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

export const Card = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 720px;
  width: 100%;
  font-size: 0.8125rem;
  line-height: 1.5;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 0.625rem;
  }
`;

export const Copy = styled.p`
  margin: 0;
  flex: 1;
  color: ${(p) => p.theme.colors.foreground};

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const Btn = styled.button`
  font: inherit;
  font-size: 0.8125rem;
  padding: 0.4375rem 0.875rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
`;

export const Reject = styled(Btn)`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => p.theme.colors.foreground};

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => p.theme.colors.foreground};
    }
  }
`;

export const Accept = styled(Btn)`
  background: ${(p) => p.theme.colors.foreground};
  border: 1px solid ${(p) => p.theme.colors.foreground};
  color: ${(p) => p.theme.colors.background};

  ${(p) => p.theme.media.hover} {
    &:hover {
      opacity: 0.85;
    }
  }
`;

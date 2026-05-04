import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: -0.25rem 0 0;
  padding: 0;
  animation: ${fadeIn} 0.18s ease-out;
`;

export const Row = styled.li<{ $satisfied: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};
  opacity: ${(p) => (p.$satisfied ? 1 : 0.6)};
  transition: opacity 0.15s ease, color 0.15s ease;

  ${(p) =>
    p.$satisfied &&
    css`
      color: color-mix(in oklab, ${p.theme.colors.success} 80%, ${p.theme.colors.foreground});
    `}
`;

export const Mark = styled.span<{ $satisfied: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  flex-shrink: 0;
  border: 1px solid
    ${(p) =>
      p.$satisfied
        ? 'transparent'
        : `color-mix(in oklab, ${p.theme.colors.surfaceBorder} 80%, transparent)`};
  background: ${(p) =>
    p.$satisfied
      ? `color-mix(in oklab, ${p.theme.colors.success} 22%, transparent)`
      : 'transparent'};
  color: ${(p) => p.theme.colors.success};
  transition: background 0.15s ease, border-color 0.15s ease;

  svg {
    width: 10px;
    height: 10px;
    stroke-width: 3;
  }
`;

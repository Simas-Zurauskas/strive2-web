import styled from 'styled-components';

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.25rem;
`;

export const OptionRow = styled.button<{ $selected: boolean }>`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  background: ${(p) => (p.$selected ? p.theme.colorsLib.secondary + '08' : p.theme.colors.surface)};
  border: 1px solid ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  box-shadow: ${(p) => (p.$selected ? `0 0 0 1px ${p.theme.colors.tertiary}` : 'none')};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => (p.$selected ? p.theme.colors.tertiary : p.theme.colors.muted)};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const OptionLabelLine = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const OptionLabel = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const RecommendedTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${(p) => p.theme.colorsLib.secondary + '20'};
  color: ${(p) => p.theme.colors.tertiary};
`;

export const OptionDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

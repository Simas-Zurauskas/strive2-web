import styled, { css } from 'styled-components';

type ChipVariant = 'match' | 'lightly-off' | 'strongly-off';

const variantStyles = (variant: ChipVariant) => {
  switch (variant) {
    case 'match':
      return css`
        background: ${(p) => p.theme.colors.surface};
        border-color: ${(p) => p.theme.colors.surfaceBorder};
        color: ${(p) => p.theme.colors.muted};
      `;
    case 'lightly-off':
      return css`
        background: ${(p) => p.theme.colors.surface};
        border-color: ${(p) => p.theme.colors.surfaceBorder};
        color: ${(p) => p.theme.colors.foreground};
      `;
    case 'strongly-off':
      return css`
        background: rgba(245, 158, 11, 0.08);
        border-color: rgba(245, 158, 11, 0.45);
        color: ${(p) => p.theme.colors.foreground};
      `;
  }
};

export const Chip = styled.div<{ $variant: ChipVariant }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.625rem;
  border: 1px solid;
  font-size: 0.8125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  ${(p) => variantStyles(p.$variant)}
`;

export const ChipIcon = styled.span`
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.6875rem;
  font-weight: 700;
  font-style: italic;
  font-family: 'Times New Roman', Georgia, serif;
  background: rgba(245, 158, 11, 0.18);
  color: rgb(180, 100, 5);
`;

export const ChipBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  strong {
    font-weight: 600;
  }
`;

export const ChipLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
`;

export const ChipSubtext = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const DismissButton = styled.button`
  appearance: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.375rem;
  margin: -0.25rem -0.25rem -0.25rem 0;
  border-radius: 0.375rem;
  color: ${(p) => p.theme.colors.muted};
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.muted};
    outline-offset: 1px;
  }
`;

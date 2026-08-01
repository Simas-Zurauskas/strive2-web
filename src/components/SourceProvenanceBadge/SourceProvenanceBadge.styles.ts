import styled from 'styled-components';

export const DocumentsPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  background: ${(p) => p.theme.colorsLib.secondary + '20'};
  color: ${(p) => p.theme.colors.tertiary};

  svg {
    width: 11px;
    height: 11px;
  }
`;

export const SupplementedLabel = styled.span`
  font-size: 0.6875rem;
  font-style: italic;
  letter-spacing: 0.04em;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.muted};
`;

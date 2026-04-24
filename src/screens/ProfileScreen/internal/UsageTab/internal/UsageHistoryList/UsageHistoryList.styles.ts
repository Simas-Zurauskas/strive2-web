import styled, { css } from 'styled-components';

export const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  margin-bottom: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const Title = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const Range = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const Row = styled.div<{ $expandable: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.625rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  margin-bottom: 0.25rem;

  ${(p) =>
    p.$expandable &&
    css`
      cursor: pointer;
      &:hover {
        background: ${p.theme.colors.surfaceBorder}40;
        border-color: ${p.theme.colors.border};
      }
    `}
`;

export const RowHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 0.75rem;
  align-items: baseline;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.25rem 0.5rem;
  }
`;

export const ServiceBadge = styled.span<{ $service: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${(p) => {
    switch (p.$service) {
      case 'anthropic':
        return `${p.theme.colors.accent}22`;
      case 'bfl':
        return `${p.theme.colors.tertiary}22`;
      case 'tavily':
        return `${p.theme.colors.success}22`;
      case 'jina':
        return `${p.theme.colors.warning}22`;
      case 'judge0':
        return `${p.theme.colors.muted}22`;
      default:
        return p.theme.colors.surfaceBorder + '40';
    }
  }};
  color: ${(p) => p.theme.colors.foreground};
`;

export const Action = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Time = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const Cost = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
  min-width: 72px;
  text-align: right;
`;

export const Metadata = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 0.75rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.25rem 0.25rem;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  font-size: 0.75rem;
`;

export const MetadataRow = styled.div`
  display: contents;
`;

export const MetadataKey = styled.span`
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

export const MetadataValue = styled.span`
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-mono), monospace;
  word-break: break-all;
`;

export const SkeletonRow = styled.div`
  padding: 0.625rem 0.75rem;
  margin-bottom: 0.25rem;
`;

export const Empty = styled.div`
  padding: 1.5rem 0.5rem;
  text-align: center;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const Pager = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

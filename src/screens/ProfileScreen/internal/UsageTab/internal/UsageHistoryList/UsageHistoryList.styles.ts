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
  padding: 0.25rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  margin-bottom: 0;

  ${(p) =>
    p.$expandable &&
    css`
      cursor: pointer;
      ${p.theme.media.hover} {
        &:hover {
          background: ${p.theme.colors.surfaceBorder}40;
          border-color: ${p.theme.colors.border};
        }
      }
    `}
`;

// Engineer-view row layout under the single-layer markup model:
//   Service · Action · Time · Vendor · Markup · Charged · Credits · Bucket
// HeaderRow + every RowHeader use this exact template so columns line up.
// Fixed widths on every column except Action are intentional — using `auto`
// would let each grid pick its own column widths (since header text and row
// content have different lengths) and the columns would visibly misalign.
// On mobile the layout collapses to the legacy 3-column shape.
const ENGINEER_GRID = `
  72px
  minmax(0, 1fr)
  108px
  84px
  56px
  84px
  64px
  88px
`;

export const RowHeader = styled.div`
  display: grid;
  grid-template-columns: ${ENGINEER_GRID};
  gap: 0.75rem;
  align-items: baseline;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: auto auto;
    gap: 0.25rem 0.5rem;
  }
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${ENGINEER_GRID};
  gap: 0.75rem;
  align-items: baseline;
  padding: 0 0.75rem 0.5rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  margin-bottom: 0.5rem;

  ${(p) => p.theme.media.mobile} {
    display: none;
  }
`;

export const HeaderCell = styled.button<{ $sortable?: boolean; $active?: boolean; $align?: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) => (p.$active ? p.theme.colors.foreground : p.theme.colors.muted)};
  cursor: ${(p) => (p.$sortable ? 'pointer' : 'default')};
  justify-content: ${(p) => (p.$align === 'right' ? 'flex-end' : 'flex-start')};

  &:hover {
    color: ${(p) => (p.$sortable ? p.theme.colors.foreground : p.theme.colors.muted)};
  }
`;

export const SortChevron = styled.span<{ $dir: 'asc' | 'desc' }>`
  font-size: 0.625rem;
  line-height: 1;
  transform: ${(p) => (p.$dir === 'asc' ? 'rotate(180deg)' : 'none')};
  transition: transform 120ms ease;
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

// Right-aligned cost cells. width: 100% makes the span fill its fixed-width
// grid track so text-align: right pushes the value to the column's right edge,
// matching the header cell's flex-end alignment.
export const Cost = styled.span`
  display: block;
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
  text-align: right;
`;

export const VendorCost = styled.span`
  display: block;
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.muted};
  text-align: right;
`;

export const CreditsCell = styled.span`
  display: block;
  width: 100%;
  font-size: 0.8125rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.foreground};
  text-align: right;
`;

// Pill is content-sized; sits at the left of its grid cell so the header
// "PLAN" label (also left-aligned) lines up directly above it.
export const PlanCell = styled.span<{ $kind: 'allowance' | 'topup' | 'mixed' | 'none' }>`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  text-align: center;
  background: ${(p) => {
    switch (p.$kind) {
      case 'allowance':
        return `${p.theme.colors.accent}1A`;
      case 'topup':
        return `${p.theme.colors.warning}22`;
      case 'mixed':
        return `${p.theme.colors.tertiary}22`;
      default:
        return 'transparent';
    }
  }};
  color: ${(p) => (p.$kind === 'none' ? p.theme.colors.muted : p.theme.colors.foreground)};
`;

export const Muted = styled.span`
  color: ${(p) => p.theme.colors.muted};
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
  padding: 0.25rem 0.75rem;
  margin-bottom: 0;
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

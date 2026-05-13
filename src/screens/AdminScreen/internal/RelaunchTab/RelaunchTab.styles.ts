import styled, { css } from 'styled-components';
import { onAccent } from '@/theme/theme';

// Reuses the same card/field/StatusLine motifs as PromotionalEmailsTab so
// both tabs feel like one console. Only adds the table primitives needed
// for the recipient roster.

export const Card = styled.section`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

export const Stat = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
  }
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => (p.$active ? p.theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? onAccent : p.theme.colors.muted)};
  cursor: pointer;

  &:hover {
    color: ${(p) => (p.$active ? onAccent : p.theme.colors.foreground)};
  }
`;

export const BatchControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
`;

export const SmallInput = styled.input`
  width: 5rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const InlineLabel = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const TableWrap = styled.div`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

export const Th = styled.th`
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
  padding: 0.625rem 0.875rem;
  background: ${(p) => p.theme.colors.background};
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const Td = styled.td<{ $muted?: boolean }>`
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => (p.$muted ? p.theme.colors.muted : p.theme.colors.foreground)};
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

export const Tr = styled.tr<{ $dimmed?: boolean }>`
  ${(p) =>
    p.$dimmed &&
    css`
      opacity: 0.55;
    `}

  &:last-child td {
    border-bottom: none;
  }
`;

export const Pill = styled.span<{ $kind: 'pending' | 'sent' | 'failed' | 'skipped' | 'paying' | 'signedUp' }>`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  ${(p) =>
    p.$kind === 'sent' &&
    css`
      background: ${p.theme.colors.accent}22;
      color: ${p.theme.colors.accent};
    `}
  ${(p) =>
    p.$kind === 'pending' &&
    css`
      background: ${p.theme.colors.surfaceBorder};
      color: ${p.theme.colors.muted};
    `}
  ${(p) =>
    p.$kind === 'failed' &&
    css`
      background: ${p.theme.colors.error}22;
      color: ${p.theme.colors.error};
    `}
  ${(p) =>
    p.$kind === 'skipped' &&
    css`
      background: ${p.theme.colors.surfaceBorder};
      color: ${p.theme.colors.muted};
    `}
  ${(p) =>
    p.$kind === 'paying' &&
    css`
      background: ${p.theme.colors.tertiaryMuted};
      color: ${p.theme.colors.tertiary};
    `}
  ${(p) =>
    p.$kind === 'signedUp' &&
    css`
      background: ${p.theme.colors.accent}22;
      color: ${p.theme.colors.accent};
    `}
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const AddRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  border: 1px dashed ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
`;

export const AddInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  > input[type='email'] {
    flex: 1;
    min-width: 14rem;
  }
`;

export const TemplateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const FieldLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.muted};
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
`;

export const PayingToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

export const InlineEdit = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

export const GrantCell = styled.span<{ $clickable: boolean }>`
  display: inline-block;
  ${(p) =>
    p.$clickable &&
    css`
      cursor: pointer;
      border-bottom: 1px dashed ${p.theme.colors.surfaceBorder};

      &:hover {
        color: ${p.theme.colors.foreground};
        border-bottom-color: ${p.theme.colors.accent};
      }
    `}
`;

export const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  justify-content: flex-end;
`;

export const RemoveButton = styled.button`
  font-size: 1rem;
  line-height: 1;
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.error};
    color: ${(p) => p.theme.colors.error};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RowButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.accent};
    color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  padding-top: 0.5rem;
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const StatusLine = styled.span<{ $kind: 'success' | 'error' | 'info' }>`
  font-size: 0.8125rem;
  color: ${(p) => {
    if (p.$kind === 'success') return p.theme.colors.accent;
    if (p.$kind === 'error') return p.theme.colors.error;
    return p.theme.colors.muted;
  }};
`;

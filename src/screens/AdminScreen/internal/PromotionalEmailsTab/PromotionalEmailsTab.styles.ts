import styled, { css } from 'styled-components';

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

export const Field = styled.label`
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

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const StatusLine = styled.span<{ $kind: 'success' | 'error' | 'info' }>`
  font-size: 0.8125rem;
  color: ${(p) =>
    p.$kind === 'success'
      ? p.theme.colors.accent
      : p.$kind === 'error'
        ? p.theme.colors.error
        : p.theme.colors.muted};
`;

// ── Campaign panel ─────────────────────────────────────────

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
`;

export const Stat = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
  }
`;

export const BatchControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
`;

export const SmallInput = styled.input`
  width: 6.5rem;
  padding: 0.5rem 0.625rem;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ConfirmInput = styled(SmallInput)`
  width: 15rem;
`;

export const Warning = styled.p`
  margin: 0;
  padding: 0.75rem 0.875rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-left: 3px solid ${(p) => p.theme.colors.tertiary};
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${(p) => p.theme.colors.muted};
  background: ${(p) => p.theme.colors.background};

  strong {
    color: ${(p) => p.theme.colors.foreground};
    font-weight: 600;
  }
`;

export const TableWrap = styled.div`
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  overflow: hidden;
  max-height: 22rem;
  overflow-y: auto;
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
  position: sticky;
  top: 0;
`;

export const Td = styled.td<{ $muted?: boolean }>`
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => (p.$muted ? p.theme.colors.muted : p.theme.colors.foreground)};
  vertical-align: middle;
  word-break: break-word;
`;

export const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
`;

export const Pill = styled.span<{ $kind: 'sent' | 'skipped' | 'failed' }>`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
  ${(p) =>
    p.$kind === 'sent' &&
    css`
      background: ${p.theme.colors.accent}22;
      color: ${p.theme.colors.accent};
    `}
  ${(p) =>
    p.$kind === 'skipped' &&
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
`;

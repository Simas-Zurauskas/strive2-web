import styled, { css } from 'styled-components';
import { Tooltip } from '@/components/Tooltip';
import type { FileDropzoneItemStatus } from './FileDropzone';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const DropArea = styled.button<{ $active: boolean }>`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 2.5rem 1.5rem;
  border-radius: 8px;
  border: 1.5px dashed ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.surfaceBorder)};
  background: ${(p) => (p.$active ? p.theme.colorsLib.secondary + '08' : p.theme.colors.surface)};
  text-align: center;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.2s ease;

  svg {
    width: 28px;
    height: 28px;
    color: ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.muted)};
    margin-bottom: 0.375rem;
    transition: color 0.15s ease;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      border-color: ${(p) => p.theme.colors.tertiary};
      box-shadow: var(--shadow-lift);

      svg {
        color: ${(p) => p.theme.colors.tertiary};
      }
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  ${(p) => p.theme.media.mobile} {
    padding: 1.75rem 1rem;
  }
`;

export const DropTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
`;

export const DropSub = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const DropHint = styled.span`
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.01em;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Row = styled.div<{ $failed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid
    ${(p) => (p.$failed ? `color-mix(in srgb, ${p.theme.colors.error} 35%, ${p.theme.colors.surfaceBorder})` : p.theme.colors.surfaceBorder)};
  box-shadow: var(--shadow-card);
`;

export const RowIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.muted};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RowBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const RowNameLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  min-width: 0;
`;

export const RowName = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const RowSize = styled.span`
  flex-shrink: 0;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-variant-numeric: tabular-nums;
`;

/* Baseline-aligned row, centered icon — matches the old inline icon. */
export const WarningTip = styled(Tooltip)`
  flex-shrink: 0;
  align-self: center;
`;

export const WarningIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${(p) => p.theme.colors.warning};

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const WarningTooltipContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RowError = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  line-height: 1.4;
  margin: 0;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 3px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.accent};
  transition: width 0.2s ease;
`;

const chipTone = (status: FileDropzoneItemStatus) => {
  switch (status) {
    case 'parsed':
      return css`
        background: ${(p) => p.theme.colorsLib.green + '20'};
        color: ${(p) => p.theme.colors.success};
      `;
    case 'rejected':
    case 'failed':
    case 'error':
      return css`
        background: ${(p) => p.theme.colorsLib.red + '15'};
        color: ${(p) => p.theme.colors.error};
      `;
    case 'parsing':
    case 'uploading':
      return css`
        background: ${(p) => p.theme.colorsLib.secondary + '15'};
        color: ${(p) => p.theme.colors.tertiary};
      `;
    default:
      return css`
        background: ${(p) => p.theme.colorsLib.gray900 + '0d'};
        color: ${(p) => p.theme.colors.muted};
      `;
  }
};

export const StatusChip = styled.span<{ $status: FileDropzoneItemStatus }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  ${(p) => chipTone(p.$status)}
`;

export const RemoveButton = styled.button`
  all: unset;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  color: ${(p) => p.theme.colors.muted};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      color: ${(p) => p.theme.colors.error};
      background: ${(p) => p.theme.colorsLib.red + '10'};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

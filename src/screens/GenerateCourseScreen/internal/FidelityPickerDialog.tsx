'use client';

import { useState } from 'react';
import { AlertDialog } from '@/components';
import * as S from './FidelityPickerDialog.styles';
import type { SourceFidelity } from '@/api/types';

/**
 * Learner-facing copy for the three fidelity levels. Keys are the
 * OpenAPI-backed `SourceFidelity` enum, so a new server-side level fails
 * this Record at compile time until copy is added.
 */
const FIDELITY_COPY: Record<SourceFidelity, { label: string; description: string }> = {
  strict: {
    label: 'Strict',
    description: 'Stays inside your documents — nothing is added beyond what they say.',
  },
  guided: {
    label: 'Guided',
    description: 'Grounded in your documents, with connective explanations where they help.',
  },
  enrich: {
    label: 'Enrich',
    description: 'Your documents as the backbone, enriched with wider context and examples.',
  },
};

const FIDELITY_ORDER: SourceFidelity[] = ['strict', 'guided', 'enrich'];

interface FidelityPickerDialogProps {
  open: boolean;
  value: SourceFidelity;
  onSelect: (fidelity: SourceFidelity) => void;
  onCancel: () => void;
}

export const fidelityLabel = (fidelity: SourceFidelity): string => FIDELITY_COPY[fidelity].label;

export const fidelityDescription = (fidelity: SourceFidelity): string => FIDELITY_COPY[fidelity].description;

/**
 * Modal picker for the source-fidelity dial (default `guided`). Composed
 * on AlertDialog so focus trapping, scroll lock, Escape and the portal
 * come for free; the option cards live in the dialog's description slot.
 * The inner component mounts only while open, so the local selection
 * re-seeds from `value` on every open without a sync effect.
 */
export const FidelityPickerDialog = (props: FidelityPickerDialogProps) => {
  if (!props.open) return null;
  return <FidelityPickerDialogInner {...props} />;
};

const FidelityPickerDialogInner = ({ open, value, onSelect, onCancel }: FidelityPickerDialogProps) => {
  const [selected, setSelected] = useState<SourceFidelity>(value);

  return (
    <AlertDialog
      open={open}
      title="How closely should we follow your documents?"
      description={
        <S.Options role="radiogroup" aria-label="Source fidelity">
          {FIDELITY_ORDER.map((key) => (
            <S.OptionRow
              key={key}
              type="button"
              role="radio"
              aria-checked={selected === key}
              $selected={selected === key}
              onClick={() => setSelected(key)}
            >
              <S.OptionLabelLine>
                <S.OptionLabel>{FIDELITY_COPY[key].label}</S.OptionLabel>
                {key === 'guided' && <S.RecommendedTag>Recommended</S.RecommendedTag>}
              </S.OptionLabelLine>
              <S.OptionDescription>{FIDELITY_COPY[key].description}</S.OptionDescription>
            </S.OptionRow>
          ))}
        </S.Options>
      }
      confirmLabel="Use this fidelity"
      cancelLabel="Cancel"
      variant="default"
      onConfirm={() => onSelect(selected)}
      onCancel={onCancel}
    />
  );
};

'use client';

import { useState } from 'react';
import * as S from './FontScaler.styles';

const SCALES = [1, 1.075, 1.15] as const;
const LABELS = ['Default', 'M', 'L'] as const;
const STORAGE_KEY = 'strive:lessonFontScale';

const getSavedScale = (): number => {
  if (typeof window === 'undefined') return 1;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = parseFloat(saved);
    if ((SCALES as readonly number[]).includes(parsed)) return parsed;
  }
  return 1;
};

interface FontScalerProps {
  scale: number;
  onChange: (scale: number) => void;
}

export const FontScaler = ({ scale, onChange }: FontScalerProps) => {
  return (
    <S.Container>
      {SCALES.map((s, i) => (
        <S.ScaleButton
          key={s}
          $active={scale === s}
          onClick={() => onChange(s)}
          aria-label={`Font size ${LABELS[i]}`}
          style={{ fontSize: `${0.6875 + i * 0.075}rem` }}
        >
          A
        </S.ScaleButton>
      ))}
    </S.Container>
  );
};

export { getSavedScale, STORAGE_KEY };

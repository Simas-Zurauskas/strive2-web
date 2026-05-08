'use client';

import { Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './NarrationAnimation.styles';

// A stylised lesson page is being read aloud. A reading "head" sweeps
// vertically down the page, lighting each prose row as it passes (warm
// tertiary), then HOPS over the code block (which dims and shows a
// "skipped" badge), continues onto the next prose row. Below the page,
// a small voice waveform pulses in time with the head's position so
// the user feels the audio is the cause, not just a decoration.

const LINES = [
  { kind: 'prose' as const, w: 88 },
  { kind: 'prose' as const, w: 72 },
  { kind: 'prose' as const, w: 84 },
  { kind: 'code'  as const, w: 72 },
  { kind: 'prose' as const, w: 64 },
  { kind: 'prose' as const, w: 80 },
];

const TICK_MS = 900;

export const NarrationAnimation = () => {
  const { prefersReduced } = useMotion();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setHead((h) => (h + 1) % LINES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const onCodeBlock = LINES[head].kind === 'code';

  return (
    <S.Wrap aria-hidden>
      <S.LessonBlock>
        {LINES.map((line, i) => {
          const isHere = i === head;
          if (line.kind === 'code') {
            return (
              <S.CodeBlock key={i} $skipping={isHere}>
                <S.SkippedBadge $on={isHere}>skipped</S.SkippedBadge>
                <S.CodeRow $w={70} />
                <S.CodeRow $w={48} />
                <S.CodeRow $w={62} />
              </S.CodeBlock>
            );
          }
          return (
            <S.ProseRow
              key={i}
              $w={line.w}
              $reading={isHere}
              $read={i < head}
            />
          );
        })}
      </S.LessonBlock>

      <S.WaveRow>
        <S.WaveIcon>
          <Volume2 size={14} strokeWidth={2} />
        </S.WaveIcon>
        <S.Wave>
          <S.PausedLine $shown={onCodeBlock} />
          {Array.from({ length: 18 }).map((_, i) => (
            <S.Bar key={i} $i={i} $hidden={onCodeBlock} />
          ))}
        </S.Wave>
        <S.WaveLabel>
          <S.WaveLabelSpacer aria-hidden>reading aloud</S.WaveLabelSpacer>
          <S.WaveLabelText $shown={!onCodeBlock}>reading aloud</S.WaveLabelText>
          <S.WaveLabelText $shown={onCodeBlock}>pause</S.WaveLabelText>
        </S.WaveLabel>
      </S.WaveRow>
    </S.Wrap>
  );
};

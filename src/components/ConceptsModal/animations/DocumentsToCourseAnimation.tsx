'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './DocumentsToCourseAnimation.styles';

// Sources on the left light up one at a time; a dot carries each across
// the flow line and the course outline on the right fills in a little
// further — documents in, course out. Idiom mirrors the other concept
// animations: decorative (aria-hidden), interval-driven, and rendered as
// the finished state under prefers-reduced-motion.

const SOURCES = [
  { kind: 'PDF', label: 'notes.pdf' },
  { kind: 'Slides', label: 'week-3.pptx' },
  { kind: 'Audio', label: 'lecture.mp3' },
] as const;

const OUTLINE_ROWS = [
  { w: 70 },
  { w: 52, indent: true },
  { w: 58, indent: true },
  { w: 66 },
  { w: 48, indent: true },
  { w: 56, indent: true },
] as const;

const TICK_MS = 1400;

export const DocumentsToCourseAnimation = () => {
  const { prefersReduced } = useMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % SOURCES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const active = prefersReduced ? SOURCES.length - 1 : step;
  const litRows = active * 2 + 1;

  return (
    <S.Wrap aria-hidden>
      <S.SourcesCol>
        <S.ColLabel>your materials</S.ColLabel>
        {SOURCES.map((src, i) => (
          <S.SourceCard key={src.label} $active={i === active}>
            <S.SourceKind>{src.kind}</S.SourceKind>
            <S.SourceName>{src.label}</S.SourceName>
          </S.SourceCard>
        ))}
      </S.SourcesCol>

      <S.Flow>
        <S.FlowLine />
        {/* Re-mounting per step restarts the travel keyframe. */}
        <S.FlowDot key={active} $animate={!prefersReduced} />
      </S.Flow>

      <S.CourseCol>
        <S.ColLabel>your course</S.ColLabel>
        <S.OutlineCard>
          {OUTLINE_ROWS.map((row, i) => (
            <S.OutlineRow key={i} $w={row.w} $indent={'indent' in row && row.indent} $lit={i <= litRows} />
          ))}
        </S.OutlineCard>
      </S.CourseCol>
    </S.Wrap>
  );
};
